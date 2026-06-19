const MODULE_ID = "daggerheart-addons-zh-tw";
const KICHWAS_ID = "daggerheart-kichwas-ui-refinement";
const SUPPORTED_KICHWAS_VERSION = "1.3.0";
const ZH_TW = "zh-TW";

const SETTINGS = Object.freeze([
  "moveSpellcastingTrait",
  "lockFearTacker",
  "PositionHorizontalFearTacker",
  "PositionVerticalFearTacker",
  "FearTackerFontSize",
  "cheatDieRolls"
]);

const DICE_SELECTORS = Object.freeze([
  { dieType: "hope", dieKey: "dHope", coreKey: "DAGGERHEART.GENERAL.hope" },
  { dieType: "fear", dieKey: "dFear", coreKey: "DAGGERHEART.GENERAL.fear" }
]);

let warnedUnsupportedVersion = false;

function getKichwasModule() {
  return game.modules.get(KICHWAS_ID);
}

function getKichwasVersion(module) {
  return module?.version ?? module?.manifest?.version ?? "";
}

function isTraditionalChinese() {
  return game.i18n?.lang === ZH_TW;
}

function hasCompanionLocale() {
  const key = "DHKUIR.Settings.cheatDieRolls.Name";
  if (game.i18n?.has) return game.i18n.has(key);
  const localized = game.i18n?.localize?.(key);
  return Boolean(localized) && localized !== key;
}

function isSupportedKichwasActive() {
  const kichwas = getKichwasModule();
  if (!kichwas?.active) return false;

  const version = getKichwasVersion(kichwas);
  if (version === SUPPORTED_KICHWAS_VERSION) return true;

  if (!warnedUnsupportedVersion) {
    warnedUnsupportedVersion = true;
    console.warn(
      `${MODULE_ID}: skipped ${KICHWAS_ID} runtime patch; expected ${SUPPORTED_KICHWAS_VERSION}, found ${version || "unknown"}.`
    );
  }

  return false;
}

function shouldPatchKichwas() {
  return isSupportedKichwasActive() && isTraditionalChinese() && hasCompanionLocale();
}

function patchSettingsLabels() {
  if (!shouldPatchKichwas()) return;

  for (const settingId of SETTINGS) {
    const setting = game.settings.settings.get(`${KICHWAS_ID}.${settingId}`);
    if (!setting) continue;

    setting.name = `DHKUIR.Settings.${settingId}.Name`;
    setting.hint = `DHKUIR.Settings.${settingId}.Hint`;
  }
}

function isCheatDiceEnabled() {
  try {
    return game.settings.get(KICHWAS_ID, "cheatDieRolls") === true;
  } catch {
    return false;
  }
}

function ensureRollOverride(app) {
  app.config ??= {};
  app.config.roll ??= {};
  app.config.roll.override ??= {};
  return app.config.roll.override;
}

function setRollOverride(app, dieType, value) {
  const override = ensureRollOverride(app);

  if (Number.isFinite(value)) {
    override[dieType] = value;
  } else {
    delete override[dieType];
  }

  if (!Object.keys(override).length) {
    delete app.config.roll.override;
  }
}

function getDieFaces(select) {
  const value = Number(String(select.value ?? "").replace(/\D/g, ""));
  return Number.isFinite(value) && value > 0 ? value : 12;
}

function getValidOverride(input, maxFaces) {
  input.value = String(input.value ?? "").replace(/\D/g, "");
  const value = Number(input.value);

  if (!Number.isFinite(value) || value < 1) return null;
  if (value > maxFaces) {
    input.value = String(maxFaces);
    return maxFaces;
  }

  return value;
}

function getDieLabel(coreKey) {
  const term = game.i18n.localize(coreKey);
  return `${term}骰`;
}

function updateOverrideInput(app, dieType, input, maxFaces) {
  setRollOverride(app, dieType, getValidOverride(input, maxFaces));
}

function updateControlState({ app, dieType, select, chip, input }) {
  const enabled = app.overrideDice?.[dieType] === true;
  select.classList.toggle("kichwas-override-hidden", enabled);
  select.disabled = enabled;
  input.classList.toggle("kichwas-override-hidden", !enabled);
  input.disabled = !enabled;
  chip.classList.toggle("selected", enabled);

  const icon = chip.querySelector("i");
  if (icon) {
    icon.classList.toggle("fa-solid", enabled);
    icon.classList.toggle("fa-regular", !enabled);
  }
}

function createOverrideInput({ app, dieType, dieKey, select, maxFaces }) {
  const input = document.createElement("input");
  input.type = "number";
  input.name = `roll.dice.${dieKey}Override`;
  input.min = "1";
  input.step = "1";
  input.setAttribute("list", "kichwas-die-value-list");
  input.className = "kichwas-override-value";
  input.dataset.dieType = dieType;
  input.max = String(maxFaces);
  input.placeholder = `1-${maxFaces}`;

  const savedOverride = app.config?.roll?.override?.[dieType];
  input.value = Number.isFinite(savedOverride) ? String(savedOverride) : "";
  input.disabled = app.overrideDice?.[dieType] !== true;
  input.classList.toggle("kichwas-override-hidden", app.overrideDice?.[dieType] !== true);

  input.addEventListener("input", () => updateOverrideInput(app, dieType, input, maxFaces));
  input.addEventListener("change", () => updateOverrideInput(app, dieType, input, maxFaces));
  input.addEventListener("blur", () => {
    const currentOverride = app.config?.roll?.override?.[dieType];
    input.value = Number.isFinite(currentOverride) ? String(currentOverride) : "";
  });

  return input;
}

function createOverrideChip({ app, dieType, coreKey, select, input, maxFaces }) {
  const chip = document.createElement("div");
  chip.className = "reaction-chip kichwas-override-chip";
  chip.dataset.dieType = dieType;
  chip.innerHTML = '<span><i class="fa-regular fa-circle"></i></span>';

  const label = game.i18n.format("DHKUIR.Reroll.ToggleDieOverride", {
    die: getDieLabel(coreKey)
  });
  chip.title = label;
  chip.setAttribute("aria-label", label);

  chip.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    app.overrideDice ??= { hope: false, fear: false };
    app.overrideDice[dieType] = !app.overrideDice[dieType];

    if (app.overrideDice[dieType]) {
      setRollOverride(app, dieType, getValidOverride(input, maxFaces));
    } else {
      setRollOverride(app, dieType, null);
    }

    updateControlState({ app, dieType, select, chip, input });
  });

  return chip;
}

function patchDiceOption(app, diceSection, { dieType, dieKey, coreKey }) {
  const select = diceSection.querySelector(`select[name="roll.dice.${dieKey}"]`);
  if (!select || select.dataset.kichwasPatched) return;

  const diceOption = select.closest(".dice-option");
  const container = select.parentElement;
  if (!diceOption || !container) return;

  app.overrideDice ??= { hope: false, fear: false };
  const maxFaces = getDieFaces(select);
  const input = createOverrideInput({ app, dieType, dieKey, select, maxFaces });
  const chip = createOverrideChip({ app, dieType, coreKey, select, input, maxFaces });

  select.dataset.kichwasPatched = "1";
  select.classList.add("kichwas-override-die-select");

  const label = diceOption.querySelector(".label");
  container.insertBefore(chip, label ?? select);
  container.insertBefore(input, select.nextSibling);
  updateControlState({ app, dieType, select, chip, input });
}

function patchD20RollDialog(app, html) {
  if (!shouldPatchKichwas() || !game.user?.isGM || !isCheatDiceEnabled()) return;
  if (!app.constructor?.name?.includes("D20RollDialog")) return;

  const diceSection = html.querySelector?.(".dices-section");
  if (!diceSection) return;

  for (const diceConfig of DICE_SELECTORS) {
    patchDiceOption(app, diceSection, diceConfig);
  }
}

Hooks.once("setup", patchSettingsLabels);
Hooks.once("ready", patchSettingsLabels);

Hooks.on("renderApplicationV2", (app, html) => {
  patchD20RollDialog(app, html);
});
