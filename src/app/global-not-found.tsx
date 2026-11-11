import "./globals.css";
import { htmlLang } from "@/lang";
import { getLocale } from "@/lib/locale";

const messages = {
  en: { title: "Page not found", description: "The page you requested does not exist." },
  ru: { title: "Страница не найдена", description: "Запрошенной страницы не существует." },
  uk: { title: "Сторінку не знайдено", description: "Запитуваної сторінки не існує." },
};

export default async function GlobalNotFound() {
  const locale = await getLocale();
  const message = messages[locale];
  return <html lang={htmlLang[locale]}>
    <body>
      <main>
        <h1>{message.title}</h1>
        <p>{message.description}</p>
      </main>
    </body>
  </html>;
}
