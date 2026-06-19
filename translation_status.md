# Translation Status

Version: `0.1.0`

Current release is a scaffold only. It provides the module shell, manifest download path, release workflow, and source layout for future add-on translations.

| Area | Status |
|---|---|
| Module manifest | Ready |
| Release workflow | Ready |
| Locale merge/build scripts | Ready |
| Add-on inventory | Initial |
| Actual add-on UI translations | Not started |
| Runtime patches | Not started |
| Add-on compendium translations | Not started |

## Next Work

1. Audit add-ons with existing `languages` first: `daggerheart-compact-sheets`, then `daggerheart-distances`.
2. Add stable `zh-TW` overlays into the matching `source/locale-sections/*.json` files.
3. For hardcoded UI, document exact files/selectors and prefer upstream i18n requests before runtime patching.
4. Keep terminology aligned with `daggerheart-zh-tw`.
