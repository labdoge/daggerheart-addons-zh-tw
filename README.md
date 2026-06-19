# 匕首心附加模組繁體中文化 / Daggerheart Add-ons Traditional Chinese Localization

Unofficial companion localization module for Daggerheart-related Foundry VTT add-on modules.

這是一個非官方 companion localization module，目標是集中管理 Daggerheart 相關附加模組的繁體中文翻譯。核心 Daggerheart system 中文化請使用 [`daggerheart-zh-tw`](https://github.com/labdoge/unofficial-daggerheart-zh-tw)。

本專案不隸屬於 Darrington Press、Foundry Virtual Tabletop、Foundryborne 或任何 add-on 原作者。Daggerheart、Foundry VTT、各 add-on 與相關內容的權利歸各自權利人所有。

## 繁體中文

### 給 FVTT 使用者

目前狀態：初始化骨架。

這個版本先建立可安裝的 companion module、release manifest、打包流程與 add-on inventory。實際 add-on UI/setting/compendium 翻譯會在後續逐一盤點後加入。

目前追蹤的 add-on：

- `daggerheart-advmanager`
- `daggerheart-compact-sheets`
- `daggerheart-distances`
- `daggerheart-kichwas-ui-refinement`
- `daggerheart-quickactions`
- `daggerheart-quickrules`
- `daggerheart-store`

建議搭配：

- `daggerheart-zh-tw`
- Foundryborne `daggerheart` system `2.3.2` 或相容版本
- Foundry VTT v14.363 或相容版本

### 安裝方式

FVTT manifest URL：

```text
https://github.com/labdoge/daggerheart-addons-zh-tw/releases/latest/download/module.json
```

手動安裝時，下載 release asset `daggerheart-addons-zh-tw.zip`，解壓到：

```text
FoundryVTT/Data/modules/daggerheart-addons-zh-tw
```

### 使用方式

1. 安裝並啟用 Foundryborne `daggerheart` system。
2. 建議安裝並啟用 `daggerheart-zh-tw`。
3. 安裝並啟用本模組。
4. 需要翻譯的 add-on 仍須各自安裝並啟用。
5. 後續版本加入 add-on 翻譯後，重新整理世界檢查 UI、settings、sheet buttons、chat cards 與 compendium。

### 本地開發

安裝依賴：

```powershell
npm ci
```

合併 locale sections：

```powershell
npm run merge:locale
```

驗證 module manifest 與 locale：

```powershell
npm run validate
```

盤點本機已安裝的 Daggerheart add-ons：

```powershell
npm run audit:addons
```

只建立可檢查的 `dist`：

```powershell
npm run build:dist
```

建置並安裝到本機 Foundry modules 目錄：

```powershell
npm run build
```

預設 Foundry modules 路徑：

```text
D:\FVTT\Data\modules
```

可用環境變數覆寫：

```powershell
$env:FOUNDRY_MODULES_DIR = 'D:\FVTT\Data\modules'
npm run build
```

### 翻譯策略

- 若 add-on 已有 `languages` 與 i18n keys，優先用 `source/locale-sections/<addon>.json` 提供 `zh-TW` overlay。
- 若 add-on settings 使用 hardcoded English，優先向 upstream 提 PR 或 issue，請作者改成 i18n keys。
- 若 add-on UI 是 runtime DOM injection 或 template hardcode，才考慮本模組的 runtime patch。
- 若 add-on 有 compendium，另行評估是否用 `Babele` 或 add-on 自帶語系機制處理。
- 術語一律對齊核心 [`daggerheart-zh-tw`](https://github.com/labdoge/unofficial-daggerheart-zh-tw) 的 glossary/style guide。

## English

### For Foundry VTT Users

Current status: scaffold.

This repository initializes an installable companion module, release manifest, packaging workflow, and add-on inventory. Actual add-on UI, setting, or compendium translations will be added after each add-on is audited.

Tracked add-ons:

- `daggerheart-advmanager`
- `daggerheart-compact-sheets`
- `daggerheart-distances`
- `daggerheart-kichwas-ui-refinement`
- `daggerheart-quickactions`
- `daggerheart-quickrules`
- `daggerheart-store`

Recommended companion module:

- [`daggerheart-zh-tw`](https://github.com/labdoge/unofficial-daggerheart-zh-tw)

Foundry manifest URL:

```text
https://github.com/labdoge/daggerheart-addons-zh-tw/releases/latest/download/module.json
```

For manual installation, download `daggerheart-addons-zh-tw.zip` from the latest release and extract it into:

```text
FoundryVTT/Data/modules/daggerheart-addons-zh-tw
```

### Development

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

Build and install to local Foundry:

```powershell
npm run build
```

### For Add-on Developers

Please expose all user-facing text through Foundry i18n:

- Declare `languages` in `module.json`.
- Use `game.i18n.localize(...)` or `{{localize ...}}`.
- Localize settings `name` and `hint`.
- Avoid hardcoded English in JS, Handlebars templates, injected DOM, button labels, chat cards, and tooltips.
- Keep compendium document ids stable if the add-on ships content.

Add-ons with clean i18n keys can be localized through safe `zh-TW` overlays. Hardcoded UI usually requires fragile runtime patches or upstream changes.
