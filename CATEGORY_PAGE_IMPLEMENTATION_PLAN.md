# CategoryPageView implementation plan

## Research record

- Figma references reviewed: desktop `2670:13195`, mobile `2670:10956`, reading desktop `2670:13672`, reading mobile `2670:11414`, selected-spread states `2688:98` and `2688:108`.
- The category route is server-rendered with initial catalog data, metadata, breadcrumbs and FAQ JSON-LD. The visual page is a client component.
- Catalog data comes from `/tarot` and includes names, descriptions, matrices and optional images. Preset questions come from `/tarot/questions`; their documented fields include `tarot_id`, `tarot_category_id` and localized `text`.
- Existing `useReading` owns the authenticated API call, socket/polling fallback, retry and abort lifecycle. `ReadingNavigationProvider` already provides the required confirmation/reset behavior.

## Delivery stages

1. Replace the category composition with the Figma hero, standalone Ask panel, spread list and responsive CSS. Preserve route data, SEO and global header/footer.
2. Add selected-spread card state, learning/example section and responsive FAQ styling. Keep category links locale-aware.
3. Load three preset questions and route manual/preset submissions through the existing reading lifecycle and confirmation modal. Mount the existing CategoryTopBlock below the hero in its choose/reveal flow after a reading starts.
4. Add EN/RU/UK content templates and verify desktop/mobile states, keyboard semantics and reduced motion.
5. Run lint, tests, production build and Playwright visual/function checks on localized category and spread pages.

## Completion criteria

- Home `CategoryTopBlock`, header/footer, catalog API contract and route SEO remain unchanged.
- Category reading can be started manually or from a preset; replacement is confirmed, aborts the previous request and preserves the Ask panel.
- Existing ChooseCardsStep and RevealCardsStep render only after a reading is started on the category page.
