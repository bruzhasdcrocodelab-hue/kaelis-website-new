import Link from "next/link";
import { dictionaries, type Locale } from "@/lang";
import { localizedHref } from "@/lib/routing";
import { HOME_CARDS } from "@/lib/tarot/homeCards";
import styles from "./TarotLinks.module.css";

export default function HomeTarotLinks({ locale }: { locale: Locale }) {
  const dictionary = dictionaries[locale];
  return <nav className={styles.homeLinks} aria-label={dictionary.header.allTarotSpreads}>
    {Object.values(HOME_CARDS).map((card) => <Link key={card.label} href={localizedHref(locale, `/tarot/${card.category}/${card.spread}`)}>
      {dictionary.cards[card.label]}
    </Link>)}
  </nav>;
}
