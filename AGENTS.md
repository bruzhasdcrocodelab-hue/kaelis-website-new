<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

***

## Общие ограничения
* Не читать весь проект
* Не менять backend.
* Не менять существующий API/data flow без необходимости.
* EN / UK / RU должны продолжать работать.
* Не делать unrelated refactoring.
* Не добавлять зависимости без необходимости.
* Не хардкодить глобальные цвета, шрифты, градиенты и другие design tokens: использовать `src/app/tokens.css`; уникальные значения конкретного компонента писать в его `.css`.
* CSS оформлять в столбик: каждый селектор и каждое свойство на отдельной строке.
* Новые комментарии не добавлять; существующие без необходимости не менять/не удалять.
* Удаляй свои временные / тестовые файлы после завершения их использования
* При необходимости использовать Playwright MCP, для точечной проверки.
<!-- END:nextjs-agent-rules -->
