import type { Locale } from "@/lang";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqPageContent {
  eyebrow: string;
  intro: string;
  heading: string;
  items: FaqItem[];
}

export const faqPageContent: Record<Locale, FaqPageContent> = {
  en: {
    eyebrow: "Kaelis Help",
    intro: "Answers to common questions about Kaelis and AI-powered Tarot readings.",
    heading: "Frequently asked questions",
    items: [
      { question: "What is Kaelis?", answer: "Kaelis is an AI-powered space for Tarot readings, reflection, and exploring the questions that matter to you." },
      { question: "How does a Tarot reading work?", answer: "Choose a spread, focus on your question, select the cards, and receive an interpretation that helps you reflect on the symbols and your situation." },
      { question: "Do I need to create an account?", answer: "You can explore the website and start a reading without registration. Some features may become available through the Kaelis app." },
      { question: "Can Tarot predict the future?", answer: "Tarot is best used as a reflective tool. It can help you notice patterns and consider possibilities, but it should not replace your own judgement or professional advice." },
    ],
  },
  ru: {
    eyebrow: "Помощь Kaelis",
    intro: "Ответы на частые вопросы о Kaelis и раскладах Таро с искусственным интеллектом.",
    heading: "Часто задаваемые вопросы",
    items: [
      { question: "Что такое Kaelis?", answer: "Kaelis — пространство для раскладов Таро, саморефлексии и исследования важных для вас вопросов с помощью искусственного интеллекта." },
      { question: "Как работает расклад Таро?", answer: "Выберите расклад, сосредоточьтесь на вопросе, выберите карты и получите интерпретацию, которая поможет осмыслить символы и вашу ситуацию." },
      { question: "Нужно ли создавать аккаунт?", answer: "Вы можете знакомиться с сайтом и начать расклад без регистрации. Некоторые возможности могут быть доступны в приложении Kaelis." },
      { question: "Может ли Таро предсказать будущее?", answer: "Таро лучше использовать как инструмент для размышлений. Оно помогает заметить закономерности и рассмотреть варианты, но не заменяет собственное решение или помощь специалиста." },
    ],
  },
  uk: {
    eyebrow: "Допомога Kaelis",
    intro: "Відповіді на поширені запитання про Kaelis і розклади Таро зі штучним інтелектом.",
    heading: "Поширені запитання",
    items: [
      { question: "Що таке Kaelis?", answer: "Kaelis — простір для розкладів Таро, саморефлексії та дослідження важливих для вас питань за допомогою штучного інтелекту." },
      { question: "Як працює розклад Таро?", answer: "Оберіть розклад, зосередьтеся на запитанні, виберіть карти та отримайте інтерпретацію, що допоможе осмислити символи й вашу ситуацію." },
      { question: "Чи потрібно створювати обліковий запис?", answer: "Ви можете ознайомитися із сайтом і почати розклад без реєстрації. Деякі можливості можуть бути доступні в застосунку Kaelis." },
      { question: "Чи може Таро передбачити майбутнє?", answer: "Таро найкраще використовувати як інструмент для роздумів. Воно допомагає помітити закономірності та розглянути варіанти, але не замінює власне рішення чи допомогу фахівця." },
    ],
  },
};

export function tarotFaq(locale: Locale, topic: string): FaqItem[] {
  if (locale === "ru") return [
    { question: `Что можно узнать из расклада «${topic}»?`, answer: "Этот расклад помогает посмотреть на вопрос с разных сторон и заметить детали, которые могут быть важны для вашего следующего шага." },
    { question: "Как сформулировать вопрос для расклада?", answer: "Сформулируйте открытый и конкретный вопрос о ситуации, чувствах или возможных действиях. Так интерпретация будет полезнее для размышлений." },
    { question: "Как использовать результат расклада?", answer: "Сопоставьте значения карт со своей ситуацией и используйте их как повод для размышлений. Окончательное решение всегда остаётся за вами." },
  ];
  if (locale === "uk") return [
    { question: `Що можна дізнатися з розкладу «${topic}»?`, answer: "Цей розклад допомагає подивитися на запитання з різних боків і помітити деталі, важливі для вашого наступного кроку." },
    { question: "Як сформулювати запитання для розкладу?", answer: "Сформулюйте відкрите й конкретне запитання про ситуацію, почуття або можливі дії. Так інтерпретація буде кориснішою для роздумів." },
    { question: "Як використати результат розкладу?", answer: "Зіставте значення карт зі своєю ситуацією та використайте їх як привід для роздумів. Остаточне рішення завжди залишається за вами." },
  ];
  return [
    { question: `What can the “${topic}” reading help me explore?`, answer: "This reading can help you consider your question from different angles and notice details that may matter for your next step." },
    { question: "How should I phrase my question?", answer: "Use an open, specific question about your situation, feelings, or possible actions. This makes the interpretation more useful for reflection." },
    { question: "How should I use the reading?", answer: "Connect the card meanings with your situation and use them as a prompt for reflection. The final decision is always yours." },
  ];
}
