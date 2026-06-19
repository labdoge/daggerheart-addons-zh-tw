# Translation Style Guide

This add-on companion module inherits terminology from the core `daggerheart-zh-tw` localization module.

## Rules

- Use Traditional Chinese for user-facing labels, settings, button text, tooltips, and chat UI.
- Preserve module names, package ids, hook names, API names, paths, commands, and i18n key paths in English.
- Add translations only for add-on namespaces such as `DHCS.*`, `DHD.*`, or companion patch namespaces such as `DHKUIR.*`; do not duplicate core `DAGGERHEART.*` entries.
- Prefer concise UI labels. Add-on controls are often compact and should not wrap awkwardly.
- Match core terminology from `daggerheart-zh-tw` for Daggerheart rules terms such as Hope, Fear, Duality Rolls, Range, Stress, HP, Adversary, and Environment.
- Do not translate add-on brand names unless the add-on author already provides a localized title.
- When uncertain, document the decision in `translation_status.md` before adding a translation.

## Developer Notes

For add-ons with proper Foundry i18n, add translations to the relevant `source/locale-sections/<addon>.json` file using the add-on's real namespace.

For hardcoded UI, prefer upstream issues or pull requests unless the project explicitly chooses a pure companion path. Runtime patches should be small, isolated, version-aware, and documented.

`DHKUIR.*` is reserved for the `daggerheart-kichwas-ui-refinement` companion runtime patch. It may label Kichwas-only settings and patch controls, but Hope/Fear terminology still comes from core `DAGGERHEART.*`.
