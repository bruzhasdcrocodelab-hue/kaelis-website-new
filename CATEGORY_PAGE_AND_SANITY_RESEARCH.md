# Исследование CategoryPageView и Sanity

Дата исследования: 23 ноября 2026.

## Резюме

`CategoryPageView.module.css` содержит только стили. Экран собирается в `src/components/categories-page/CategoryPageView/CategoryPageView.tsx`, а серверная точка входа маршрутов `/en|ru|ua/tarot/[category]/[spread?]` — `src/app/[locale]/tarot/[...slug]/page.tsx`.

Сейчас редакционный контент страницы распределён между tarot backend, локальными JSON/TS-файлами и словарями интерфейса. Sanity используется для статей и policy, но не для tarot/category pages.

Рекомендуемый подход: сохранить tarot backend источником предметных данных и механики чтения, а перенести в Sanity редакционный слой — SEO, hero, FAQ, обучающий текст, CTA и изображения.

## Текущая цепочка данных

```text
URL /{locale}/tarot/{category}/{spread?}
  ├─ проверка locale, slug и допустимого SEO-path
  ├─ tarot backend: категории и расклады
  │    ├─ name, slug, site_description, image, need_new_plan
  │    └─ у расклада: description, matrix
  ├─ локальные JSON/TS: SEO, FAQ, learning copy, UI-переводы
  ├─ SSR: metadata, JSON-LD, начальный каталог
  └─ client: CategoryPageView, форма вопроса и чтение
```

| Часть страницы | Источник |
| --- | --- |
| Наличие категории/расклада, slug, имя, описание, image | Tarot backend через `src/lib/categories/server.ts` |
| Матрица расклада и число карт | Backend field `matrix`; `src/lib/categories/catalog.ts` |
| H1 и hero intro | `src/lib/seo/content.json`: `h1`, `intro`; fallback на backend `site_description`/`description` |
| Title, description, canonical, hreflang, OG/Twitter | `src/lib/seo/content.json` и `src/lib/seo/index.ts` |
| OG image | Общий `/images/seo/og-placeholder-1200x630.png` |
| Breadcrumbs и BreadcrumbList JSON-LD | Серверно из маршрута, backend-названий и словаря |
| FAQ и FAQPage JSON-LD | `src/lib/faq/content.ts`; общий шаблон и override Yes/No |
| Learning section, example reading, внутренние ссылки | `src/lib/categories/pageContent.ts` |
| Header/Footer/кнопки/тексты формы | `src/lang` через `dictionaries` |
| Preset questions | Backend `/tarot/questions` из `src/lib/tarot/questions.ts` |
| AI reading | Существующий backend flow через `useReading` |

Каталог передаётся с SSR в `CatalogProvider`; client-store затем умеет перезагружать его. В `src/lib/categories/server.ts` backend-запросы выполняются с `cache: "no-store"`; часовой application cache отсутствует.

## Текущая SEO-модель

В `src/lib/seo/content.json` у каждого из трёх языков 79 записей; 75 из них — `/tarot/...`. Это 14 category-path и 61 spread-path, то есть 225 локализованных tarot SEO-записей.

```ts
{
  title: string;
  description: string;
  h1?: string;
  intro?: string;
}
```

`pageMetadata()` централизованно формирует canonical, `en`/`ru`/`uk`/`x-default` hreflang, Open Graph и Twitter. Title ограничивается 60 символами, description — 160; недопустимые значения заменяются fallback. Sitemap читает tarot URLs из `content.json`, не из backend-каталога.

Отсюда условие индексируемой страницы: маршрут обязан одновременно существовать в backend и иметь SEO-запись в локальном JSON; иначе route возвращает 404.

## Состояние Sanity

В production dataset проекта Kaelis опубликованы schema types:

- `articlesItem`;
- `blogCategory`;
- `policy` (сейчас не используется в проекте, а используются захардкоженные политики - они были реализованы до подключения Sanity и это пока не менялось).

Типа tarot/category page в опубликованной схеме нет; frontend за таким контентом не обращается. В данных есть 54 статьи — по 18 для `en`, `ru`, `ua`, и 15 blog categories — по 5 на язык.

Frontend Sanity используется для статей. `src/lib/articles/client.ts` настроен с `useCdn: true`, `perspective: "published"`. `src/lib/articles/content.ts` не содержит `unstable_cache` или `revalidate: 3600`: данные статей запрашиваются напрямую через Sanity client. `useCdn: true` остаётся CDN-политикой Sanity и не является Next.js ISR с TTL в один час.

Studio уже содержит объекты `seo`, `imageWithAlt` и Portable Text. `@sanity/document-internationalization` есть в зависимостях Studio, но в `studio/sanity.config.ts` не подключён; фактическая модель статей использует `language: en | ru | ua`.

## Рекомендуемая граница ответственности

```text
Tarot backend
  └─ category/spread IDs, slug, matrix, presets, reading

Sanity
  └─ SEO, hero, FAQ, learning copy, CTA, изображения

Next.js
  └─ валидирует маршрут, объединяет данные, рендерит SSR/metadata/sitemap/JSON-LD
```

## Целевая схема `tarotPage`

Один документ на сочетание «язык + path». Это соответствует действующей модели статей, не требует менять локализацию Studio и даёт 225 локализованных документов.

```ts
tarotPage {
  language: "en" | "ru" | "ua";

  route: {
    categorySlug: string;
    spreadSlug?: string;
  };

  hero: {
    h1: string;
    intro: text;
    image?: imageWithAlt;
    exploreLabel?: string;
  };

  learning: {
    heading?: string;
    intro: portableText;
    guidance: portableText;
    exampleReading?: {
      heading?: string;
      cardName?: string;
      quickRead?: string;
      details: [{ title: string; text: text }];
    };
  };

  faq: [{ question: string; answer: text }];

  seo: {
    title: string;
    description: text;
    keywords?: string;
    image?: imageWithAlt;
    ogType?: "website";
    twitterCard?: "summary_large_image" | "summary";
    noIndex?: boolean;
  };
}
```

Нужна schema validation уникальности комбинации `language + categorySlug + spreadSlug`. Canonical и hreflang следует по-прежнему вычислять в Next.js из валидированного маршрута, а не давать редактировать вручную в CMS.

Для этой фиксированной страницы предпочтительна типизированная схема, а не универсальный page builder: hero, reading form, learning и FAQ имеют конкретную семантику. Portable Text подходит для свободной длинной прозы; FAQ, CTA и SEO лучше хранить структурированно, чтобы валидировать и безопасно использовать в JSON-LD.

## Целевая загрузка

```text
generateMetadata(params)
  └─ getTarotPage(locale, routePath)
       ├─ Sanity: hero + seo
       └─ временный fallback на content.json

Page(params)
  ├─ backend: category/spread + matrix + IDs
  ├─ Sanity: editorial content
  ├─ notFound(), если backend route не существует
  └─ CategoryPageView получает объединённую модель
```

`BreadcrumbList` продолжает зависеть от маршрута и backend-названий. `FAQPage` строится только из видимого `faq` массива. Sitemap должен использовать только валидированное пересечение доступных backend routes и опубликованных CMS-документов, либо иной единый контролируемый список допустимых маршрутов.

## План внедрения

1. Добавить в локальный Studio schema types: `tarotPage`, `tarotRoute`, `tarotHero`, `tarotLearning`, `faqItem`; обновить Studio structure.
2. Добавить server-only GROQ слой, mapper и TypeScript types в Next.js.
3. Передать CMS-модель в CategoryPageView и дочерние блоки, не меняя reading flow.
4. Импортировать из текущего `seo/content.json` 225 локализованных документов; отдельным шагом перенести FAQ и learning copy.
5. На период миграции оставить `coalesce`/fallback на текущие JSON/TS-источники.
6. После полного покрытия обновить generateStaticParams, sitemap и тесты SSR/metadata/JSON-LD.
7. Определить caching/publish стратегию отдельно для нового Sanity-контента. Сейчас Sanity-статьи не имеют Next.js time-based cache, а tarot backend-каталог принудительно запрашивается с `no-store`; при необходимости в будущем можно отдельно согласовать tag-based invalidation от Sanity webhook или иной cache policy.
8. Проверить все 225 URL: SSR, H1, canonical, hreflang, title, description, OG, JSON-LD, sitemap и отсутствие 404.

## Вывод

Sanity уже подключён, но в настоящее время обслуживает только блог и policy. CategoryPageView получает редакционные данные из нескольких локальных источников, а доменную модель — из backend.

Перенос редакционного слоя CategoryPageView и SEO в типизированный `tarotPage` даст единое место для управления 225 языковыми страницами, сохранив текущую механику раскладов и снизив риск рассинхронизации видимого текста, FAQ и SEO.
