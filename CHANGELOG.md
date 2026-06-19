# Changelog

## 0.3.0 - 2026-06-19

- Added `DHKUIR.*` Traditional Chinese strings for `daggerheart-kichwas-ui-refinement` settings.
- Added a version-gated companion runtime patch for `daggerheart-kichwas-ui-refinement` `1.3.0`.
- Localized Kichwas hardcoded settings through `game.settings.settings` without modifying upstream files.
- Added a small GM dice override compatibility shim that detects Hope/Fear dice by Daggerheart form fields instead of visible English labels.
- Kept core Hope/Fear terminology delegated to `daggerheart-zh-tw`.

## 0.2.0 - 2026-06-19

- Added the first production `zh-TW` overlays for `daggerheart-distances` (`DHD.*`) and `daggerheart-compact-sheets` (`DHCS.*`).
- Kept core `DAGGERHEART.*` terminology delegated to the separate `daggerheart-zh-tw` localization module.
- Enhanced the installed add-on audit script to report metadata, locale key paths, pack counts, and hardcoded UI candidate locations without copying upstream source text.
- Updated add-on inventory and translation status for the locale-only first milestone.
- Bumped the Foundry module and package versions to `0.2.0`.

## 0.1.0 - 2026-06-19

- Initialized the Daggerheart add-on Traditional Chinese companion localization module.
- Added Foundry manifest metadata and release URLs.
- Added GitHub Actions release workflow for `module.json` and `daggerheart-addons-zh-tw.zip`.
- Added add-on inventory, translation status, style guide, locale section structure, and build/validation scripts.
- No production add-on translations are included yet.
