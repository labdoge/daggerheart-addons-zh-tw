# Translation Style Guide

This add-on companion module inherits terminology from the core `daggerheart-zh-tw` localization module.

## Rules

- Use Traditional Chinese for user-facing labels, settings, button text, tooltips, and chat UI.
- Preserve module names, package ids, hook names, API names, paths, and commands in English.
- Prefer concise UI labels. Add-on controls are often compact and should not wrap awkwardly.
- Match the Daggerheart glossary for rules terms such as 敵手（Adversary）, 恐懼（Fear）, 希望（Hope）, 近接距離（Melee range）, 靠近距離（Close range）, and 配置卡（Loadout cards）.
- Do not translate add-on brand names unless the add-on author already provides a localized title.
- When uncertain, document the decision in `translation_status.md` before adding a translation.

## Developer Notes

For add-ons with proper Foundry i18n, add translations to the relevant `source/locale-sections/<addon>.json` file using the add-on's real namespace.

For hardcoded UI, prefer upstream issues or pull requests. Runtime patches should be small, isolated, and documented.
