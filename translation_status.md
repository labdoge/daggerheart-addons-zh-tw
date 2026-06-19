# Translation Status

Version: `0.2.0`

The v0.2.0 milestone begins production localization with safe locale overlays only. It does not add runtime patches and does not translate compendium content.

| Area | Status |
|---|---|
| Module manifest | Ready for `0.2.0` |
| Release workflow | Ready |
| Locale merge/build scripts | Ready |
| Add-on audit script | Enhanced metadata/key/count/location audit |
| `daggerheart-compact-sheets` UI overlay | Ready for Foundry testing |
| `daggerheart-distances` UI overlay | Ready for Foundry testing |
| Runtime patches | Not started |
| Add-on compendium translations | Not started |

## Current Translation Scope

- `daggerheart-compact-sheets`: translates upstream `DHCS.*` keys only.
- `daggerheart-distances`: translates upstream `DHD.*` keys only.
- Core Daggerheart terms stay in `daggerheart-zh-tw`; this repo does not duplicate `DAGGERHEART.*`.

## Hardcoded UI Backlog

- `daggerheart-advmanager`: settings, ApplicationV2 titles, templates, chat cards, and pack labels need upstream i18n work.
- `daggerheart-kichwas-ui-refinement`: settings labels/hints are the smallest upstream i18n candidate.
- `daggerheart-quickactions`: apps, chat cards, templates, scan defaults, and settings need a full i18n pass.
- `daggerheart-quickrules`: UI and SRD journal/pack content must be handled separately.
- `daggerheart-store`: store UI, dialogs, templates, settings, and pack content need upstream i18n or carefully scoped later patches.

## Verification

```powershell
npm run merge:locale
npm run validate
npm run build:dist
```

For local Foundry testing, enable `daggerheart`, `daggerheart-zh-tw`, this companion module, `daggerheart-distances`, and `daggerheart-compact-sheets`, then switch Foundry to `zh-TW`.
