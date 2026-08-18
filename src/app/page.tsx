import Image from "next/image";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import HeroSection from "@/components/main-page/HeroSection";
import CardsFan from "@/components/main-page/CardsFan";
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
      <div className={styles.content}>
        <Header dictionary={dictionary.header} />
        <HeroSection dictionary={dictionary.hero} />
        <CardsFan dictionary={dictionary.cards} />
        <TopBlockSection dictionary={dictionary.topBlock} />
        <Footer dictionary={dictionary.footer} />
      </div>
    </div>
  );
}
