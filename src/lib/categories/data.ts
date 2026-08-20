import type { Locale } from "@/lang";

export type CategoryIcon = "star" | "filled-star";

export interface CategoryNode {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  icon: CategoryIcon;
  subcategories: CategoryNode[];
}

function leaf(
  slug: string,
  icon: CategoryIcon,
  title: Record<Locale, string>,
  description: Record<Locale, string>,
): CategoryNode {
  return { slug, icon, title, description, subcategories: [] };
}

/**
 * Subcategories don't yet have their own copy from the backend, so they
 * temporarily fall back to their parent category's description.
 */
const familyDescription: Record<Locale, string> = {
  en: "Strengthen emotional bonds, find harmony, and protect your loved ones",
  ru: "Укрепите эмоциональные связи, найдите гармонию и защитите близких",
  uk: "Зміцніть емоційні зв'язки, знайдіть гармонію та захистіть близьких",
};

const family: CategoryNode = {
  slug: "family",
  icon: "star",
  title: { en: "Family", ru: "Семья", uk: "Родина" },
  description: familyDescription,
  subcategories: [
    leaf(
      "pregnancy",
      "star",
      { en: "Pregnancy", ru: "Беременность", uk: "Вагітність" },
      familyDescription,
    ),
    leaf(
      "children",
      "filled-star",
      { en: "Children", ru: "Дети", uk: "Діти" },
      familyDescription,
    ),
    leaf(
      "what-will-happen",
      "filled-star",
      { en: "What Will Happen?", ru: "Что будет?", uk: "Що буде?" },
      familyDescription,
    ),
    leaf(
      "my-family",
      "star",
      { en: "My Family", ru: "Моя семья", uk: "Моя родина" },
      familyDescription,
    ),
  ],
};

const loveDescription: Record<Locale, string> = {
  en: "Explore your romantic destiny, compatibility, and the future of your relationship",
  ru: "Узнайте свою романтическую судьбу, совместимость и будущее отношений",
  uk: "Дізнайтеся свою романтичну долю, сумісність і майбутнє стосунків",
};

const love: CategoryNode = {
  slug: "love",
  icon: "star",
  title: { en: "Love", ru: "Любовь", uk: "Кохання" },
  description: loveDescription,
  subcategories: [
    leaf("abuse", "star", { en: "Abuse", ru: "Абьюз", uk: "Абʼюз" }, loveDescription),
    leaf("destiny-1", "star", { en: "Destiny", ru: "Судьба", uk: "Доля" }, loveDescription),
    leaf(
      "argument",
      "filled-star",
      { en: "Argument", ru: "Ссора", uk: "Сварка" },
      loveDescription,
    ),
    leaf("choice", "filled-star", { en: "Choice", ru: "Выбор", uk: "Вибір" }, loveDescription),
    leaf(
      "mutual-feelings",
      "star",
      { en: "Mutual Feelings", ru: "Взаимные чувства", uk: "Взаємні почуття" },
      loveDescription,
    ),
    leaf("destiny-2", "star", { en: "Destiny", ru: "Судьба", uk: "Доля" }, loveDescription),
    leaf(
      "cheating",
      "filled-star",
      { en: "Cheating", ru: "Измена", uk: "Зрада" },
      loveDescription,
    ),
    leaf(
      "breakup",
      "filled-star",
      { en: "Breakup", ru: "Расставание", uk: "Розставання" },
      loveDescription,
    ),
    leaf("parting", "star", { en: "Parting", ru: "Разлука", uk: "Розлука" }, loveDescription),
    leaf("union", "star", { en: "Union", ru: "Союз", uk: "Союз" }, loveDescription),
    leaf(
      "compatibility",
      "filled-star",
      { en: "Compatibility", ru: "Совместимость", uk: "Сумісність" },
      loveDescription,
    ),
    leaf(
      "between-us",
      "filled-star",
      { en: "Between Us", ru: "Между нами", uk: "Між нами" },
      loveDescription,
    ),
    leaf("karma", "star", { en: "Karma", ru: "Карма", uk: "Карма" }, loveDescription),
  ],
};

const yesNo: CategoryNode = {
  slug: "yes-no",
  icon: "star",
  title: { en: "Yes/No", ru: "Да/Нет", uk: "Так/Ні" },
  description: {
    en: "Get a clear, direct answer to the question on your mind",
    ru: "Получите чёткий, прямой ответ на волнующий вас вопрос",
    uk: "Отримайте чітку, пряму відповідь на питання, що вас хвилює",
  },
  subcategories: [],
};

const oneCard: CategoryNode = {
  slug: "one-card",
  icon: "star",
  title: { en: "One Card", ru: "Одна карта", uk: "Одна карта" },
  description: {
    en: "A single card reading for quick clarity and guidance",
    ru: "Расклад на одну карту для быстрой ясности и подсказки",
    uk: "Розклад на одну карту для швидкої ясності та підказки",
  },
  subcategories: [],
};

const threeCards: CategoryNode = {
  slug: "three-cards",
  icon: "star",
  title: { en: "Three Cards", ru: "Три карты", uk: "Три карти" },
  description: {
    en: "Past, present, and future revealed across three cards",
    ru: "Прошлое, настоящее и будущее в раскладе из трёх карт",
    uk: "Минуле, теперішнє й майбутнє в розкладі з трьох карт",
  },
  subcategories: [],
};

const work: CategoryNode = {
  slug: "work",
  icon: "star",
  title: { en: "Work", ru: "Работа", uk: "Робота" },
  description: {
    en: "Navigate your career path, opportunities, and challenges",
    ru: "Разберитесь в карьерном пути, возможностях и трудностях",
    uk: "Розберіться в кар'єрному шляху, можливостях і труднощах",
  },
  subcategories: [],
};

const money: CategoryNode = {
  slug: "money",
  icon: "star",
  title: { en: "Money", ru: "Деньги", uk: "Гроші" },
  description: {
    en: "Gain insight into your finances, stability, and abundance",
    ru: "Получите понимание своих финансов, стабильности и достатка",
    uk: "Отримайте розуміння своїх фінансів, стабільності та достатку",
  },
  subcategories: [],
};

export const categoryTree: CategoryNode[] = [
  love,
  yesNo,
  oneCard,
  threeCards,
  work,
  family,
  money,
];

export function findCategoryPath(slugPath: string[]): CategoryNode[] | null {
  if (slugPath.length === 0) return null;

  const path: CategoryNode[] = [];
  let siblings = categoryTree;

  for (const slug of slugPath) {
    const node = siblings.find((n) => n.slug === slug);
    if (!node) return null;
    path.push(node);
    siblings = node.subcategories;
  }

  return path;
}
