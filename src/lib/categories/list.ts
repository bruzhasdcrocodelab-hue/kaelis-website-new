import type { Locale } from "@/lang";

/**
 * Flat list of top-level categories shown on the categories-list page.
 * Shape mirrors what the backend will return per item; `src/lib` stands in
 * for that API for now, so the page/components only ever see this contract.
 */
export interface CategoryListItem {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
}

const items: CategoryListItem[] = [
  {
    slug: "dreams",
    title: { en: "Dreams", ru: "Сны", uk: "Сни" },
    description: {
      en: "Decode the hidden messages within your dreams and subconscious visions.",
      ru: "Расшифруйте скрытые послания снов и образы подсознания.",
      uk: "Розшифруйте приховані послання снів та образи підсвідомості.",
    },
  },
  {
    slug: "education",
    title: { en: "Education", ru: "Образование", uk: "Освіта" },
    description: {
      en: "Gain clarity on learning paths, skills to develop, and intellectual growth.",
      ru: "Проясните пути обучения, навыки для развития и интеллектуальный рост.",
      uk: "Проясніть шляхи навчання, навички для розвитку та інтелектуальне зростання.",
    },
  },
  {
    slug: "personality",
    title: { en: "Personality", ru: "Личность", uk: "Особистість" },
    description: {
      en: "Uncover your core traits, strengths, and the essence of who you truly are.",
      ru: "Раскройте свои ключевые черты, сильные стороны и суть того, кто вы есть.",
      uk: "Розкрийте свої ключові риси, сильні сторони та суть того, ким ви є.",
    },
  },
  {
    slug: "family",
    title: { en: "Family", ru: "Семья", uk: "Родина" },
    description: {
      en: "Explore family dynamics, ancestral bonds, and harmony within your home.",
      ru: "Исследуйте семейные отношения, родовые связи и гармонию в доме.",
      uk: "Досліджуйте сімейні стосунки, родові звʼязки та гармонію в домі.",
    },
  },
  {
    slug: "health",
    title: { en: "Health", ru: "Здоровье", uk: "Здоровʼя" },
    description: {
      en: "Receive guidance on physical and emotional well-being and vitality.",
      ru: "Получите подсказки о физическом и эмоциональном благополучии и жизненной силе.",
      uk: "Отримайте підказки про фізичне та емоційне благополуччя і життєву силу.",
    },
  },
  {
    slug: "travel",
    title: { en: "Travel", ru: "Путешествия", uk: "Подорожі" },
    description: {
      en: "Discover what journeys and adventures await you on the road ahead.",
      ru: "Узнайте, какие путешествия и приключения ждут вас впереди.",
      uk: "Дізнайтеся, які подорожі та пригоди чекають на вас попереду.",
    },
  },
  {
    slug: "money",
    title: { en: "Money", ru: "Деньги", uk: "Гроші" },
    description: {
      en: "Understand your financial flow, abundance blocks, and prosperity potential.",
      ru: "Поймите свой денежный поток, блоки изобилия и потенциал процветания.",
      uk: "Зрозумійте свій грошовий потік, блоки достатку та потенціал процвітання.",
    },
  },
  {
    slug: "decision",
    title: { en: "Decision", ru: "Решение", uk: "Рішення" },
    description: {
      en: "Get clarity when facing a crossroads and choose the right path forward.",
      ru: "Обретите ясность на перепутье и выберите верный путь вперёд.",
      uk: "Здобудьте ясність на роздоріжжі та оберіть правильний шлях уперед.",
    },
  },
  {
    slug: "work",
    title: { en: "Work", ru: "Работа", uk: "Робота" },
    description: {
      en: "Find direction in your career, projects, and professional ambitions.",
      ru: "Найдите направление в карьере, проектах и профессиональных амбициях.",
      uk: "Знайдіть напрямок у карʼєрі, проєктах та професійних амбіціях.",
    },
  },
  {
    slug: "hidden",
    title: { en: "Hidden", ru: "Скрытое", uk: "Приховане" },
    description: {
      en: "Reveal what lies beneath the surface — secrets, blind spots, and unseen forces.",
      ru: "Раскройте то, что скрыто под поверхностью — тайны, слепые зоны и незримые силы.",
      uk: "Розкрийте те, що приховане під поверхнею — таємниці, сліпі зони та незримі сили.",
    },
  },
  {
    slug: "forecast",
    title: { en: "Forecast", ru: "Прогноз", uk: "Прогноз" },
    description: {
      en: "See what the near future holds and prepare for what's coming your way.",
      ru: "Узнайте, что готовит ближайшее будущее, и подготовьтесь к переменам.",
      uk: "Дізнайтеся, що готує найближче майбутнє, і підготуйтеся до змін.",
    },
  },
  {
    slug: "love",
    title: { en: "Love", ru: "Любовь", uk: "Кохання" },
    description: {
      en: "Navigate emotional connections, romantic bonds, and matters of the heart.",
      ru: "Разберитесь в эмоциональных связях, романтических узах и делах сердца.",
      uk: "Розберіться в емоційних звʼязках, романтичних узах та справах серця.",
    },
  },
  {
    slug: "soul-path",
    title: { en: "Soul Path", ru: "Путь души", uk: "Шлях душі" },
    description: {
      en: "Connect with your deeper purpose and the spiritual journey of your soul.",
      ru: "Соединитесь со своим глубинным предназначением и духовным путём души.",
      uk: "Зʼєднайтеся зі своїм глибинним призначенням та духовним шляхом душі.",
    },
  },
  {
    slug: "answer",
    title: { en: "Answer", ru: "Ответ", uk: "Відповідь" },
    description: {
      en: "Ask any question and receive a direct, intuitive answer from the cards.",
      ru: "Задайте любой вопрос и получите прямой, интуитивный ответ от карт.",
      uk: "Поставте будь-яке запитання й отримайте прямий, інтуїтивний відповідь від карт.",
    },
  },
];

/** Stand-in for the backend call that will list every top-level category. */
export function getCategoryList(): CategoryListItem[] {
  return items;
}
