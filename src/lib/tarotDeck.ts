import type { Locale } from "@/lang";

export interface TarotCardArt {
  left: string;
  top: string;
  width: string;
  height: string;
}

export interface TarotCard {
  slug: string;
  /** Path under /public to the card's unique art layer. */
  image: string;
  /** Absolute positioning (in %) for the art layer inside the 98x175 card frame. */
  art: TarotCardArt;
  name: Record<Locale, string>;
}

/**
 * Every card is assembled from two stacked layers inside a card frame with
 * overflow hidden:
 *  1. `image` (per-card art) — absolutely positioned per `art`, oversized and
 *     shifted so it fills and slightly overflows the frame.
 *  2. The shared frame overlay (`frameOverlayImage` below) — full-bleed on
 *     top, blended with `mix-blend-mode: lighten`.
 */
export const frameOverlayImage = "/images/cards/deck/frame-overlay.png";

export const tarotDeck: TarotCard[] = [
  // Major Arcana
  {
    slug: "the-fool",
    image: "/images/cards/deck/the-fool.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "The Fool", ru: "Шут", uk: "Блазень" },
  },
  {
    slug: "the-magician",
    image: "/images/cards/deck/the-magician.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "The Magician", ru: "Маг", uk: "Маг" },
  },
  {
    slug: "the-high-priestess",
    image: "/images/cards/deck/the-high-priestess.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "The High Priestess", ru: "Верховная Жрица", uk: "Верховна Жриця" },
  },
  {
    slug: "the-empress",
    image: "/images/cards/deck/the-empress.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "The Empress", ru: "Императрица", uk: "Імператриця" },
  },
  {
    slug: "the-emperor",
    image: "/images/cards/deck/the-emperor.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "The Emperor", ru: "Император", uk: "Імператор" },
  },
  {
    slug: "the-hierophant",
    image: "/images/cards/deck/the-hierophant.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "The Hierophant", ru: "Иерофант", uk: "Ієрофант" },
  },
  {
    slug: "the-lovers",
    image: "/images/cards/deck/the-lovers.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "The Lovers", ru: "Влюблённые", uk: "Закохані" },
  },
  {
    slug: "the-chariot",
    image: "/images/cards/deck/the-chariot.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "The Chariot", ru: "Колесница", uk: "Колісниця" },
  },
  {
    slug: "strength",
    image: "/images/cards/deck/strength.png",
    art: { left: "-11.25%", top: "0%", width: "122.5%", height: "111.43%" },
    name: { en: "Strength", ru: "Сила", uk: "Сила" },
  },
  {
    slug: "the-hermit",
    image: "/images/cards/deck/the-hermit.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "The Hermit", ru: "Отшельник", uk: "Самітник" },
  },
  {
    slug: "wheel-of-fortune",
    image: "/images/cards/deck/wheel-of-fortune.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Wheel of Fortune", ru: "Колесо Фортуны", uk: "Колесо Фортуни" },
  },
  {
    slug: "justice",
    image: "/images/cards/deck/justice.png",
    art: { left: "-10.94%", top: "0%", width: "121.87%", height: "110.86%" },
    name: { en: "Justice", ru: "Справедливость", uk: "Справедливість" },
  },
  {
    slug: "the-hanged-man",
    image: "/images/cards/deck/the-hanged-man.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "The Hanged Man", ru: "Повешенный", uk: "Повішений" },
  },
  {
    slug: "death",
    image: "/images/cards/deck/death.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "Death", ru: "Смерть", uk: "Смерть" },
  },
  {
    slug: "temperance",
    image: "/images/cards/deck/temperance.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Temperance", ru: "Умеренность", uk: "Поміркованість" },
  },
  {
    slug: "the-devil",
    image: "/images/cards/deck/the-devil.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "The Devil", ru: "Дьявол", uk: "Диявол" },
  },
  {
    slug: "the-tower",
    image: "/images/cards/deck/the-tower.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "The Tower", ru: "Башня", uk: "Вежа" },
  },
  {
    slug: "the-star",
    image: "/images/cards/deck/the-star.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "The Star", ru: "Звезда", uk: "Зірка" },
  },
  {
    slug: "the-moon",
    image: "/images/cards/deck/the-moon.png",
    art: { left: "-10.94%", top: "0%", width: "121.87%", height: "110.86%" },
    name: { en: "The Moon", ru: "Луна", uk: "Місяць" },
  },
  {
    slug: "the-sun",
    image: "/images/cards/deck/the-sun.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "The Sun", ru: "Солнце", uk: "Сонце" },
  },
  {
    slug: "judgement",
    image: "/images/cards/deck/judgement.png",
    art: { left: "-10.47%", top: "0%", width: "120.95%", height: "110.02%" },
    name: { en: "Judgement", ru: "Суд", uk: "Суд" },
  },
  {
    slug: "the-world",
    image: "/images/cards/deck/the-world.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "The World", ru: "Мир", uk: "Світ" },
  },

  // Wands (Minor Arcana)
  {
    slug: "ace-of-wands",
    image: "/images/cards/deck/ace-of-wands.png",
    art: { left: "-10.32%", top: "0%", width: "120.64%", height: "109.74%" },
    name: { en: "Ace of Wands", ru: "Туз Жезлов", uk: "Туз Жезлів" },
  },
  {
    slug: "two-of-wands",
    image: "/images/cards/deck/two-of-wands.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Two of Wands", ru: "Двойка Жезлов", uk: "Двійка Жезлів" },
  },
  {
    slug: "three-of-wands",
    image: "/images/cards/deck/three-of-wands.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "Three of Wands", ru: "Тройка Жезлов", uk: "Трійка Жезлів" },
  },
  {
    slug: "four-of-wands",
    image: "/images/cards/deck/four-of-wands.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "Four of Wands", ru: "Четвёрка Жезлов", uk: "Четвірка Жезлів" },
  },
  {
    slug: "five-of-wands",
    image: "/images/cards/deck/five-of-wands.png",
    art: { left: "-10.34%", top: "0%", width: "120.68%", height: "109.77%" },
    name: { en: "Five of Wands", ru: "Пятёрка Жезлов", uk: "П'ятірка Жезлів" },
  },
  {
    slug: "six-of-wands",
    image: "/images/cards/deck/six-of-wands.png",
    art: { left: "-10.89%", top: "-0.21%", width: "121.3%", height: "110.34%" },
    name: { en: "Six of Wands", ru: "Шестёрка Жезлов", uk: "Шістка Жезлів" },
  },
  {
    slug: "seven-of-wands",
    image: "/images/cards/deck/seven-of-wands.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Seven of Wands", ru: "Семёрка Жезлов", uk: "Сімка Жезлів" },
  },
  {
    slug: "eight-of-wands",
    image: "/images/cards/deck/eight-of-wands.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Eight of Wands", ru: "Восьмёрка Жезлов", uk: "Вісімка Жезлів" },
  },
  {
    slug: "nine-of-wands",
    image: "/images/cards/deck/nine-of-wands.png",
    art: { left: "-2.89%", top: "0%", width: "107.25%", height: "109.79%" },
    name: { en: "Nine of Wands", ru: "Девятка Жезлов", uk: "Дев'ятка Жезлів" },
  },
  {
    slug: "ten-of-wands",
    image: "/images/cards/deck/ten-of-wands.png",
    art: { left: "-10.61%", top: "0%", width: "121.21%", height: "110.26%" },
    name: { en: "Ten of Wands", ru: "Десятка Жезлов", uk: "Десятка Жезлів" },
  },
  {
    slug: "page-of-wands",
    image: "/images/cards/deck/page-of-wands.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "Page of Wands", ru: "Паж Жезлов", uk: "Паж Жезлів" },
  },
  {
    slug: "knight-of-wands",
    image: "/images/cards/deck/knight-of-wands.png",
    art: { left: "-19.39%", top: "1.12%", width: "119.39%", height: "108.6%" },
    name: { en: "Knight of Wands", ru: "Рыцарь Жезлов", uk: "Лицар Жезлів" },
  },
  {
    slug: "queen-of-wands",
    image: "/images/cards/deck/queen-of-wands.png",
    art: { left: "-8.08%", top: "0%", width: "121.87%", height: "110.86%" },
    name: { en: "Queen of Wands", ru: "Королева Жезлов", uk: "Королева Жезлів" },
  },
  {
    slug: "king-of-wands",
    image: "/images/cards/deck/king-of-wands.png",
    art: { left: "-10.75%", top: "0%", width: "121.5%", height: "110.52%" },
    name: { en: "King of Wands", ru: "Король Жезлов", uk: "Король Жезлів" },
  },

  // Cups (Minor Arcana)
  {
    slug: "ace-of-cups",
    image: "/images/cards/deck/ace-of-cups.png",
    art: { left: "-10.94%", top: "0%", width: "121.87%", height: "110.86%" },
    name: { en: "Ace of Cups", ru: "Туз Кубков", uk: "Туз Чаш" },
  },
  {
    slug: "two-of-cups",
    image: "/images/cards/deck/two-of-cups.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "Two of Cups", ru: "Двойка Кубков", uk: "Двійка Чаш" },
  },
  {
    slug: "three-of-cups",
    image: "/images/cards/deck/three-of-cups.png",
    art: { left: "-10.37%", top: "0%", width: "120.74%", height: "109.83%" },
    name: { en: "Three of Cups", ru: "Тройка Кубков", uk: "Трійка Чаш" },
  },
  {
    slug: "four-of-cups",
    image: "/images/cards/deck/four-of-cups.png",
    art: { left: "-10.26%", top: "0%", width: "120.51%", height: "109.62%" },
    name: { en: "Four of Cups", ru: "Четвёрка Кубков", uk: "Четвірка Чаш" },
  },
  {
    slug: "five-of-cups",
    image: "/images/cards/deck/five-of-cups.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Five of Cups", ru: "Пятёрка Кубков", uk: "П'ятірка Чаш" },
  },
  {
    slug: "six-of-cups",
    image: "/images/cards/deck/six-of-cups.png",
    art: { left: "-10.35%", top: "0%", width: "120.7%", height: "109.79%" },
    name: { en: "Six of Cups", ru: "Шестёрка Кубков", uk: "Шістка Чаш" },
  },
  {
    slug: "seven-of-cups",
    image: "/images/cards/deck/seven-of-cups.png",
    art: { left: "-10.33%", top: "0%", width: "120.65%", height: "109.75%" },
    name: { en: "Seven of Cups", ru: "Семёрка Кубков", uk: "Сімка Чаш" },
  },
  {
    slug: "eight-of-cups",
    image: "/images/cards/deck/eight-of-cups.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Eight of Cups", ru: "Восьмёрка Кубков", uk: "Вісімка Чаш" },
  },
  {
    slug: "nine-of-cups",
    image: "/images/cards/deck/nine-of-cups.png",
    art: { left: "-10.61%", top: "0%", width: "121.21%", height: "110.26%" },
    name: { en: "Nine of Cups", ru: "Девятка Кубков", uk: "Дев'ятка Чаш" },
  },
  {
    slug: "ten-of-cups",
    image: "/images/cards/deck/ten-of-cups.png",
    art: { left: "-10.26%", top: "0%", width: "120.53%", height: "109.64%" },
    name: { en: "Ten of Cups", ru: "Десятка Кубков", uk: "Десятка Чаш" },
  },
  {
    slug: "page-of-cups",
    image: "/images/cards/deck/page-of-cups.png",
    art: { left: "-10.74%", top: "-0.21%", width: "121.47%", height: "110.5%" },
    name: { en: "Page of Cups", ru: "Паж Кубков", uk: "Паж Чаш" },
  },
  {
    slug: "knight-of-cups",
    image: "/images/cards/deck/knight-of-cups.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Knight of Cups", ru: "Рыцарь Кубков", uk: "Лицар Чаш" },
  },
  {
    slug: "queen-of-cups",
    image: "/images/cards/deck/queen-of-cups.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Queen of Cups", ru: "Королева Кубков", uk: "Королева Чаш" },
  },
  {
    slug: "king-of-cups",
    image: "/images/cards/deck/king-of-cups.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "King of Cups", ru: "Король Кубков", uk: "Король Чаш" },
  },

  // Pentacles (Minor Arcana)
  {
    slug: "ace-of-pentacles",
    image: "/images/cards/deck/ace-of-pentacles.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Ace of Pentacles", ru: "Туз Пентаклей", uk: "Туз Пентаклів" },
  },
  {
    slug: "two-of-pentacles",
    image: "/images/cards/deck/two-of-pentacles.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Two of Pentacles", ru: "Двойка Пентаклей", uk: "Двійка Пентаклів" },
  },
  {
    slug: "three-of-pentacles",
    image: "/images/cards/deck/three-of-pentacles.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Three of Pentacles", ru: "Тройка Пентаклей", uk: "Трійка Пентаклів" },
  },
  {
    slug: "four-of-pentacles",
    image: "/images/cards/deck/four-of-pentacles.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "Four of Pentacles", ru: "Четвёрка Пентаклей", uk: "Четвірка Пентаклів" },
  },
  {
    slug: "five-of-pentacles",
    image: "/images/cards/deck/five-of-pentacles.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Five of Pentacles", ru: "Пятёрка Пентаклей", uk: "П'ятірка Пентаклів" },
  },
  {
    slug: "six-of-pentacles",
    image: "/images/cards/deck/six-of-pentacles.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "Six of Pentacles", ru: "Шестёрка Пентаклей", uk: "Шістка Пентаклів" },
  },
  {
    slug: "seven-of-pentacles",
    image: "/images/cards/deck/seven-of-pentacles.png",
    art: { left: "-10.27%", top: "0%", width: "120.54%", height: "110.29%" },
    name: { en: "Seven of Pentacles", ru: "Семёрка Пентаклей", uk: "Сімка Пентаклів" },
  },
  {
    slug: "eight-of-pentacles",
    image: "/images/cards/deck/eight-of-pentacles.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Eight of Pentacles", ru: "Восьмёрка Пентаклей", uk: "Вісімка Пентаклів" },
  },
  {
    slug: "nine-of-pentacles",
    image: "/images/cards/deck/nine-of-pentacles.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "Nine of Pentacles", ru: "Девятка Пентаклей", uk: "Дев'ятка Пентаклів" },
  },
  {
    slug: "ten-of-pentacles",
    image: "/images/cards/deck/ten-of-pentacles.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "Ten of Pentacles", ru: "Десятка Пентаклей", uk: "Десятка Пентаклів" },
  },
  {
    slug: "page-of-pentacles",
    image: "/images/cards/deck/page-of-pentacles.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Page of Pentacles", ru: "Паж Пентаклей", uk: "Паж Пентаклів" },
  },
  {
    slug: "knight-of-pentacles",
    image: "/images/cards/deck/knight-of-pentacles.png",
    art: { left: "0.07%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "Knight of Pentacles", ru: "Рыцарь Пентаклей", uk: "Лицар Пентаклів" },
  },
  {
    slug: "queen-of-pentacles",
    image: "/images/cards/deck/queen-of-pentacles.png",
    art: { left: "-10.34%", top: "0%", width: "120.68%", height: "109.77%" },
    name: { en: "Queen of Pentacles", ru: "Королева Пентаклей", uk: "Королева Пентаклів" },
  },
  {
    slug: "king-of-pentacles",
    image: "/images/cards/deck/king-of-pentacles.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "King of Pentacles", ru: "Король Пентаклей", uk: "Король Пентаклів" },
  },

  // Swords (Minor Arcana)
  {
    slug: "ace-of-swords",
    image: "/images/cards/deck/ace-of-swords.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Ace of Swords", ru: "Туз Мечей", uk: "Туз Мечів" },
  },
  {
    slug: "two-of-swords",
    image: "/images/cards/deck/two-of-swords.png",
    art: { left: "-10.57%", top: "0%", width: "121.14%", height: "110.2%" },
    name: { en: "Two of Swords", ru: "Двойка Мечей", uk: "Двійка Мечів" },
  },
  {
    slug: "three-of-swords",
    image: "/images/cards/deck/three-of-swords.png",
    art: { left: "-10.54%", top: "0%", width: "121.08%", height: "110.14%" },
    name: { en: "Three of Swords", ru: "Тройка Мечей", uk: "Трійка Мечів" },
  },
  {
    slug: "four-of-swords",
    image: "/images/cards/deck/four-of-swords.png",
    art: { left: "-10.94%", top: "0%", width: "121.87%", height: "110.86%" },
    name: { en: "Four of Swords", ru: "Четвёрка Мечей", uk: "Четвірка Мечів" },
  },
  {
    slug: "five-of-swords",
    image: "/images/cards/deck/five-of-swords.png",
    art: { left: "-10.62%", top: "0%", width: "121.24%", height: "110.29%" },
    name: { en: "Five of Swords", ru: "Пятёрка Мечей", uk: "П'ятірка Мечів" },
  },
  {
    slug: "six-of-swords",
    image: "/images/cards/deck/six-of-swords.png",
    art: { left: "-10.6%", top: "0%", width: "121.21%", height: "110.25%" },
    name: { en: "Six of Swords", ru: "Шестёрка Мечей", uk: "Шістка Мечів" },
  },
  {
    slug: "seven-of-swords",
    image: "/images/cards/deck/seven-of-swords.png",
    art: { left: "-10.37%", top: "0%", width: "120.74%", height: "109.83%" },
    name: { en: "Seven of Swords", ru: "Семёрка Мечей", uk: "Сімка Мечів" },
  },
  {
    slug: "eight-of-swords",
    image: "/images/cards/deck/eight-of-swords.png",
    art: { left: "-10.43%", top: "0%", width: "120.87%", height: "109.95%" },
    name: { en: "Eight of Swords", ru: "Восьмёрка Мечей", uk: "Вісімка Мечів" },
  },
  {
    slug: "nine-of-swords",
    image: "/images/cards/deck/nine-of-swords.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Nine of Swords", ru: "Девятка Мечей", uk: "Дев'ятка Мечів" },
  },
  {
    slug: "ten-of-swords",
    image: "/images/cards/deck/ten-of-swords.png",
    art: { left: "-10.48%", top: "0%", width: "120.95%", height: "110.02%" },
    name: { en: "Ten of Swords", ru: "Десятка Мечей", uk: "Десятка Мечів" },
  },
  {
    slug: "page-of-swords",
    image: "/images/cards/deck/page-of-swords.png",
    art: { left: "-10.31%", top: "0%", width: "120.61%", height: "109.71%" },
    name: { en: "Page of Swords", ru: "Паж Мечей", uk: "Паж Мечів" },
  },
  {
    slug: "knight-of-swords",
    image: "/images/cards/deck/knight-of-swords.png",
    art: { left: "-18.13%", top: "0%", width: "120.32%", height: "109.71%" },
    name: { en: "Knight of Swords", ru: "Рыцарь Мечей", uk: "Лицар Мечів" },
  },
  {
    slug: "queen-of-swords",
    image: "/images/cards/deck/queen-of-swords.png",
    art: { left: "-10.55%", top: "0%", width: "121.1%", height: "110.15%" },
    name: { en: "Queen of Swords", ru: "Королева Мечей", uk: "Королева Мечів" },
  },
  {
    slug: "king-of-swords",
    image: "/images/cards/deck/king-of-swords.png",
    art: { left: "-10.09%", top: "0%", width: "120.18%", height: "110.29%" },
    name: { en: "King of Swords", ru: "Король Мечей", uk: "Король Мечів" },
  },
];
