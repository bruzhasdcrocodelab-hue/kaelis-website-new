import type { Locale } from "@/lang";
import type { SectionKey } from "@/lib/tarot/readingSections";

type RevealText = Record<SectionKey, string> & {
  cardDescription: string; interpretation: string; seeAnswer: string; restart: string;
  learnMore: string; discoverMeaning: string; chooseCard: string; close: string;
};

export const revealMessages: Record<Locale, RevealText> = {
  en: {
    cardDescription: "Card Description", interpretation: "Interpretation", seeAnswer: "See The Answer", restart: "Restart",
    learnMore: "Learn More About Yourself", discoverMeaning: "Discover the Meaning", chooseCard: "Click on the card to Learn More", close: "Close",
    quickRead: "Quick read", fullDescription: "Full Description", impact: "Impact", recognition: "Recognition", focus: "Focus",
    result: "Result", why: "Why these cards", risks: "Risks", advice: "Advice",
  },
  uk: {
    cardDescription: "Опис карти", interpretation: "Тлумачення", seeAnswer: "Переглянути відповідь", restart: "Почати спочатку",
    learnMore: "Дізнайтеся більше про себе", discoverMeaning: "Дізнайтеся значення", chooseCard: "Натисніть на карту, щоб дізнатися більше", close: "Закрити",
    quickRead: "Коротко", fullDescription: "Повний опис", impact: "Вплив", recognition: "Визнання", focus: "Фокус",
    result: "Результат", why: "Чому ці карти", risks: "Ризики", advice: "Поради",
  },
  ru: {
    cardDescription: "Описание карты", interpretation: "Толкование", seeAnswer: "Посмотреть ответ", restart: "Начать заново",
    learnMore: "Узнайте больше о себе", discoverMeaning: "Узнайте значение", chooseCard: "Нажмите на карту, чтобы узнать больше", close: "Закрыть",
    quickRead: "Кратко", fullDescription: "Полное описание", impact: "Влияние", recognition: "Признание", focus: "Фокус",
    result: "Результат", why: "Почему эти карты", risks: "Риски", advice: "Советы",
  },
};
