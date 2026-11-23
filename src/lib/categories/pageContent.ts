import type { Locale } from "@/lang";
import type { TarotCategory, TarotSpread } from "./catalog";

type LocalizedText = Record<Locale, string>;

type CategoryTheme = {
  focus: LocalizedText;
  prompt: LocalizedText;
};

export type LearningContent = {
  learningTitle: string;
  intro: string;
  secondLead: string;
  secondBetween: string;
  secondEnd: string;
  third: string;
  exampleTitle: string;
  ask: string;
  cardDescription: string;
  knightOfWands: string;
  quickRead: string;
  quickReadText: string;
  fullDescription: string;
  impact: string;
  impactText: string;
  recognition: string;
  recognitionText: string;
  focus: string;
  focusText: string;
};

const themes: Record<string, CategoryTheme> = {
  love: { focus: { en: "your relationships", ru: "отношения", uk: "стосунки" }, prompt: { en: "getting in touch with an ex", ru: "вашем общении с бывшим партнёром", uk: "спілкування з колишнім партнером" } },
  dreams: { focus: { en: "a dream that stays with you", ru: "сне, который не отпускает", uk: "сні, який не відпускає" }, prompt: { en: "a recurring dream", ru: "повторяющемся сне", uk: "повторюваному сні" } },
  personality: { focus: { en: "your strengths and patterns", ru: "сильных сторонах и привычных паттернах", uk: "сильних сторонах і звичних патернах" }, prompt: { en: "a quality you want to understand better", ru: "качестве, которое хотите лучше понять", uk: "рисі, яку хочете краще зрозуміти" } },
  education: { focus: { en: "your learning path", ru: "обучении", uk: "навчанні" }, prompt: { en: "the next step in your studies", ru: "следующем шаге в учёбе", uk: "наступному кроці в навчанні" } },
  trips: { focus: { en: "a journey ahead", ru: "предстоящей поездке", uk: "майбутній подорожі" }, prompt: { en: "choosing when or where to travel", ru: "выборе времени или места для поездки", uk: "виборі часу або місця для подорожі" } },
  health: { focus: { en: "your wellbeing", ru: "самочувствии", uk: "самопочутті" }, prompt: { en: "the habits that support your wellbeing", ru: "привычках, поддерживающих самочувствие", uk: "звичках, що підтримують самопочуття" } },
  decision: { focus: { en: "a decision in front of you", ru: "предстоящем решении", uk: "рішенні, яке стоїть перед вами" }, prompt: { en: "choosing between two options", ru: "выборе между двумя вариантами", uk: "виборі між двома варіантами" } },
  hidden: { focus: { en: "what is not yet clear", ru: "том, что пока неясно", uk: "тому, що поки неясно" }, prompt: { en: "an influence you may be overlooking", ru: "факторе, который можете упускать", uk: "впливі, який можете не помічати" } },
  forecast: { focus: { en: "what may be ahead", ru: "том, что может быть впереди", uk: "тому, що може бути попереду" }, prompt: { en: "preparing for the next chapter", ru: "подготовке к следующему этапу", uk: "підготовці до наступного етапу" } },
  "soul-path": { focus: { en: "your inner direction", ru: "внутреннем направлении", uk: "внутрішньому напрямку" }, prompt: { en: "what feels meaningful right now", ru: "том, что сейчас действительно важно", uk: "тому, що зараз по-справжньому важливо" } },
  work: { focus: { en: "your work and career", ru: "работе и карьере", uk: "роботі та кар’єрі" }, prompt: { en: "the next move at work", ru: "следующем шаге в работе", uk: "наступному кроці в роботі" } },
  family: { focus: { en: "your family dynamics", ru: "семейных отношениях", uk: "сімейних стосунках" }, prompt: { en: "a conversation with someone close", ru: "разговоре с близким человеком", uk: "розмові з близькою людиною" } },
  money: { focus: { en: "your finances", ru: "финансах", uk: "фінансах" }, prompt: { en: "a financial choice", ru: "финансовом выборе", uk: "фінансовому виборі" } },
  answer: { focus: { en: "the question on your mind", ru: "волнующем вас вопросе", uk: "питанні, яке вас хвилює" }, prompt: { en: "the answer you need right now", ru: "ответе, который вам сейчас нужен", uk: "відповіді, яка вам зараз потрібна" } },
};

const defaultTheme: CategoryTheme = {
  focus: { en: "your situation", ru: "вашей ситуации", uk: "вашій ситуації" },
  prompt: { en: "what matters to you right now", ru: "том, что сейчас для вас важно", uk: "тому, що зараз для вас важливо" },
};

const fixed: Record<Locale, Omit<LearningContent, "learningTitle" | "secondLead" | "secondBetween" | "secondEnd" | "third">> = {
  en: {
    intro: "KaelisAI starts with your question and the spread you choose. It considers which cards were drawn, whether each is upright or reversed, and what each card means in its position in the spread. The AI brings the cards together into one interpretation. The reading style you choose shapes how that interpretation is explained.",
    exampleTitle: "Example Reading", ask: "Ask your own question", cardDescription: "Card Description", knightOfWands: "Knight of Wands", quickRead: "Quick read", quickReadText: "Victory, recognition, triumph; reversed — self-doubt, hollow win.", fullDescription: "Full Description", impact: "Impact", impactText: "This project is likely to affect you by increasing confidence, visibility, and a sense of professional achievement if it is managed well.", recognition: "Recognition", recognitionText: "Recognition is possible through a clear concept and consistent delivery, but it should be treated as a later effect rather than the basis for the launch.", focus: "Focus", focusText: "Keep the focus on repeatable operations and customer value so that recognition rests on a solid business foundation.",
  },
  ru: {
    intro: "KaelisAI начинает с вашего вопроса и выбранного расклада. Он учитывает, какие карты были вытянуты, прямые они или перевёрнутые, а также значение каждой карты в её позиции в раскладе. ИИ объединяет карты в единую интерпретацию. Выбранный стиль расклада определяет, как эта интерпретация будет объяснена.",
    exampleTitle: "Пример расклада", ask: "Задать свой вопрос", cardDescription: "Описание карты", knightOfWands: "Рыцарь жезлов", quickRead: "Кратко", quickReadText: "Победа, признание, триумф; перевёрнутая — неуверенность в себе, пустая победа.", fullDescription: "Полное описание", impact: "Влияние", impactText: "Этот проект может укрепить уверенность, повысить заметность и дать ощущение профессионального достижения, если им хорошо управлять.", recognition: "Признание", recognitionText: "Признание возможно благодаря ясной концепции и последовательной работе, но оно должно быть следствием, а не основой запуска.", focus: "Фокус", focusText: "Сосредоточьтесь на повторяемых процессах и ценности для клиентов, чтобы признание опиралось на прочную основу.",
  },
  uk: {
    intro: "KaelisAI починає з вашого питання та обраного розкладу. Він враховує, які карти були витягнуті, чи вони прямі або перевернуті, а також значення кожної карти в її позиції в розкладі. ШІ поєднує карти в одну інтерпретацію. Обраний стиль розкладу визначає, як ця інтерпретація буде пояснена.",
    exampleTitle: "Приклад розкладу", ask: "Поставити власне питання", cardDescription: "Опис карти", knightOfWands: "Лицар жезлів", quickRead: "Коротко", quickReadText: "Перемога, визнання, тріумф; перевернута — невпевненість у собі, порожня перемога.", fullDescription: "Повний опис", impact: "Вплив", impactText: "Цей проєкт може посилити впевненість, помітність і відчуття професійного досягнення, якщо ним добре керувати.", recognition: "Визнання", recognitionText: "Визнання можливе завдяки чіткій концепції та послідовному втіленню, але воно має бути наслідком, а не основою запуску.", focus: "Фокус", focusText: "Зосередьтеся на повторюваних процесах і цінності для клієнтів, щоб визнання спиралося на міцну основу.",
  },
};

export function categoryPageContent(locale: Locale, category: TarotCategory, spreads: TarotSpread[]): LearningContent & { links: TarotSpread[] } {
  const theme = themes[category.slug] ?? defaultTheme;
  const title = locale === "en" ? `How a ${category.name} Tarot Reading Works` : locale === "ru" ? `Как работает расклад Таро «${category.name}»` : `Як працює розклад Таро «${category.name}»`;
  const focus = theme.focus[locale];
  const prompt = theme.prompt[locale];
  const preferredLinks = category.slug === "love" ? ["between-us", "fate", "breakup"] : [];
  const links = preferredLinks.length
    ? preferredLinks.map((slug) => spreads.find((spread) => spread.slug === slug)).filter((spread): spread is TarotSpread => Boolean(spread))
    : spreads.slice(0, 3);
  const second = locale === "en"
    ? { lead: `If you want to choose a spread for ${focus}, try `, between: " for a focused perspective, or ", end: " if you’re unsure which one fits. You can also start with your own question in the form above." }
    : locale === "ru"
      ? { lead: `Если хотите выбрать расклад для темы «${focus}», попробуйте `, between: " для более точного взгляда или ", end: ", если пока не знаете, какой вариант подходит. Можно начать и с собственного вопроса в форме выше." }
      : { lead: `Якщо хочете обрати розклад для теми «${focus}», спробуйте `, between: " для точнішого погляду або ", end: ", якщо поки не знаєте, який варіант підходить. Також можна почати з власного питання у формі вище." };
  const third = locale === "en" && category.slug === "love"
    ? "Give the reading something specific to work with. If you’re thinking about getting in touch with an ex, try asking, “What should I consider before I reach out?” Read the interpretation with that decision in mind. It might help you work out what you’d want to say and whether you’re ready to hear their answer."
    : locale === "en"
      ? `Give the reading something specific to work with. If you’re thinking about ${prompt}, try asking, “What should I consider before I act?” Read the interpretation with that decision in mind. It might help you work out what you want to do next.`
    : locale === "ru"
      ? `Дайте раскладу конкретную тему для работы. Если думаете о ${prompt}, попробуйте спросить: «Что мне стоит учесть, прежде чем действовать?» Читайте интерпретацию с учётом этого решения — она может помочь понять следующий шаг.`
      : `Дайте розкладу конкретну тему для роботи. Якщо думаєте про ${prompt}, спробуйте запитати: «Що мені варто врахувати, перш ніж діяти?» Читайте інтерпретацію з огляду на це рішення — вона може допомогти зрозуміти наступний крок.`;

  return { ...fixed[locale], learningTitle: title, secondLead: second.lead, secondBetween: second.between, secondEnd: second.end, third, links };
}
