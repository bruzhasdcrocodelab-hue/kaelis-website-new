import type { Locale } from "@/lang";
import { tarotDeck, type TarotCard } from "../tarotDeck";
import type { Reading } from "./reading";

export type PresentedCard = TarotCard & { position: string; description: string; missingArt: boolean; reversed: boolean; x: number; y: number };
const normalize = (value: string) => value.toLowerCase().normalize("NFKC").replace(/ё/g, "е").replace(/[^\p{L}\p{N}]/gu, "");
const aliases: Record<string, string> = {
  fool: "the-fool", magician: "the-magician", highpriestess: "the-high-priestess", priestess: "the-high-priestess",
  empress: "the-empress", emperor: "the-emperor", hierophant: "the-hierophant", lovers: "the-lovers", chariot: "the-chariot",
  hermit: "the-hermit", hangedman: "the-hanged-man", devil: "the-devil", tower: "the-tower", star: "the-star", moon: "the-moon", sun: "the-sun", world: "the-world", judgment: "judgement",
  дурак: "the-fool", жрица: "the-high-priestess", верховнаяжрица: "the-high-priestess", верховнажриця: "the-high-priestess", жрець: "the-hierophant", жрец: "the-hierophant", повешенный: "the-hanged-man", повішений: "the-hanged-man", страшныйсуд: "judgement", страшнийсуд: "judgement",
};
const artByName = new Map(tarotDeck.flatMap(card => [card.slug, ...Object.values(card.name)].map(name => [normalize(name), card] as const)));
/** The API's deck filenames identify cards independently of translated names. */
function artFromImage(image: string) {
  const filename = image.split("/").at(-1)?.split(".")[0] ?? "";
  const minor = /^(Wands|Cups|Pentacles|Swords)(\d{2})$/i.exec(filename);
  if (minor) {
    const ranks = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "page", "knight", "queen", "king"];
    return artByName.get(normalize(`${ranks[Number(minor[2]) - 1]}-of-${minor[1]}`));
  }
  return artByName.get(normalize(filename.replace(/^\d+-/, "")));
}
export function presentCards(reading: Reading, locale: Locale): PresentedCard[] {
  const points = Object.values(reading.tarot.matrix);
  const minX = Math.min(...points.map(p => p[0])), minY = Math.min(...points.map(p => p[1]));
  return reading.cards.map(card => {
    const key = normalize(card.name ?? "");
    const art = artFromImage(card.image) ?? artByName.get(key) ?? artByName.get(normalize(aliases[key] ?? ""));
    const name = art?.name[locale] ?? card.name ?? card.position;
    const [x, y] = reading.tarot.matrix[card.position];
    return { slug: card.position, position: card.position, name: { en: name, ru: name, uk: name },
      image: art?.image ?? "/images/cards/default-card.png",
      art: art?.art ?? { left: "0%", top: "0%", width: "100%", height: "100%" }, missingArt: !art,
      description: reading.reading?.cards.find(c => c.position === card.position)?.text || card.description || "",
      reversed: card.orientation === 0 || card.orientation === false,
      x: x - minX, y: y - minY };
  });
}
