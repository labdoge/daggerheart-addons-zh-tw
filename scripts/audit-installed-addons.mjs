import fs from "node:fs/promises";
import path from "node:path";
import {
  MODULE_ID,
  PROJECT_DIR,
  SUPPORTED_ADDONS,
  readJson,
  resolveModulesDir,
  writeJson
} from "./module-utils.mjs";

const modulesDir = resolveModulesDir();
const ignored = new Set(["daggerheart-zh-tw", MODULE_ID]);
const rows = [];

for (const entry of await fs.readdir(modulesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const id = entry.name;
  if (!id.includes("daggerheart") || ignored.has(id)) continue;

  const manifestPath = path.join(modulesDir, id, "module.json");
  let manifest = null;
  try {
    manifest = await readJson(manifestPath);
  } catch {
    rows.push({ id, found: false });
    continue;
  }

  rows.push({
    id,
    found: true,
    listed: SUPPORTED_ADDONS.includes(id),
    title: manifest.title || "",
    version: manifest.version || "",
    languages: (manifest.languages || []).map((language) => language.lang),
    scripts: manifest.scripts || [],
    esmodules: manifest.esmodules || [],
    styles: manifest.styles || [],
    packs: (manifest.packs || []).map((pack) => pack.name)
  });
}

rows.sort((a, b) => a.id.localeCompare(b.id));

const outputJson = path.join(PROJECT_DIR, ".tmp", "addon_inventory.generated.json");
const outputMarkdown = path.join(PROJECT_DIR, ".tmp", "addon_inventory.generated.md");

await writeJson(outputJson, {
  generatedAt: new Date().toISOString(),
  modulesDir,
  rows
});

const markdown = [
  "# Generated Daggerheart Add-on Inventory",
  "",
  `Generated at: ${new Date().toISOString()}`,
  "",
  "| Module ID | Title | Version | Languages | Scripts | Packs | Listed |",
  "|---|---|---:|---|---:|---:|---|",
  ...rows.map((row) => {
    return [
      row.id,
      row.title || "",
      row.version || "",
      (row.languages || []).join(", "),
      String((row.scripts || []).length + (row.esmodules || []).length),
      String((row.packs || []).length),
      row.listed ? "yes" : "no"
    ].join(" | ");
  }).map((line) => `| ${line} |`)
].join("\n");

await fs.mkdir(path.dirname(outputMarkdown), { recursive: true });
await fs.writeFile(outputMarkdown, `${markdown}\n`, "utf8");

console.log(`Audited ${rows.length} Daggerheart-related modules from ${modulesDir}`);
console.log(`Wrote ${outputJson}`);
console.log(`Wrote ${outputMarkdown}`);
