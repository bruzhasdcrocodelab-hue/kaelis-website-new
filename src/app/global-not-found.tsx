import "./globals.css";

const messages = {
  en: { title: "Page not found", description: "The page you requested does not exist." },
  ru: { title: "Страница не найдена", description: "Запрошенной страницы не существует." },
  uk: { title: "Сторінку не знайдено", description: "Запитуваної сторінки не існує." },
};

export default function GlobalNotFound() {
  const message = messages.en;
  return <html lang="en">
    <body>
      <main>
        <h1>{message.title}</h1>
        <p>{message.description}</p>
      </main>
    </body>
  </html>;
}
