"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import type { Dictionary, Locale } from "@/lang";
import { useCategories, useSpreads } from "@/components/categories/CatalogProvider";
import CategoryTopBlock, { type CategoryTopBlockProps } from "@/components/categories-page/CategoryTopBlock";
import ConfirmationModal from "@/components/global/ConfirmationModal/ConfirmationModal";
import HeroCardsSection from "@/components/main-page/HeroCardsSection";
import TopBlockSection from "@/components/main-page/TopBlockSection";
import { cardCount, type CatalogState } from "@/lib/categories/catalog";
import { HOME_CARDS, type HomeCardSlug } from "@/lib/tarot/homeCards";
import styles from "./HomeReading.module.css";

const MOBILE_QUERY = "(max-width: 768px)";
const subscribeViewport = (listener: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
};
const mobileSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;
const serverSnapshot = () => false;
type Selection = { slug: HomeCardSlug; session: number };

// Preserve the current reading while the same selection's translations load.
function useLastSuccess<T>(state: CatalogState<T>) {
  const [last, setLast] = useState(state);
  if (state.status === "success" && state !== last) setLast(state);
  return state.status === "success" ? state : last;
}

function ReadingSession({ slug, dictionary, locale, present, onProgressChange }: {
  slug: HomeCardSlug; dictionary: Dictionary; locale: Locale; present: boolean;
  onProgressChange: (hasProgress: boolean) => void;
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
      catalogStatus={catalogStatus} onProgressChange={onProgressChange} />
  );
}

function ReadingPanel({ selection, dictionary, locale, mobile, onProgressChange }: {
  selection: Selection; dictionary: Dictionary; locale: Locale; mobile: boolean;
  onProgressChange: (hasProgress: boolean) => void;
}) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const measure = () => setHeight(content.getBoundingClientRect().height);
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
      exit={{ height: mobile ? 520 : 0 }} transition={transition}>
      <motion.div ref={contentRef} className={styles.readingContent}
        initial={{ y: mobile ? "100%" : 24, opacity: mobile ? 1 : 0 }}
        animate={{ y: 0, opacity: 1 }} exit={{ y: mobile ? "100%" : 24, opacity: mobile ? 1 : 0 }}
        transition={transition}>
        {/* Only the session resets on card changes; the animated panel stays mounted. */}
        <ReadingSession key={selection.session} slug={selection.slug} dictionary={dictionary} locale={locale} present={present} onProgressChange={onProgressChange} />
      </motion.div>
    </motion.div>
  );
}

export default function HomeReading({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [session, setSession] = useState(0);
  const [pending, setPending] = useState<HomeCardSlug | null>(null);
  const [exiting, setExiting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const mobile = useSyncExternalStore(subscribeViewport, mobileSnapshot, serverSnapshot);
  const open = selection !== null || exiting;
  function startSession(slug: HomeCardSlug) {
    setNeedsConfirmation(false);
    setSession(value => value + 1);
    setSelection({ slug, session: session + 1 });
    setPending(null);
  }
  function select(slug: HomeCardSlug) {
    if (selection?.slug === slug) {
      setExiting(true);
      setSelection(null);
    } else if (selection && needsConfirmation) {
      setPending(slug);
    } else {
      startSession(slug);
    }
  }
  function confirm() {
    if (!pending) return;
    startSession(pending);
  }
  return (
    <>
      <HeroCardsSection locale={locale} heroDictionary={dictionary.hero} cardsDictionary={dictionary.cards}
        selectedSlug={selection?.slug ?? null} onCardSelect={select} />
      <div className={styles.panels}>
        <AnimatePresence mode="wait" onExitComplete={() => setExiting(false)}>
          {selection && <ReadingPanel key="reading" selection={selection} dictionary={dictionary} locale={locale} mobile={mobile} onProgressChange={setNeedsConfirmation} />}
        </AnimatePresence>
        <div className={styles.promo} inert={mobile && open}>
          <TopBlockSection dictionary={dictionary.topBlock} className={styles.topBlock} />
        </div>
      </div>
      <ConfirmationModal open={pending !== null} title={dictionary.readingConfirmation.title}
        message={dictionary.readingConfirmation.message} confirmLabel={dictionary.readingConfirmation.confirm}
        cancelLabel={dictionary.readingConfirmation.cancel} onConfirm={confirm} onCancel={() => setPending(null)} />
    </>
  );
}
