# 匕首心附加模組繁體中文在地化 / Daggerheart Add-ons Traditional Chinese Localization

Unofficial companion localization module for Daggerheart-related Foundry VTT add-on modules.

這是 `daggerheart-zh-tw` 的 companion localization module，不取代核心 Daggerheart system 翻譯。核心規則術語、系統 UI 與 compendium 翻譯仍以 [`daggerheart-zh-tw`](https://github.com/labdoge/unofficial-daggerheart-zh-tw) 為準。

## Current Status

Current release: `v0.3.0`

Included production overlays:

- `daggerheart-compact-sheets` `1.5.2`: upstream `DHCS.*` keys
- `daggerheart-distances` `0.2.5`: upstream `DHD.*` keys
- `daggerheart-kichwas-ui-refinement` `1.3.0`: companion `DHKUIR.*` settings plus a version-gated runtime compatibility patch

Tracked but not yet translated through this module:

- `daggerheart-advmanager`
- `daggerheart-quickactions`
- `daggerheart-quickrules`
- `daggerheart-store`

Those add-ons currently contain hardcoded UI, settings, templates, chat cards, or compendium content. The preferred path is upstream i18n support before this companion module adds runtime patches.

## Foundry Installation

FVTT manifest URL:

```text
https://github.com/labdoge/daggerheart-addons-zh-tw/releases/latest/download/module.json
```

Recommended companion module:

- [`daggerheart-zh-tw`](https://github.com/labdoge/unofficial-daggerheart-zh-tw)

Recommended loadout:

1. Install and enable the Foundryborne `daggerheart` system.
2. Install and enable `daggerheart-zh-tw`.
3. Install and enable this module.
4. Enable the supported add-ons you want localized.
5. Switch Foundry to `zh-TW`.

## Development

Install dependencies:

```powershell
npm ci
```

Merge locale sections:

```powershell
npm run merge:locale
```

Validate manifest and locale:

```powershell
npm run validate
```

Audit locally installed Daggerheart add-ons:

```powershell
npm run audit:addons
```

Build dist:

```powershell
npm run build:dist
```

Build and install to local Foundry modules:

```powershell
npm run build
```

Default local Foundry modules path:

```text
D:\FVTT\Data\modules
```

Override it with:

```powershell
$env:FOUNDRY_MODULES_DIR = 'D:\FVTT\Data\modules'
npm run build
```

## Development Rules

- Keep add-on translations in `source/locale-sections/<addon>.json`.
- Do not duplicate core `DAGGERHEART.*` keys; keep those in `daggerheart-zh-tw`.
- Do not modify upstream add-on folders under `D:\FVTT\Data\modules`.
- Do not commit `.tmp/`, `dist/`, zip files, or generated audit artifacts.
- Do not commit generated audit artifacts containing upstream English source text.
- Prefer upstream i18n PRs/issues for hardcoded UI unless a pure companion path is explicitly chosen. Runtime patches should be small, documented, and version-aware.
