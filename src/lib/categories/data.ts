import type { Locale } from "@/lang";

export type CategoryIcon = "star" | "filled-star";

export interface CategoryNode {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  icon: CategoryIcon;
  /**
   * Number of fan cards the user may select for this category/subcategory
   * on the CategoryTopBlock (e.g. Family = "Choose 3 Cards"). Not yet backed
   * by real data, so placeholder values (1-5) are assigned per node.
   */
  maxSelectableCards: number;
  subcategories: CategoryNode[];
}

function leaf(
  slug: string,
  icon: CategoryIcon,
  title: Record<Locale, string>,
  description: Record<Locale, string>,
  maxSelectableCards: number,
): CategoryNode {
  return { slug, icon, title, description, maxSelectableCards, subcategories: [] };
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
  maxSelectableCards: 3,
  subcategories: [
    leaf(
      "pregnancy",
      "star",
      { en: "Pregnancy", ru: "Беременность", uk: "Вагітність" },
      familyDescription,
      2,
    ),
    leaf(
      "children",
      "filled-star",
      { en: "Children", ru: "Дети", uk: "Діти" },
      familyDescription,
      4,
    ),
    leaf(
      "what-will-happen",
      "filled-star",
      { en: "What Will Happen?", ru: "Что будет?", uk: "Що буде?" },
      familyDescription,
      1,
    ),
    leaf(
      "my-family",
      "star",
      { en: "My Family", ru: "Моя семья", uk: "Моя родина" },
      familyDescription,
      5,
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
  maxSelectableCards: 4,
  subcategories: [
    leaf("abuse", "star", { en: "Abuse", ru: "Абьюз", uk: "Абʼюз" }, loveDescription, 2),
    leaf("destiny-1", "star", { en: "Destiny", ru: "Судьба", uk: "Доля" }, loveDescription, 3),
    leaf(
      "argument",
      "filled-star",
      { en: "Argument", ru: "Ссора", uk: "Сварка" },
      loveDescription,
      1,
    ),
    leaf(
      "choice",
      "filled-star",
      { en: "Choice", ru: "Выбор", uk: "Вибір" },
      loveDescription,
      5,
    ),
    leaf(
      "mutual-feelings",
      "star",
      { en: "Mutual Feelings", ru: "Взаимные чувства", uk: "Взаємні почуття" },
      loveDescription,
      4,
    ),
    leaf("destiny-2", "star", { en: "Destiny", ru: "Судьба", uk: "Доля" }, loveDescription, 2),
    leaf(
      "cheating",
      "filled-star",
      { en: "Cheating", ru: "Измена", uk: "Зрада" },
      loveDescription,
      3,
    ),
    leaf(
      "breakup",
      "filled-star",
      { en: "Breakup", ru: "Расставание", uk: "Розставання" },
      loveDescription,
      1,
    ),
    leaf("parting", "star", { en: "Parting", ru: "Разлука", uk: "Розлука" }, loveDescription, 4),
    leaf("union", "star", { en: "Union", ru: "Союз", uk: "Союз" }, loveDescription, 2),
    leaf(
      "compatibility",
      "filled-star",
      { en: "Compatibility", ru: "Совместимость", uk: "Сумісність" },
      loveDescription,
      5,
    ),
    leaf(
      "between-us",
      "filled-star",
      { en: "Between Us", ru: "Между нами", uk: "Між нами" },
      loveDescription,
      3,
    ),
    leaf("karma", "star", { en: "Karma", ru: "Карма", uk: "Карма" }, loveDescription, 1),
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
  maxSelectableCards: 1,
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
  maxSelectableCards: 1,
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
  maxSelectableCards: 3,
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
  maxSelectableCards: 4,
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
  maxSelectableCards: 2,
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
