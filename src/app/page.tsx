import Image from "next/image";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import HeroCardsSection from "@/components/main-page/HeroCardsSection";
import TopBlockSection from "@/components/main-page/TopBlockSection";
import { dictionaries, defaultLocale } from "@/lang";
import styles from "./page.module.css";

export default function Home() {
  const dictionary = dictionaries[defaultLocale];

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
        <Header dictionary={dictionary.header} />
        <HeroCardsSection heroDictionary={dictionary.hero} cardsDictionary={dictionary.cards} />
        <TopBlockSection dictionary={dictionary.topBlock} />
        <Footer dictionary={dictionary.footer} />
      </div>
    </div>
  );
}
