import path from "node:path";
import { PROJECT_DIR, flattenLeaves, mergeLocaleSections, writeJson } from "./module-utils.mjs";

const { locale, files } = await mergeLocaleSections();
const localePath = path.join(PROJECT_DIR, "lang", "zh-TW.json");

await writeJson(localePath, locale);

console.log(`Merged ${files.length} locale sections into ${localePath}`);
console.log(`Locale entries: ${flattenLeaves(locale).size}`);
