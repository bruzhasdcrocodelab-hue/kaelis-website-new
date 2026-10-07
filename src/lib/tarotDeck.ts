import type { Locale } from "@/lang";

export interface TarotCard {
  slug: string;
  image: string;
  name: Record<Locale, string>;
}

export const tarotDeck: TarotCard[] = [
  // Major Arcana
  {
    slug: "the-fool",
    image: "/images/cards/deck/the-fool.png",
    name: { en: "The Fool", ru: "Шут", uk: "Блазень" },
  },
  {
    slug: "the-magician",
    image: "/images/cards/deck/the-magician.png",
    name: { en: "The Magician", ru: "Маг", uk: "Маг" },
  },
  {
    slug: "the-high-priestess",
    image: "/images/cards/deck/the-high-priestess.png",
    name: { en: "The High Priestess", ru: "Верховная Жрица", uk: "Верховна Жриця" },
  },
  {
    slug: "the-empress",
    image: "/images/cards/deck/the-empress.png",
    name: { en: "The Empress", ru: "Императрица", uk: "Імператриця" },
  },
  {
    slug: "the-emperor",
    image: "/images/cards/deck/the-emperor.png",
    name: { en: "The Emperor", ru: "Император", uk: "Імператор" },
  },
  {
    slug: "the-hierophant",
    image: "/images/cards/deck/the-hierophant.png",
    name: { en: "The Hierophant", ru: "Иерофант", uk: "Ієрофант" },
  },
  {
    slug: "the-lovers",
    image: "/images/cards/deck/the-lovers.png",
    name: { en: "The Lovers", ru: "Влюблённые", uk: "Закохані" },
  },
  {
    slug: "the-chariot",
    image: "/images/cards/deck/the-chariot.png",
    name: { en: "The Chariot", ru: "Колесница", uk: "Колісниця" },
  },
  {
    slug: "strength",
    image: "/images/cards/deck/strength.png",
    name: { en: "Strength", ru: "Сила", uk: "Сила" },
  },
  {
    slug: "the-hermit",
    image: "/images/cards/deck/the-hermit.png",
    name: { en: "The Hermit", ru: "Отшельник", uk: "Самітник" },
  },
  {
    slug: "wheel-of-fortune",
    image: "/images/cards/deck/wheel-of-fortune.png",
    name: { en: "Wheel of Fortune", ru: "Колесо Фортуны", uk: "Колесо Фортуни" },
  },
  {
    slug: "justice",
    image: "/images/cards/deck/justice.png",
    name: { en: "Justice", ru: "Справедливость", uk: "Справедливість" },
  },
  {
    slug: "the-hanged-man",
    image: "/images/cards/deck/the-hanged-man.png",
    name: { en: "The Hanged Man", ru: "Повешенный", uk: "Повішений" },
  },
  {
    slug: "death",
    image: "/images/cards/deck/death.png",
    name: { en: "Death", ru: "Смерть", uk: "Смерть" },
  },
  {
    slug: "temperance",
    image: "/images/cards/deck/temperance.png",
    name: { en: "Temperance", ru: "Умеренность", uk: "Поміркованість" },
  },
  {
    slug: "the-devil",
    image: "/images/cards/deck/the-devil.png",
    name: { en: "The Devil", ru: "Дьявол", uk: "Диявол" },
  },
  {
    slug: "the-tower",
    image: "/images/cards/deck/the-tower.png",
    name: { en: "The Tower", ru: "Башня", uk: "Вежа" },
  },
  {
    slug: "the-star",
    image: "/images/cards/deck/the-star.png",
    name: { en: "The Star", ru: "Звезда", uk: "Зірка" },
  },
  {
    slug: "the-moon",
    image: "/images/cards/deck/the-moon.png",
    name: { en: "The Moon", ru: "Луна", uk: "Місяць" },
  },
  {
    slug: "the-sun",
    image: "/images/cards/deck/the-sun.png",
    name: { en: "The Sun", ru: "Солнце", uk: "Сонце" },
  },
  {
    slug: "judgement",
    image: "/images/cards/deck/judgement.png",
    name: { en: "Judgement", ru: "Суд", uk: "Суд" },
  },
  {
    slug: "the-world",
    image: "/images/cards/deck/the-world.png",
    name: { en: "The World", ru: "Мир", uk: "Світ" },
  },

  // Wands (Minor Arcana)
  {
    slug: "ace-of-wands",
    image: "/images/cards/deck/ace-of-wands.png",
    name: { en: "Ace of Wands", ru: "Туз Жезлов", uk: "Туз Жезлів" },
  },
  {
    slug: "two-of-wands",
    image: "/images/cards/deck/two-of-wands.png",
    name: { en: "Two of Wands", ru: "Двойка Жезлов", uk: "Двійка Жезлів" },
  },
  {
    slug: "three-of-wands",
    image: "/images/cards/deck/three-of-wands.png",
    name: { en: "Three of Wands", ru: "Тройка Жезлов", uk: "Трійка Жезлів" },
  },
  {
    slug: "four-of-wands",
    image: "/images/cards/deck/four-of-wands.png",
    name: { en: "Four of Wands", ru: "Четвёрка Жезлов", uk: "Четвірка Жезлів" },
  },
  {
    slug: "five-of-wands",
    image: "/images/cards/deck/five-of-wands.png",
    name: { en: "Five of Wands", ru: "Пятёрка Жезлов", uk: "П'ятірка Жезлів" },
  },
  {
    slug: "six-of-wands",
    image: "/images/cards/deck/six-of-wands.png",
    name: { en: "Six of Wands", ru: "Шестёрка Жезлов", uk: "Шістка Жезлів" },
  },
  {
    slug: "seven-of-wands",
    image: "/images/cards/deck/seven-of-wands.png",
    name: { en: "Seven of Wands", ru: "Семёрка Жезлов", uk: "Сімка Жезлів" },
  },
  {
    slug: "eight-of-wands",
    image: "/images/cards/deck/eight-of-wands.png",
    name: { en: "Eight of Wands", ru: "Восьмёрка Жезлов", uk: "Вісімка Жезлів" },
  },
  {
    slug: "nine-of-wands",
    image: "/images/cards/deck/nine-of-wands.png",
    name: { en: "Nine of Wands", ru: "Девятка Жезлов", uk: "Дев'ятка Жезлів" },
  },
  {
    slug: "ten-of-wands",
    image: "/images/cards/deck/ten-of-wands.png",
    name: { en: "Ten of Wands", ru: "Десятка Жезлов", uk: "Десятка Жезлів" },
  },
  {
    slug: "page-of-wands",
    image: "/images/cards/deck/page-of-wands.png",
    name: { en: "Page of Wands", ru: "Паж Жезлов", uk: "Паж Жезлів" },
  },
  {
    slug: "knight-of-wands",
    image: "/images/cards/deck/knight-of-wands.png",
    name: { en: "Knight of Wands", ru: "Рыцарь Жезлов", uk: "Лицар Жезлів" },
  },
  {
    slug: "queen-of-wands",
    image: "/images/cards/deck/queen-of-wands.png",
    name: { en: "Queen of Wands", ru: "Королева Жезлов", uk: "Королева Жезлів" },
  },
  {
    slug: "king-of-wands",
    image: "/images/cards/deck/king-of-wands.png",
    name: { en: "King of Wands", ru: "Король Жезлов", uk: "Король Жезлів" },
  },

  // Cups (Minor Arcana)
  {
    slug: "ace-of-cups",
    image: "/images/cards/deck/ace-of-cups.png",
    name: { en: "Ace of Cups", ru: "Туз Кубков", uk: "Туз Чаш" },
  },
  {
    slug: "two-of-cups",
    image: "/images/cards/deck/two-of-cups.png",
    name: { en: "Two of Cups", ru: "Двойка Кубков", uk: "Двійка Чаш" },
  },
  {
    slug: "three-of-cups",
    image: "/images/cards/deck/three-of-cups.png",
    name: { en: "Three of Cups", ru: "Тройка Кубков", uk: "Трійка Чаш" },
  },
  {
    slug: "four-of-cups",
    image: "/images/cards/deck/four-of-cups.png",
    name: { en: "Four of Cups", ru: "Четвёрка Кубков", uk: "Четвірка Чаш" },
  },
  {
    slug: "five-of-cups",
    image: "/images/cards/deck/five-of-cups.png",
    name: { en: "Five of Cups", ru: "Пятёрка Кубков", uk: "П'ятірка Чаш" },
  },
  {
    slug: "six-of-cups",
    image: "/images/cards/deck/six-of-cups.png",
    name: { en: "Six of Cups", ru: "Шестёрка Кубков", uk: "Шістка Чаш" },
  },
  {
    slug: "seven-of-cups",
    image: "/images/cards/deck/seven-of-cups.png",
    name: { en: "Seven of Cups", ru: "Семёрка Кубков", uk: "Сімка Чаш" },
  },
  {
    slug: "eight-of-cups",
    image: "/images/cards/deck/eight-of-cups.png",
    name: { en: "Eight of Cups", ru: "Восьмёрка Кубков", uk: "Вісімка Чаш" },
  },
  {
    slug: "nine-of-cups",
    image: "/images/cards/deck/nine-of-cups.png",
    name: { en: "Nine of Cups", ru: "Девятка Кубков", uk: "Дев'ятка Чаш" },
  },
  {
    slug: "ten-of-cups",
    image: "/images/cards/deck/ten-of-cups.png",
    name: { en: "Ten of Cups", ru: "Десятка Кубков", uk: "Десятка Чаш" },
  },
  {
    slug: "page-of-cups",
    image: "/images/cards/deck/page-of-cups.png",
    name: { en: "Page of Cups", ru: "Паж Кубков", uk: "Паж Чаш" },
  },
  {
    slug: "knight-of-cups",
    image: "/images/cards/deck/knight-of-cups.png",
    name: { en: "Knight of Cups", ru: "Рыцарь Кубков", uk: "Лицар Чаш" },
  },
  {
    slug: "queen-of-cups",
    image: "/images/cards/deck/queen-of-cups.png",
    name: { en: "Queen of Cups", ru: "Королева Кубков", uk: "Королева Чаш" },
  },
  {
    slug: "king-of-cups",
    image: "/images/cards/deck/king-of-cups.png",
    name: { en: "King of Cups", ru: "Король Кубков", uk: "Король Чаш" },
  },

  // Pentacles (Minor Arcana)
  {
    slug: "ace-of-pentacles",
    image: "/images/cards/deck/ace-of-pentacles.png",
    name: { en: "Ace of Pentacles", ru: "Туз Пентаклей", uk: "Туз Пентаклів" },
  },
  {
    slug: "two-of-pentacles",
    image: "/images/cards/deck/two-of-pentacles.png",
    name: { en: "Two of Pentacles", ru: "Двойка Пентаклей", uk: "Двійка Пентаклів" },
  },
  {
    slug: "three-of-pentacles",
    image: "/images/cards/deck/three-of-pentacles.png",
    name: { en: "Three of Pentacles", ru: "Тройка Пентаклей", uk: "Трійка Пентаклів" },
  },
  {
    slug: "four-of-pentacles",
    image: "/images/cards/deck/four-of-pentacles.png",
    name: { en: "Four of Pentacles", ru: "Четвёрка Пентаклей", uk: "Четвірка Пентаклів" },
  },
  {
    slug: "five-of-pentacles",
    image: "/images/cards/deck/five-of-pentacles.png",
    name: { en: "Five of Pentacles", ru: "Пятёрка Пентаклей", uk: "П'ятірка Пентаклів" },
  },
  {
    slug: "six-of-pentacles",
    image: "/images/cards/deck/six-of-pentacles.png",
    name: { en: "Six of Pentacles", ru: "Шестёрка Пентаклей", uk: "Шістка Пентаклів" },
  },
  {
    slug: "seven-of-pentacles",
    image: "/images/cards/deck/seven-of-pentacles.png",
    name: { en: "Seven of Pentacles", ru: "Семёрка Пентаклей", uk: "Сімка Пентаклів" },
  },
  {
    slug: "eight-of-pentacles",
    image: "/images/cards/deck/eight-of-pentacles.png",
    name: { en: "Eight of Pentacles", ru: "Восьмёрка Пентаклей", uk: "Вісімка Пентаклів" },
  },
  {
    slug: "nine-of-pentacles",
    image: "/images/cards/deck/nine-of-pentacles.png",
    name: { en: "Nine of Pentacles", ru: "Девятка Пентаклей", uk: "Дев'ятка Пентаклів" },
  },
  {
    slug: "ten-of-pentacles",
    image: "/images/cards/deck/ten-of-pentacles.png",
    name: { en: "Ten of Pentacles", ru: "Десятка Пентаклей", uk: "Десятка Пентаклів" },
  },
  {
    slug: "page-of-pentacles",
    image: "/images/cards/deck/page-of-pentacles.png",
    name: { en: "Page of Pentacles", ru: "Паж Пентаклей", uk: "Паж Пентаклів" },
  },
  {
    slug: "knight-of-pentacles",
    image: "/images/cards/deck/knight-of-pentacles.png",
    name: { en: "Knight of Pentacles", ru: "Рыцарь Пентаклей", uk: "Лицар Пентаклів" },
  },
  {
    slug: "queen-of-pentacles",
    image: "/images/cards/deck/queen-of-pentacles.png",
    name: { en: "Queen of Pentacles", ru: "Королева Пентаклей", uk: "Королева Пентаклів" },
  },
  {
    slug: "king-of-pentacles",
    image: "/images/cards/deck/king-of-pentacles.png",
    name: { en: "King of Pentacles", ru: "Король Пентаклей", uk: "Король Пентаклів" },
  },

  // Swords (Minor Arcana)
  {
    slug: "ace-of-swords",
    image: "/images/cards/deck/ace-of-swords.png",
    name: { en: "Ace of Swords", ru: "Туз Мечей", uk: "Туз Мечів" },
  },
  {
    slug: "two-of-swords",
    image: "/images/cards/deck/two-of-swords.png",
    name: { en: "Two of Swords", ru: "Двойка Мечей", uk: "Двійка Мечів" },
  },
  {
    slug: "three-of-swords",
    image: "/images/cards/deck/three-of-swords.png",
    name: { en: "Three of Swords", ru: "Тройка Мечей", uk: "Трійка Мечів" },
  },
  {
    slug: "four-of-swords",
    image: "/images/cards/deck/four-of-swords.png",
    name: { en: "Four of Swords", ru: "Четвёрка Мечей", uk: "Четвірка Мечів" },
  },
  {
    slug: "five-of-swords",
    image: "/images/cards/deck/five-of-swords.png",
    name: { en: "Five of Swords", ru: "Пятёрка Мечей", uk: "П'ятірка Мечів" },
  },
  {
    slug: "six-of-swords",
    image: "/images/cards/deck/six-of-swords.png",
    name: { en: "Six of Swords", ru: "Шестёрка Мечей", uk: "Шістка Мечів" },
  },
  {
    slug: "seven-of-swords",
    image: "/images/cards/deck/seven-of-swords.png",
    name: { en: "Seven of Swords", ru: "Семёрка Мечей", uk: "Сімка Мечів" },
  },
  {
    slug: "eight-of-swords",
    image: "/images/cards/deck/eight-of-swords.png",
    name: { en: "Eight of Swords", ru: "Восьмёрка Мечей", uk: "Вісімка Мечів" },
  },
  {
    slug: "nine-of-swords",
    image: "/images/cards/deck/nine-of-swords.png",
    name: { en: "Nine of Swords", ru: "Девятка Мечей", uk: "Дев'ятка Мечів" },
  },
  {
    slug: "ten-of-swords",
    image: "/images/cards/deck/ten-of-swords.png",
    name: { en: "Ten of Swords", ru: "Десятка Мечей", uk: "Десятка Мечів" },
  },
  {
    slug: "page-of-swords",
    image: "/images/cards/deck/page-of-swords.png",
    name: { en: "Page of Swords", ru: "Паж Мечей", uk: "Паж Мечів" },
  },
  {
    slug: "knight-of-swords",
    image: "/images/cards/deck/knight-of-swords.png",
    name: { en: "Knight of Swords", ru: "Рыцарь Мечей", uk: "Лицар Мечів" },
  },
  {
    slug: "queen-of-swords",
    image: "/images/cards/deck/queen-of-swords.png",
    name: { en: "Queen of Swords", ru: "Королева Мечей", uk: "Королева Мечів" },
  },
  {
    slug: "king-of-swords",
    image: "/images/cards/deck/king-of-swords.png",
    name: { en: "King of Swords", ru: "Король Мечей", uk: "Король Мечів" },
  },
];
