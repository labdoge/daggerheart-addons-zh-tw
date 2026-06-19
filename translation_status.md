# Translation Status

Version: `0.3.0`

The v0.3.0 milestone adds the first narrow, version-gated runtime patch while keeping all changes inside this companion module. It does not translate compendium content.

| Area | Status |
|---|---|
| Module manifest | Ready for `0.3.0` |
| Release workflow | Ready |
| Locale merge/build scripts | Ready |
| Add-on audit script | Enhanced metadata/key/count/location audit |
| `daggerheart-compact-sheets` UI overlay | Ready for Foundry testing |
| `daggerheart-distances` UI overlay | Ready for Foundry testing |
| `daggerheart-kichwas-ui-refinement` settings/runtime patch | Ready for Foundry testing against `1.3.0` |
| Runtime patches | Started with Kichwas `1.3.0` only |
| Add-on compendium translations | Not started |

## Current Translation Scope

- `daggerheart-compact-sheets`: translates upstream `DHCS.*` keys only.
- `daggerheart-distances`: translates upstream `DHD.*` keys only.
- `daggerheart-kichwas-ui-refinement`: translates companion `DHKUIR.*` keys and applies a pure companion runtime patch for upstream `1.3.0` settings plus GM Hope/Fear dice override compatibility.
- Core Daggerheart terms stay in `daggerheart-zh-tw`; this repo does not duplicate `DAGGERHEART.*`.

## Hardcoded UI Backlog

- `daggerheart-advmanager`: settings, ApplicationV2 titles, templates, chat cards, and pack labels need upstream i18n work.
- `daggerheart-quickactions`: apps, chat cards, templates, scan defaults, and settings need a full i18n pass.
- `daggerheart-quickrules`: UI and SRD journal/pack content must be handled separately.
- `daggerheart-store`: store UI, dialogs, templates, settings, and pack content need upstream i18n or carefully scoped later patches.

## Verification

```powershell
npm run merge:locale
npm run validate
npm run build:dist
```

For local Foundry testing, enable `daggerheart`, `daggerheart-zh-tw`, this companion module, `daggerheart-distances`, `daggerheart-compact-sheets`, and `daggerheart-kichwas-ui-refinement`, then switch Foundry to `zh-TW`.

Kichwas manual targets:

- Six Kichwas settings display Traditional Chinese labels and hints.
- Spellcasting trait display remains delegated to core `DAGGERHEART.*` localization.
- GM Duality Roll dialogs show one Hope/Fear dice override control each under Traditional Chinese labels, without duplicate controls after rerender.
