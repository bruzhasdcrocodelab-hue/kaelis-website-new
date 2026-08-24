import Image from "next/image";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import HeroCardsSection from "@/components/main-page/HeroCardsSection";
import TopBlockSection from "@/components/main-page/TopBlockSection";
import { dictionaries } from "@/lang";
import { getLocale } from "@/lib/locale";
import styles from "./page.module.css";

export default async function Home() {
  const locale = await getLocale();
  const dictionary = dictionaries[locale];

  return (
    <div className={styles.page}>
      <Image
        src="/images/backgrounds/main.png"
        alt=""
        width={1440}
        height={990}
        className={styles.backgroundImage}
        priority
      />
      <Image
        src="/images/backgrounds/patterns-center.svg"
        alt=""
        width={996}
        height={491}
        className={styles.patternCenter}
        priority
      />
      <Image
        src="/images/backgrounds/patterns-left.svg"
        alt=""
        width={340}
        height={750}
        className={styles.patternLeft}
        priority
      />
      <Image
        src="/images/backgrounds/patterns-right.svg"
        alt=""
        width={340}
        height={750}
        className={styles.patternRight}
        priority
      />
      <div className={styles.content}>
        <Header dictionary={dictionary.header} locale={locale} />
        <HeroCardsSection heroDictionary={dictionary.hero} cardsDictionary={dictionary.cards} />
        <TopBlockSection dictionary={dictionary.topBlock} />
        <Footer dictionary={dictionary.footer} />
      </div>
    </div>
  );
}
