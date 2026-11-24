import type {PortableTextBlock} from "@portabletext/types";
import type {Locale} from "@/lang";

export interface TarotPageHero {
  h1: string;
  shortDescription: string;
  description: string;
  iconPath?: string;
}

export interface TarotPageExampleDetail {
  _key: string;
  title: string;
  text: string;
}

export interface TarotPageExample {
  cardSlug: string;
  heading?: string;
  cardDescriptionLabel?: string;
  quickReadLabel?: string;
  quickReadText?: string;
  fullDescriptionLabel?: string;
  details?: TarotPageExampleDetail[];
  askLabel?: string;
}

export interface TarotPageContent {
  hero: TarotPageHero;
  spreadsSection?: {
    heading?: string;
    description?: string;
  };
  learning: {
    heading?: string;
    content: PortableTextBlock[];
  };
  example?: TarotPageExample;
  faq: Array<{
    _key: string;
    question: string;
    answer: string;
  }>;
  seo: {
    title: string;
    description: string;
    keywords?: string;
    ogType?: "website";
    twitterCard?: "summary" | "summary_large_image";
    noIndex?: boolean;
    image?: {
      alt: string;
      url: string;
      width?: number;
      height?: number;
    };
  };
}

export const defaultTarotExample: Record<Locale, Required<Omit<TarotPageExample, "details">> & {details: TarotPageExampleDetail[]}> = {
  en: {
    cardSlug: "knight-of-wands",
    heading: "Example Reading",
    askLabel: "Ask your own question",
    cardDescriptionLabel: "Card Description",
    quickReadLabel: "Quick read",
    quickReadText: "Victory, recognition, triumph; reversed — self-doubt, hollow win.",
    fullDescriptionLabel: "Full Description",
    details: [
      { _key: "impact", title: "Impact", text: "This project is likely to affect you by increasing confidence, visibility, and a sense of professional achievement if it is managed well." },
      { _key: "recognition", title: "Recognition", text: "Recognition is possible through a clear concept and consistent delivery, but it should be treated as a later effect rather than the basis for the launch." },
      { _key: "focus", title: "Focus", text: "Keep the focus on repeatable operations and customer value so that recognition rests on a solid business foundation." },
    ],
  },
  ru: {
    cardSlug: "knight-of-wands",
    heading: "Пример расклада",
    askLabel: "Задать свой вопрос",
    cardDescriptionLabel: "Описание карты",
    quickReadLabel: "Кратко",
    quickReadText: "Победа, признание, триумф; перевёрнутая — неуверенность в себе, пустая победа.",
    fullDescriptionLabel: "Полное описание",
    details: [
      { _key: "impact", title: "Влияние", text: "Этот проект может укрепить уверенность, повысить заметность и дать ощущение профессионального достижения, если им хорошо управлять." },
      { _key: "recognition", title: "Признание", text: "Признание возможно благодаря ясной концепции и последовательной работе, но оно должно быть следствием, а не основой запуска." },
      { _key: "focus", title: "Фокус", text: "Сосредоточьтесь на повторяемых процессах и ценности для клиентов, чтобы признание опиралось на прочную основу." },
    ],
  },
  uk: {
    cardSlug: "knight-of-wands",
    heading: "Приклад розкладу",
    askLabel: "Поставити власне питання",
    cardDescriptionLabel: "Опис карти",
    quickReadLabel: "Коротко",
    quickReadText: "Перемога, визнання, тріумф; перевернута — невпевненість у собі, порожня перемога.",
    fullDescriptionLabel: "Повний опис",
    details: [
      { _key: "impact", title: "Вплив", text: "Цей проєкт може посилити впевненість, помітність і відчуття професійного досягнення, якщо ним добре керувати." },
      { _key: "recognition", title: "Визнання", text: "Визнання можливе завдяки чіткій концепції та послідовному втіленню, але воно має бути наслідком, а не основою запуску." },
      { _key: "focus", title: "Фокус", text: "Зосередьтеся на повторюваних процесах і цінності для клієнтів, щоб визнання спиралося на міцну основу." },
    ],
  },
};

export function mergeTarotExample(locale: Locale, example?: TarotPageExample) {
  const fallback = defaultTarotExample[locale];
  return {
    ...fallback,
    ...example,
    details: example?.details?.length ? example.details : fallback.details,
  };
}
