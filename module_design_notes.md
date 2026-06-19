# Module Design Notes

Module id: `daggerheart-addons-zh-tw`

This module is a companion to `daggerheart-zh-tw`, not a replacement for it.

## Scope

- Provide Traditional Chinese overlays for Daggerheart-related add-on modules.
- Keep each add-on's translations in a separate source section.
- Preserve a single release manifest and zip so FVTT users install one companion module.
- Avoid bundling upstream add-on source files or generated English-source audit material.

## Non-goals

- Do not modify installed add-on folders directly.
- Do not require every tracked add-on to be installed.
- Do not mark an add-on as translated before testing it in Foundry.
- Do not duplicate the core Daggerheart system localization.

## Build

`npm run build:dist` merges `source/locale-sections/*.json`, writes `lang/zh-TW.json`, copies `module/` into `dist/daggerheart-addons-zh-tw`, and writes the merged language file into the built module.

`npm run build` performs the same build and installs it to `D:\FVTT\Data\modules\daggerheart-addons-zh-tw` unless `FOUNDRY_MODULES_DIR` is set.
