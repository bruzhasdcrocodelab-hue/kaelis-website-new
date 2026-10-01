import Image from "next/image";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import HomeReading from "@/components/main-page/HomeReading/HomeReading";
import { dictionaries } from "@/lang";
import { getLocale } from "@/lib/locale";
import styles from "./page.module.css";

export default async function Home() {
  const locale = await getLocale();
  const dictionary = dictionaries[locale];

  return (
    <div className={styles.page}>
      <div className={styles.backgroundGradientMobile} aria-hidden />
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
      <Image
        src="/images/backgrounds/mobile/patterns-center.svg"
        alt=""
        width={147}
        height={79}
        className={styles.patternCenterMobile}
        priority
      />
      <Image
        src="/images/backgrounds/mobile/patterns-left.svg"
        alt=""
        width={108}
        height={605}
        className={styles.patternLeftMobile}
        priority
      />
      <Image
        src="/images/backgrounds/mobile/patterns-right.svg"
        alt=""
        width={108}
        height={605}
        className={styles.patternRightMobile}
        priority
      />
      <div className={styles.content}>
        <Header dictionary={dictionary.header} locale={locale} />
        <HomeReading locale={locale} dictionary={dictionary} />
        <Footer dictionary={dictionary.footer} />
      </div>
    </div>
  );
}
