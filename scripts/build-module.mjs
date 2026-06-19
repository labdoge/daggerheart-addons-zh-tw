import fs from "node:fs/promises";
import path from "node:path";
import {
  MODULE_ID,
  PROJECT_DIR,
  copyDir,
  ensureSafeModuleTarget,
  flattenLeaves,
  mergeLocaleSections,
  readJson,
  resolveModulesDir,
  writeJson
} from "./module-utils.mjs";

const args = new Set(process.argv.slice(2));
const shouldInstall = args.has("--install");

const moduleSourceDir = path.join(PROJECT_DIR, "module");
const rootLocalePath = path.join(PROJECT_DIR, "lang", "zh-TW.json");
const distDir = path.join(PROJECT_DIR, "dist", MODULE_ID);
const modulesDir = shouldInstall ? resolveModulesDir() : null;
const targetDir = shouldInstall ? path.join(modulesDir, MODULE_ID) : null;

const manifest = await readJson(path.join(moduleSourceDir, "module.json"));
if (manifest.id !== MODULE_ID) {
  throw new Error(`module.json id must be ${MODULE_ID}; found ${manifest.id}`);
}

const { locale } = await mergeLocaleSections();
const localeEntryCount = flattenLeaves(locale).size;

await writeJson(rootLocalePath, locale);
await fs.rm(distDir, { recursive: true, force: true });
await copyDir(moduleSourceDir, distDir);
await writeJson(path.join(distDir, "lang", "zh-TW.json"), locale);

console.log(`Built ${distDir}`);
console.log(`Locale entries: ${localeEntryCount}`);

if (shouldInstall) {
  ensureSafeModuleTarget(targetDir, modulesDir);
  await fs.rm(targetDir, { recursive: true, force: true });
  await copyDir(distDir, targetDir);
  console.log(`Installed ${targetDir}`);
}
