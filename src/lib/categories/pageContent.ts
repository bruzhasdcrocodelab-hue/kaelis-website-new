import type { Locale } from "@/lang";
import type { TarotCategory, TarotSpread } from "./catalog";

type Content = { learningTitle: string; intro: string; first: string; second: string; third: string; exampleTitle: string; ask: string };

const content: Record<Locale, Content> = {
  en: { learningTitle: "How a Tarot Reading Works", intro: "Kaelis AI starts with your question and the spread you choose. It considers which cards were drawn, whether each is upright or reversed, and what each card means in its position.", first: "AI brings the cards together into one interpretation so you can explore the situation with more clarity.", second: "Choose a spread for the situation you want to understand, or begin with your own question.", third: "The reading is a prompt for reflection and a practical next step.", exampleTitle: "Example Reading", ask: "Ask your own question" },
  ru: { learningTitle: "Как работает расклад Таро", intro: "Kaelis AI начинает с вашего вопроса и выбранного расклада. Сервис учитывает вытянутые карты, их положение и значение в раскладе.", first: "Затем карты объединяются в одну интерпретацию, чтобы яснее увидеть ситуацию.", second: "Выберите расклад для конкретной темы или задайте собственный вопрос.", third: "Расклад помогает поразмышлять и сделать следующий шаг.", exampleTitle: "Пример расклада", ask: "Задать свой вопрос" },
  uk: { learningTitle: "Як працює розклад Таро", intro: "Kaelis AI починає з вашого питання та обраного розкладу. Сервіс враховує витягнуті карти, їхнє положення й значення в розкладі.", first: "Потім карти поєднуються в одну інтерпретацію, щоб ясніше побачити ситуацію.", second: "Оберіть розклад для певної теми або поставте власне питання.", third: "Розклад допомагає поміркувати й зробити наступний крок.", exampleTitle: "Приклад розкладу", ask: "Поставити власне питання" },
};

export function categoryPageContent(locale: Locale, category: TarotCategory, spreads: TarotSpread[]) {
  return { ...content[locale], category, links: spreads.slice(0, 3) };
}
