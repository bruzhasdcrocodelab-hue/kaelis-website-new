import HomePatterns from "./HomePatterns/HomePatterns";
import ReadingNavigationProvider from "@/components/reading/ReadingNavigationProvider";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import HomeReading from "@/components/main-page/HomeReading/HomeReading";
import type { Dictionary, Locale } from "@/lang";
import styles from "@/app/page.module.css";

export default function HomePageView({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {

  return (
    <div className={styles.page} data-home-page>
      <div className={styles.backgroundGradientMobile} aria-hidden />
      <div className={styles.backgroundImage} aria-hidden>
        <div className={styles.backgroundGradientCanvas} />
      </div>
      <HomePatterns />
      <ReadingNavigationProvider dictionary={dictionary.readingConfirmation}>
        <div className={styles.content}>
          <Header dictionary={dictionary.header} locale={locale} />
          <HomeReading locale={locale} dictionary={dictionary} />
          <Footer dictionary={dictionary.footer} locale={locale} />
        </div>
      </ReadingNavigationProvider>
    </div>
  );
}
