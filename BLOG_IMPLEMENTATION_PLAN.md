# Реализация многоязычного блога и статей

## Технический контекст

- Проект использует Next.js 16.4.6 App Router, маршруты `src/app/[locale]` и URL-локали `en`, `ru`, `ua` (`ua` соответствует языку `uk`). Для новых страниц использовать async `params`, `generateMetadata`, `generateStaticParams` и ISR по образцу `src/app/[locale]/tarot/[...slug]/page.tsx`.
- Локальная Sanity Studio находится в `studio/`; production CMS: project `jcsmje02`, dataset `production`. Схемы: `studio/src/schemaTypes/documents/templates/articlesItem.ts`, `blogCategory.ts`, `src/schemaTypes/objects/templates/seo.ts`, `imageWithAlt.ts`.
- В production опубликовано 54 статьи: по 18 для `en`, `ru`, `ua`; 15 категорий: по 5 на язык. Все статьи содержат дату, описание, обложку и SEO title/description/image. Одна украинская статья не имеет категорий.
- Поля `articlesItem`: `language`, `title`, `desc`, `slug.current`, `breadcrumbs`, `date`, `coverImage.image`/`altText`, `seo`, `category[]`, `content[]`. Rich text — Portable Text с заголовками H1–H6, quote, списками, форматированием, ссылками и встроенными изображениями.
- CMS slug уже имеет вид `/<base-slug>-<locale>`, например `/astrology-basics-understanding-your-natal-chart-en`; публичный путь будет `/en/articles/astrology-basics-understanding-your-natal-chart-en`.
- У переводных статей иногда сохранены ссылки на английские categories. В адаптере данных нормализовать ID категории удалением суффикса `__i18n_*` и сопоставлять его с категорией текущей локали; не фильтровать по названию категории.
- SEO-паттерны: `src/lib/seo/index.ts`, `src/app/sitemap.ts`, `src/components/seo/JsonLd.tsx`. Redirects: `src/proxy.ts`, `src/lib/legacyArticleRedirects.ts`, `src/lib/legacyRedirects.ts`. Основа legal page: `src/components/article/TermsPageView/TermsPageView.tsx`.
- Не менять Sanity, backend и Terms/Policies. Blog/article view должны быть отдельными компонентами; допустимо переиспользовать Header, Footer, Breadcrumbs, JsonLd и дизайн-токены.
- Потребуются только `@sanity/client` и `@portabletext/react`; не подключать live preview или Visual Editing.
- Проверка текущего поведения: `/en/articles` возвращает 404; legacy `/articles/astrology-basics-understanding-your-natal-chart-en` перенаправляется на `/en/tarot/personality`; Header содержит Terms of Use, Footer не содержит; mobile Header/Footer на policy page не переполняются на 390 px.

## Этап 1 — маршруты, навигация, дизайн и redirects

**Результат:** рабочие `/[locale]/articles` и `/[locale]/articles/[slug]`, единая навигация и legacy URLs, ведущие к реальным статьям.

- Создать server routes `src/app/[locale]/articles/page.tsx` и `src/app/[locale]/articles/[slug]/page.tsx`; неизвестная статья вызывает `notFound()`.
- Создать отдельные blog/article view и CSS Modules в `src/components/article/`; не изменять `TermsPageView` и `TermsArticleCard`.
- Использовать `src/app/tokens.css`, `src/app/globals.css`, существующую типографику и `pattern-article.svg`; новые component-specific стили хранить только в CSS Modules.
- В `Header` и `MobileMenu` заменить Terms of Use локализованной Blog-ссылкой. В `Footer` добавить Terms of Use в policy links.
- Дополнить `src/lang/en.ts`, `ru.ts`, `uk.ts` текстами Blog, фильтров и article UI. H1/описание из kaelis-promo: EN `Articles` / `Explore mystical practices and expand your knowledge with our expert materials`; RU `Статьи` / `Изучайте мистические практики и расширяйте свои знания с нашими экспертными материалами`; UK `Статті` / `Досліджуйте містичні практики та розширюйте свої знання з нашими експертними матеріалами`.
- Проверить Header/Footer для EN/RU/UK на 390, 768, 1100, 1440 px.
- В `src/lib/legacyArticleRedirects.ts` заменить tarot destinations на локализованные article destinations. Сохранить 301 и все текущие source-варианты без локали/с locale.
- Точно подтверждённые legacy base slugs: `astrology-basics-understanding-your-natal-chart`, `become-a-tarot-reader-essential-training-tips`, `how-to-harness-the-power-of-tarot-practices-for-daily-guidance`, `how-to-master-tarot-reading-a-comprehensive-training-guide`, `how-to-use-tarot-for-daily-guidance-practical-techniques`, `how-to-use-tarot-spreads-for-daily-guidance`, `how-to-use-the-celtic-cross-spread-for-deep-insight`, `mastering-tarot-how-to-read-cards-like-a-pro`, `mastering-tarot-reading-techniques-a-comprehensive-guide`, `numerology-s-role-in-enhancing-your-tarot-readings`, `the-art-of-tarot-meditation-deepening-your-connection`, `the-art-of-tarot-training-building-your-intuitive-skills`, `the-wheel-of-fortune-understanding-cycles-in-tarot-readings`, `top-5-tarot-spreads-for-love-readings`, `unlock-your-future-5-tarot-spreads-for-accurate-predictions`, `unlocking-the-secrets-how-to-use-tarot-spreads-for-accurate-readings`, `unlocking-your-life-path-the-power-of-numerology`, `what-are-the-best-tarot-spreads-for-beginners-guide`.
- Unknown legacy `/articles/*` fallback должен вести на локализованный `/articles`, не `/tarot`.

**Проверки:** Playwright redirects и 404; desktop/mobile Header/Footer; все 18 sources делают один 301 на существующую article page.

## Этап 2 — Sanity, rich text и SEO

**Результат:** серверно отрендеренные локализованные CMS-данные, metadata, sitemap и JSON-LD.

- Добавить `src/lib/articles/` с Sanity client, GROQ queries, типами и mapper-ами; использовать dated API version и `useCdn: true`.
- Запросы: article list по language/date, local categories, article по language+slug, all slugs для static params/sitemap.
- Проецировать `coverImage.image.asset` и `seo.image.image.asset` с URL, dimensions, LQIP, hotspot/crop, `altText`; добавить узкий remote pattern `cdn.sanity.io/images/jcsmje02/production/**`.
- Реализовать reusable Sanity image; карточки и hero используют cover, OG — SEO image с fallback на текущий `ogImagePath`.
- Portable Text server renderer: normal, H2–H6, lists, quote, strong/em/code, links и images. Не рендерить content H1: H1 страницы — только title статьи.
- Breadcrumbs строить по canonical path `Home → Articles → title`, а не доверять CMS URL как source of truth.
- Добавить `generateStaticParams` для 54 документов и `revalidate = 3600`.
- Расширить `src/app/sitemap.ts`: `/articles` по 3 языкам, 54 canonical articles, `_updatedAt`, `alternates.languages`; legacy URLs не добавлять.
- Blog metadata из kaelis-promo:
  - EN: `Articles on Tarot, Astrology, Numerology — Kaelis`; `Read expert materials on Tarot, astrology, numerology, and mystical practices — articles, spreads, and tutorials on Kaelis.`
  - RU: `Статьи о Таро, астрологии, нумерологии — Kaelis`; `Читай экспертные материалы про Таро, астрологию, нумерологию и мистические практики — статьи, расклады, обучение на Kaelis.`
  - UK: `Статті про Таро, астрологію, нумерологію — Kaelis`; `Читай експертні матеріали про Таро, астрологію, нумерологію та містичні практики — статті, розклади, навчання на Kaelis.`
- Article metadata берёт `seo.title`, `seo.description`, `seo.keywords`, `seo.ogType`, `seo.twitterCard`, `seo.image`, canonical и hreflang.
- Добавить JSON-LD `BreadcrumbList` и `Article`/`BlogPosting`: title, description, publication/update dates, image, canonical, language, publisher. Автора не добавлять: такого поля в CMS нет.

**Проверки:** SSR HTML содержит content/title/date/categories, metadata и JSON-LD; sitemap включает 3 hubs и 54 article URLs; SEO image и fallback корректны.

## Этап 3 — поиск, фильтры и карточки

**Результат:** доступный интерактивный каталог без изменения data flow.

- Server page загружает полный local article list и local categories, client-компонент выполняет поиск/фильтрацию.
- Поиск по нормализованным Unicode `title` и `desc`, без учёта регистра.
- Множественный OR-фильтр по normalised category ID. Некатегоризированная статья видна во всех статьях и скрывается при активном category filter.
- Карточка показывает cover/alt, title, локализованную дату, categories и canonical href.
- Состояние хранить локально; filters/search reset pagination/start position. Не добавлять URL state и API endpoint.
- Сделать responsive grid/list, touch-friendly category tags и accessible controls: label, `aria-pressed`, focus, empty state.
- Не переносить старую двуколоночную раскладку и pagination без необходимости: 18 статей на локаль и ТЗ pagination не требует.

**Проверки:** EN/RU/UK search, multiple categories, reset, empty state, card navigation, no mobile horizontal overflow.

## Этап 4 — итоговая валидация

**Результат:** build, functional, SEO, visual и regression validation.

- Запустить lint, TypeScript/build.
- Playwright: 1440/1280/1100/768/390, EN/RU/UK, Header/mobile menu/Footer, filters, search, cards, existing/missing article, Terms/Policies, legacy URLs.
- Проверить server HTML: один H1, content headings, server article links, lang, canonical, hreflang, OG/Twitter, JSON-LD.
- Проверить `/sitemap.xml`, `/robots.txt`, отсутствие legacy URLs в sitemap и no redirect chains.
- Проверить `/[locale]/policy/[slug]`, `/[locale]/tarot`, `/[locale]/faq` на отсутствие регрессий.

**MCP перед этапами:** Sanity MCP для повторной проверки schema/slug count и representative EN/RU/UA documents; Playwright MCP для UI, HTTP redirect и rendered metadata assertions.
