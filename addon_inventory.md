# Daggerheart Add-on Inventory

Last checked: 2026-06-19

This file tracks the add-ons currently planned for this companion localization module. It is intentionally conservative: an add-on is only marked translated after its manifest language files, settings, templates, injected UI, chat cards, and compendium content have been audited.

| Module ID | Title | Local Version | Manifest Languages | Initial Strategy | Status |
|---|---|---:|---|---|---|
| `daggerheart-advmanager` | Daggerheart: Adversary Manager | `0.3.1` | none seen | Audit settings/UI; likely runtime or upstream i18n work needed. | Not audited |
| `daggerheart-compact-sheets` | Daggerheart: Compact Sheets | `1.5.2` | `en`, `ru` | Add `zh-TW` overlay if namespace is stable. | Not audited |
| `daggerheart-distances` | Daggerheart: Distances | `0.2.5` | `en`, `pt-BR`, `ru` | Add `zh-TW` overlay if namespace is stable. | Not audited |
| `daggerheart-kichwas-ui-refinement` | Daggerheart: Kichwas' UI Refinement | `1.3.0` | none seen | Audit injected UI and template changes; may need runtime patch or upstream i18n. | Not audited |
| `daggerheart-quickactions` | Daggerheart: Quick Actions | `0.4.4` | none seen | Audit action labels, chat buttons, settings. | Not audited |
| `daggerheart-quickrules` | Daggerheart: Quick Rules | `0.2.0` | none seen | Audit rule display text and settings. | Not audited |
| `daggerheart-store` | Daggerheart: Store | `0.5.6` | none seen | Audit shop/store UI, item labels, settings. | Not audited |

Run this to refresh a generated local audit from installed modules:

```powershell
npm run audit:addons
```

Generated audit files are written to `.tmp/` and are not committed.
