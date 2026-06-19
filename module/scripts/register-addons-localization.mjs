import "./kichwas-ui-refinement-compat.mjs";

const MODULE_ID = "daggerheart-addons-zh-tw";

const SUPPORTED_ADDONS = Object.freeze([
  "daggerheart-advmanager",
  "daggerheart-compact-sheets",
  "daggerheart-distances",
  "daggerheart-kichwas-ui-refinement",
  "daggerheart-quickactions",
  "daggerheart-quickrules",
  "daggerheart-store"
]);

Hooks.once("init", () => {
  globalThis.daggerheartAddonsZhTw = Object.freeze({
    moduleId: MODULE_ID,
    supportedAddons: SUPPORTED_ADDONS
  });
});
