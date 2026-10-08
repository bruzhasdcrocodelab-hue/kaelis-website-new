"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import type { Dictionary, Locale } from "@/lang";
import { useCategories, useSpreads } from "@/components/categories/CatalogProvider";
import CategoryTopBlock, { type CategoryTopBlockProps } from "@/components/categories-page/CategoryTopBlock";
import { useReadingNavigation } from "@/components/reading/ReadingNavigationProvider";
import HeroCardsSection from "@/components/main-page/HeroCardsSection";
import TopBlockSection from "@/components/main-page/TopBlockSection";
import { cardCount, type CatalogState } from "@/lib/categories/catalog";
import { HOME_CARDS, type HomeCardSlug } from "@/lib/tarot/homeCards";
import styles from "./HomeReading.module.css";
import { scrollToCards } from "./scrollToCards";

const MOBILE_QUERY = "(max-width: 768px)";
const subscribeViewport = (listener: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
};
const mobileSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;
const serverSnapshot = () => false;
type Selection = { slug: HomeCardSlug; session: number; opening: number };

// Preserve the current reading while the same selection's translations load.
function useLastSuccess<T>(state: CatalogState<T>) {
  const [last, setLast] = useState(state);
  if (state.status === "success" && state !== last) setLast(state);
  return state.status === "success" ? state : last;
}

function ReadingSession({ slug, dictionary, locale, present }: {
  slug: HomeCardSlug; dictionary: Dictionary; locale: Locale; present: boolean;
}) {
  const mapping = HOME_CARDS[slug];
  const categoryRequest = useCategories();
  const categories = useLastSuccess(categoryRequest.state);
  const category = categories.status === "success" ? categories.data.find(item => item.slug === mapping.category) : undefined;
  const spreadRequest = useSpreads(category?.id);
  const spreads = useLastSuccess(spreadRequest.state);
  const spread = spreads.status === "success" ? spreads.data.find(item => item.slug === mapping.spread) : undefined;
  const count = spread ? cardCount(spread) : null;
  const status: "loading" | "error" | "notFound" = categoryRequest.state.status !== "success" ? categoryRequest.state.status
    : !category ? "notFound" : spreadRequest.state.status !== "success" ? spreadRequest.state.status
    : !spread ? "notFound" : "error";
  const retry = categoryRequest.state.status === "error" ? categoryRequest.retry : spreadRequest.retry;
  const ready = category && spread && count !== null;
  const catalogStatus: CategoryTopBlockProps["catalogStatus"] = ready
    ? categoryRequest.state.status === "error" || spreadRequest.state.status === "error" ? { status: "error" as const, retry } : undefined
    : { status, retry };
  return (
    <CategoryTopBlock dictionary={dictionary.categoryPage.topBlock} locale={locale}
      categoryLabel={dictionary.cards[mapping.label]} categoryId={category?.id ?? ""} spreadId={spread?.id ?? ""}
      maxSelectableCards={count ?? 0} sessionActive={present && Boolean(ready)} embedded
      catalogStatus={catalogStatus} />
  );
}

function SessionTransition({ selection, dictionary, locale, panelPresent, initialVisible }: {
  selection: Selection; dictionary: Dictionary; locale: Locale; panelPresent: boolean; initialVisible: boolean;
}) {
  const present = useIsPresent() && panelPresent;
  const reduced = useReducedMotion();
  return <motion.div inert={!present} aria-hidden={!present}
    initial={{ opacity: initialVisible ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    transition={{ duration: reduced ? 0 : 0.16, ease: [0.4, 0, 0.2, 1] }}>
    <ReadingSession slug={selection.slug} dictionary={dictionary} locale={locale} present={present} />
  </motion.div>;
}

function ReadingPanel({ selection, dictionary, locale, mobile, onExpanded }: {
  selection: Selection; dictionary: Dictionary; locale: Locale; mobile: boolean;
  onExpanded: () => void;
}) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  const [height, setHeight] = useState(0);
  const [firstSession] = useState(selection.session);
  const contentRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const measure = () => {
      const nextHeight = content.getBoundingClientRect().height;
      if (content.querySelector("#category-top-block")) setHeight(nextHeight);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    measure();
    return () => observer.disconnect();
  }, [contentRef]);
  const duration = reduced ? 0 : present ? 0.65 : 0.45;
  const transition = { duration, ease: [0.4, 0, 0.2, 1] as const };
  return (
    <motion.div className={styles.reading} inert={!present} aria-hidden={!present}
      initial={{ height: mobile ? 520 : 0 }} animate={{ height: height || (mobile ? 520 : 470) }}
      exit={{ height: mobile ? 520 : 0 }} transition={transition}
      onAnimationComplete={() => { if (present) onExpanded(); }}>
      <motion.div ref={contentRef} className={styles.readingContent}
        initial={{ y: mobile ? "100%" : 24, opacity: mobile ? 1 : 0 }}
        animate={{ y: 0, opacity: 1 }} exit={{ y: mobile ? "100%" : 24, opacity: mobile ? 1 : 0 }}
        transition={transition}>
        {/* Only the session resets on card changes; the animated panel stays mounted. */}
        <AnimatePresence mode="wait">
          <SessionTransition key={selection.session} selection={selection} dictionary={dictionary} locale={locale} panelPresent={present} initialVisible={selection.session === firstSession} />
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function HomeReading({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const session = useRef(0);
  const opening = useRef(0);
  const [exiting, setExiting] = useState(false);
  const navigation = useReadingNavigation();
  const { state: categories } = useCategories();
  const pendingCatalogAnchor = useRef(false);
  const onCloseStart = useRef<(() => void | Promise<void>) | null>(null);
  const mobile = useSyncExternalStore(subscribeViewport, mobileSnapshot, serverSnapshot);
  const reduced = useReducedMotion();
  const open = selection !== null || exiting;
  const activeScroll = useRef<ReturnType<typeof scrollToCards>>(undefined);
  useEffect(() => {
    if (window.location.hash !== "#top-block" || selection) {
      pendingCatalogAnchor.current = false;
      return;
    }
    if (categories.status !== "loading") {
      if (pendingCatalogAnchor.current && categories.status === "success") {
        document.getElementById("top-block")?.scrollIntoView({ behavior: "smooth" });
      }
      pendingCatalogAnchor.current = false;
      return;
    }
    pendingCatalogAnchor.current = true;
    const cancel = () => { pendingCatalogAnchor.current = false; };
    const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    events.forEach(event => window.addEventListener(event, cancel, { passive: true }));
    return () => events.forEach(event => window.removeEventListener(event, cancel));
  }, [categories.status, selection]);
  useEffect(() => () => activeScroll.current?.cancel(), []);
  useLayoutEffect(() => {
    if (!mobile || !open) return;
    return navigation?.registerHomeReturn(proceed => {
      activeScroll.current?.cancel();
      if (!selection) { void proceed(); return; }
      onCloseStart.current = proceed;
      setExiting(true);
      setSelection(null);
    });
  }, [mobile, open, selection, navigation]);
  useLayoutEffect(() => {
    if (selection || !onCloseStart.current) return;
    const proceed = onCloseStart.current;
    onCloseStart.current = null;
    void proceed();
  }, [selection]);
  function startSession(slug: HomeCardSlug) {
    activeScroll.current = scrollToCards(Boolean(reduced), true);
    session.current += 1;
    if (!selection) opening.current += 1;
    setSelection({ slug, session: session.current, opening: opening.current });
  }
  function select(slug: HomeCardSlug) {
    if (selection?.slug === slug) {
      navigation?.reset();
      activeScroll.current?.cancel();
      setExiting(true);
      setSelection(null);
    } else if (navigation) {
      navigation.request(() => startSession(slug), "switch");
    } else {
      startSession(slug);
    }
  }
  return (
    <>
      <HeroCardsSection locale={locale} heroDictionary={dictionary.hero} cardsDictionary={dictionary.cards}
        selectedSlug={selection?.slug ?? null} onCardSelect={select} />
      <div className={styles.panels} data-home-panels>
        <AnimatePresence mode="wait" onExitComplete={() => setExiting(false)}>
          {selection && <ReadingPanel key={selection.opening} selection={selection} dictionary={dictionary} locale={locale} mobile={mobile} onExpanded={() => activeScroll.current?.finish()} />}
        </AnimatePresence>
        <div className={styles.promo} data-home-promo inert={mobile && open}>
          <TopBlockSection dictionary={dictionary.topBlock} className={styles.topBlock} />
        </div>
      </div>
    </>
  );
}
