# Daggerheart Add-on Inventory

Last checked: 2026-06-19

This file tracks the add-ons currently planned for this companion localization module. An add-on is only marked translated after its manifest language files, settings, templates, injected UI, chat cards, and compendium content have been audited or explicitly scoped out.

| Module ID | Title | Local Version | Manifest Languages | Current Strategy | Status |
|---|---|---:|---|---|---|
| `daggerheart-advmanager` | Daggerheart: Adversary Manager | `0.3.1` | none seen | Hardcoded UI backlog. Prefer upstream i18n for settings, ApplicationV2 titles, templates, chat cards, and pack labels. | Audited for metadata only |
| `daggerheart-compact-sheets` | Daggerheart: Compact Sheets | `1.5.2` | `en`, `ru` | `zh-TW` overlay for upstream `DHCS.*` keys; core `DAGGERHEART.*` remains in `daggerheart-zh-tw`. | v0.2.0 overlay ready for Foundry testing |
| `daggerheart-distances` | Daggerheart: Distances | `0.2.5` | `en`, `pt-BR`, `ru` | `zh-TW` overlay for upstream `DHD.*` keys. | v0.2.0 overlay ready for Foundry testing |
| `daggerheart-kichwas-ui-refinement` | Daggerheart: Kichwas' UI Refinement | `1.3.0` | none seen | Pure companion runtime patch: localize settings through `DHKUIR.*` and shim GM Hope/Fear dice override detection without upstream edits. | v0.3.0 runtime patch ready for Foundry testing |
| `daggerheart-quickactions` | Daggerheart: Quick Actions | `0.4.4` | none seen | Hardcoded apps, chat cards, templates, scan defaults, and settings. Audit first, then prioritize upstream i18n PRs. | Audited for metadata only |
| `daggerheart-quickrules` | Daggerheart: Quick Rules | `0.2.0` | none seen | Separate UI localization from SRD journal/pack content. Do not commit compendium translation in v0.2.0. | Audited for metadata only |
| `daggerheart-store` | Daggerheart: Store | `0.5.6` | none seen | Hardcoded store UI, dialogs, templates, settings, and item/journal packs. Prepare upstream issue/PR list first. | Audited for metadata only |

Run this to refresh a generated local audit from installed modules:

```powershell
npm run audit:addons
```

Generated audit files are written to `.tmp/` when possible and are not committed. The audit records metadata, i18n key paths, counts, and file/line locations only; it intentionally does not copy upstream English UI strings or source snippets.
