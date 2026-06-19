import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const MODULE_ID = "daggerheart-addons-zh-tw";
export const PROJECT_DIR = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
export const DEFAULT_MODULES_DIR = "D:\\FVTT\\Data\\modules";

export const SUPPORTED_ADDONS = Object.freeze([
  "daggerheart-advmanager",
  "daggerheart-compact-sheets",
  "daggerheart-distances",
  "daggerheart-kichwas-ui-refinement",
  "daggerheart-quickactions",
  "daggerheart-quickrules",
  "daggerheart-store"
]);

export function resolveModulesDir() {
  return path.resolve(process.env.FOUNDRY_MODULES_DIR || DEFAULT_MODULES_DIR);
}

export async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

export async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function deepMerge(base, overlay) {
  const result = clone(base);
  for (const [key, value] of Object.entries(overlay)) {
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = clone(value);
    }
  }
  return result;
}

export function flattenLeaves(value, prefix = "", out = new Map()) {
  if (isPlainObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      flattenLeaves(child, prefix ? `${prefix}.${key}` : key, out);
    }
  } else {
    out.set(prefix, value);
  }
  return out;
}

export async function copyDir(source, target) {
  await fs.mkdir(target, { recursive: true });
  for (const entry of await fs.readdir(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      await copyDir(sourcePath, targetPath);
    } else if (entry.isFile()) {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

export function ensureSafeModuleTarget(targetDir, modulesDir) {
  const resolvedTarget = path.resolve(targetDir);
  const resolvedModules = path.resolve(modulesDir);
  const relative = path.relative(resolvedModules, resolvedTarget);

  if (path.basename(resolvedTarget) !== MODULE_ID) {
    throw new Error(`Refusing to write outside the ${MODULE_ID} module folder: ${resolvedTarget}`);
  }

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside Foundry modules directory: ${resolvedTarget}`);
  }
}

export async function mergeLocaleSections() {
  const sectionsDir = path.join(PROJECT_DIR, "source", "locale-sections");
  const files = (await fs.readdir(sectionsDir))
    .filter((file) => file.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b));

  let merged = {};
  for (const file of files) {
    const section = await readJson(path.join(sectionsDir, file));
    merged = deepMerge(merged, section);
  }

  return { locale: merged, files };
}
