import fs from "node:fs/promises";
import path from "node:path";
import {
  MODULE_ID,
  PROJECT_DIR,
  SUPPORTED_ADDONS,
  isPlainObject,
  readJson,
  resolveModulesDir
} from "./module-utils.mjs";

const args = new Set(process.argv.slice(2));
const shouldPrintJson = args.has("--stdout");
const modulesDir = resolveModulesDir();
const ignored = new Set(["daggerheart-zh-tw", MODULE_ID]);
const generatedAt = new Date().toISOString();

const SOURCE_EXTENSIONS = new Set([".js", ".mjs", ".hbs", ".html"]);
const SKIPPED_SOURCE_DIRS = new Set([
  "assets",
  "docs",
  "lang",
  "languages",
  "packs",
  "styles"
]);

const HARDCODED_PATTERNS = [
  { kind: "settingsNameOrHint", regex: /\b(?:name|hint):\s*["'`]/ },
  { kind: "windowTitle", regex: /\btitle:\s*["'`]/ },
  { kind: "uiLabel", regex: /\blabel:\s*["'`]/ },
  { kind: "templatePlainText", regex: />\s*[A-Za-z][^<{]*</ },
  { kind: "placeholderAttribute", regex: /\bplaceholder\s*=\s*["'][^"']*[A-Za-z]/ },
  { kind: "domInjection", regex: /\b(?:innerHTML|textContent)\s*=|insertAdjacentHTML|createElement\(/ },
  { kind: "chatCard", regex: /\bChatMessage\.|\.toMessage\(/ },
  { kind: "dialog", regex: /\bDialogV2\b|\bnew Dialog\b|\bDialog\./ },
  { kind: "renderTemplate", regex: /\brenderTemplate\(/ }
];

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeManifestEntry(entry) {
  if (typeof entry === "string") return entry;
  if (entry && typeof entry === "object") return entry.src || entry.path || entry.name || "";
  return "";
}

function relativePath(root, filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function flattenLeaves(value, prefix = "", out = []) {
  if (isPlainObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      flattenLeaves(child, prefix ? `${prefix}.${key}` : key, out);
    }
  } else {
    out.push(prefix);
  }
  return out;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function countFiles(dirPath) {
  if (!(await exists(dirPath))) return 0;

  let count = 0;
  for (const entry of await fs.readdir(dirPath, { withFileTypes: true })) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      count += await countFiles(entryPath);
    } else if (entry.isFile()) {
      count += 1;
    }
  }
  return count;
}

async function listSourceFiles(dirPath, root = dirPath) {
  const files = [];

  for (const entry of await fs.readdir(dirPath, { withFileTypes: true })) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const relParts = relativePath(root, entryPath).split("/");
      if (relParts.some((part) => SKIPPED_SOURCE_DIRS.has(part))) continue;
      files.push(...await listSourceFiles(entryPath, root));
      continue;
    }

    if (!entry.isFile()) continue;
    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) files.push(entryPath);
  }

  return files;
}

function extractStaticI18nKeys(text) {
  const keys = new Set();
  const patterns = [
    /\{\{\s*localize\s+["']([^"']+)["']/g,
    /\blocalize(?:Fallback)?\(\s*["']([^"']+)["']/g,
    /\bgame\.i18n\.localize\(\s*["']([^"']+)["']/g
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      if (!match[1].includes("${")) keys.add(match[1]);
    }
  }

  return keys;
}

function findHardcodedCandidates(text, filePath, addonDir) {
  const relFile = relativePath(addonDir, filePath);
  const lines = text.split(/\r?\n/);
  const findings = [];

  for (const [index, line] of lines.entries()) {
    if (line.includes("localize") || line.includes("game.i18n")) continue;

    for (const { kind, regex } of HARDCODED_PATTERNS) {
      regex.lastIndex = 0;
      if (regex.test(line)) {
        findings.push({
          file: relFile,
          line: index + 1,
          kind
        });
      }
    }
  }

  return findings;
}

async function auditLocaleFiles(addonDir, manifest) {
  const files = [];
  const manifestLanguages = toArray(manifest.languages);

  for (const language of manifestLanguages) {
    if (!language?.path) continue;
    const localePath = path.join(addonDir, language.path);
    try {
      const locale = await readJson(localePath);
      const keyPaths = flattenLeaves(locale).sort((a, b) => a.localeCompare(b));
      files.push({
        lang: language.lang || "",
        path: language.path,
        keyCount: keyPaths.length,
        keyPaths
      });
    } catch (error) {
      files.push({
        lang: language.lang || "",
        path: language.path,
        error: error.code || error.message
      });
    }
  }

  return files;
}

async function auditSource(addonDir) {
  const files = await listSourceFiles(addonDir);
  const keyPaths = new Set();
  const hardcodedCandidates = [];

  for (const filePath of files) {
    const text = await fs.readFile(filePath, "utf8");
    for (const key of extractStaticI18nKeys(text)) keyPaths.add(key);
    hardcodedCandidates.push(...findHardcodedCandidates(text, filePath, addonDir));
  }

  const hardcodedByKind = {};
  for (const finding of hardcodedCandidates) {
    hardcodedByKind[finding.kind] = (hardcodedByKind[finding.kind] || 0) + 1;
  }

  return {
    scannedFiles: files.map((filePath) => relativePath(addonDir, filePath)).sort((a, b) => a.localeCompare(b)),
    i18nKeyPaths: [...keyPaths].sort((a, b) => a.localeCompare(b)),
    hardcodedCandidates: {
      count: hardcodedCandidates.length,
      byKind: Object.fromEntries(Object.entries(hardcodedByKind).sort(([a], [b]) => a.localeCompare(b))),
      locations: hardcodedCandidates.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.kind.localeCompare(b.kind))
    }
  };
}

async function auditPacks(addonDir, manifest) {
  const packs = [];

  for (const pack of toArray(manifest.packs)) {
    const packPath = pack.path || path.join("packs", pack.name || "");
    packs.push({
      name: pack.name || "",
      label: pack.label || "",
      type: pack.type || "",
      path: packPath,
      fileCount: await countFiles(path.join(addonDir, packPath))
    });
  }

  return packs;
}

async function auditAddon(id) {
  const addonDir = path.join(modulesDir, id);
  const manifestPath = path.join(addonDir, "module.json");

  let manifest = null;
  try {
    manifest = await readJson(manifestPath);
  } catch (error) {
    return {
      id,
      found: false,
      listed: SUPPORTED_ADDONS.includes(id),
      error: error.code || error.message
    };
  }

  const [localeFiles, sourceAudit, packs] = await Promise.all([
    auditLocaleFiles(addonDir, manifest),
    auditSource(addonDir),
    auditPacks(addonDir, manifest)
  ]);

  return {
    id,
    found: true,
    listed: SUPPORTED_ADDONS.includes(id),
    title: manifest.title || "",
    version: manifest.version || "",
    languages: toArray(manifest.languages).map((language) => language.lang).filter(Boolean),
    entrypoints: {
      scripts: toArray(manifest.scripts).map(normalizeManifestEntry).filter(Boolean),
      esmodules: toArray(manifest.esmodules).map(normalizeManifestEntry).filter(Boolean),
      styles: toArray(manifest.styles).map(normalizeManifestEntry).filter(Boolean)
    },
    packs,
    localeFiles,
    localeKeyCount: localeFiles.reduce((sum, file) => sum + (file.keyCount || 0), 0),
    sourceFilesScanned: sourceAudit.scannedFiles.length,
    staticI18nKeyCount: sourceAudit.i18nKeyPaths.length,
    staticI18nKeyPaths: sourceAudit.i18nKeyPaths,
    hardcodedCandidates: sourceAudit.hardcodedCandidates
  };
}

async function writeTextIfPossible(filePath, text) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, text, "utf8");
    return true;
  } catch (error) {
    if (error.code === "EPERM" || error.code === "EACCES") {
      console.warn(`Warning: could not write ${filePath}: ${error.code}`);
      return false;
    }
    throw error;
  }
}

function renderMarkdown(audit) {
  return [
    "# Generated Daggerheart Add-on Audit",
    "",
    `Generated at: ${audit.generatedAt}`,
    `Modules dir: \`${audit.modulesDir}\``,
    "",
    "| Module ID | Version | Languages | Locale Keys | Static i18n Keys | Hardcoded Candidates | Packs | Listed |",
    "|---|---:|---|---:|---:|---:|---:|---|",
    ...audit.rows.map((row) => {
      return [
        row.id,
        row.version || "",
        (row.languages || []).join(", "),
        String(row.localeKeyCount || 0),
        String(row.staticI18nKeyCount || 0),
        String(row.hardcodedCandidates?.count || 0),
        String((row.packs || []).length),
        row.listed ? "yes" : "no"
      ].join(" | ");
    }).map((line) => `| ${line} |`),
    "",
    "This generated audit intentionally records key paths, counts, and file/line locations only. It does not copy upstream UI strings or source snippets."
  ].join("\n");
}

const addonIds = [];
for (const entry of await fs.readdir(modulesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const id = entry.name;
  if (!id.includes("daggerheart") || ignored.has(id)) continue;
  addonIds.push(id);
}

const rows = (await Promise.all(addonIds.sort((a, b) => a.localeCompare(b)).map(auditAddon)))
  .sort((a, b) => a.id.localeCompare(b.id));

const audit = {
  generatedAt,
  modulesDir,
  supportedAddons: SUPPORTED_ADDONS,
  rows
};

const outputJson = path.join(PROJECT_DIR, ".tmp", "addon_inventory.generated.json");
const outputMarkdown = path.join(PROJECT_DIR, ".tmp", "addon_inventory.generated.md");
const wroteJson = await writeTextIfPossible(outputJson, `${JSON.stringify(audit, null, 2)}\n`);
const wroteMarkdown = await writeTextIfPossible(outputMarkdown, `${renderMarkdown(audit)}\n`);

if (shouldPrintJson) console.log(JSON.stringify(audit, null, 2));

console.log(`Audited ${rows.length} Daggerheart-related modules from ${modulesDir}`);
if (wroteJson) console.log(`Wrote ${outputJson}`);
if (wroteMarkdown) console.log(`Wrote ${outputMarkdown}`);
