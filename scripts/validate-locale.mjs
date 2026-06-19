import fs from "node:fs/promises";
import path from "node:path";
import {
  MODULE_ID,
  PROJECT_DIR,
  SUPPORTED_ADDONS,
  flattenLeaves,
  mergeLocaleSections,
  readJson
} from "./module-utils.mjs";

const packageJson = await readJson(path.join(PROJECT_DIR, "package.json"));
const manifest = await readJson(path.join(PROJECT_DIR, "module", "module.json"));
const { locale, files } = await mergeLocaleSections();
const localeEntries = flattenLeaves(locale).size;

if (packageJson.name !== MODULE_ID) {
  throw new Error(`package.json name must be ${MODULE_ID}; found ${packageJson.name}`);
}

if (packageJson.version !== manifest.version) {
  throw new Error(`package.json version ${packageJson.version} does not match module.json ${manifest.version}`);
}

if (manifest.id !== MODULE_ID) {
  throw new Error(`module.json id must be ${MODULE_ID}; found ${manifest.id}`);
}

const language = manifest.languages?.find((entry) => entry.lang === "zh-TW");
if (!language || language.path !== "lang/zh-TW.json") {
  throw new Error("module.json must declare zh-TW at lang/zh-TW.json");
}

const duplicateAddons = SUPPORTED_ADDONS.filter((id, index) => SUPPORTED_ADDONS.indexOf(id) !== index);
if (duplicateAddons.length) {
  throw new Error(`Duplicate add-on ids: ${duplicateAddons.join(", ")}`);
}

const localePath = path.join(PROJECT_DIR, "lang", "zh-TW.json");
try {
  const existing = await fs.readFile(localePath, "utf8");
  const expected = `${JSON.stringify(locale, null, 2)}\n`;
  if (existing !== expected) {
    throw new Error('lang/zh-TW.json is stale. Run "npm run merge:locale".');
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

console.log(`Locale sections: ${files.length}`);
console.log(`Locale entries: ${localeEntries}`);
console.log(`Supported add-on ids: ${SUPPORTED_ADDONS.length}`);
