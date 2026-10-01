"use client";

import { useState } from "react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import type { Dictionary, Locale } from "@/lang";
import { useCategories, useSpreads } from "@/components/categories/CatalogProvider";
import CatalogStatus from "@/components/categories/CatalogStatus";
import CategoryTopBlock from "@/components/categories-page/CategoryTopBlock";
import ConfirmationModal from "@/components/global/ConfirmationModal/ConfirmationModal";
import HeroCardsSection from "@/components/main-page/HeroCardsSection";
import TopBlockSection from "@/components/main-page/TopBlockSection";
import { cardCount, type CatalogState } from "@/lib/categories/catalog";
import { HOME_CARDS, type HomeCardSlug } from "@/lib/tarot/homeCards";
import styles from "./HomeReading.module.css";

// Preserve the current reading while the same selection's translations load.
function useLastSuccess<T>(state: CatalogState<T>) {
  const [last, setLast] = useState(state);
  if (state.status === "success" && state !== last) setLast(state);
  return state.status === "success" ? state : last;
}

function ReadingPanel({ slug, dictionary, locale }: { slug: HomeCardSlug; dictionary: Dictionary; locale: Locale }) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  const mapping = HOME_CARDS[slug];
  const categoryRequest = useCategories();
  const categories = useLastSuccess(categoryRequest.state);
  const category = categories.status === "success" ? categories.data.find(item => item.slug === mapping.category) : undefined;
  const spreadRequest = useSpreads(category?.id);
  const spreads = useLastSuccess(spreadRequest.state);
  const spread = spreads.status === "success" ? spreads.data.find(item => item.slug === mapping.spread) : undefined;
  const count = spread ? cardCount(spread) : null;
  const status = categoryRequest.state.status !== "success" ? categoryRequest.state.status
    : !category ? "notFound" : spreadRequest.state.status !== "success" ? spreadRequest.state.status
    : !spread ? "notFound" : "error";
  const retry = categoryRequest.state.status === "error" ? categoryRequest.retry : spreadRequest.retry;
  return (
    <motion.div className={styles.reading} inert={!present} aria-hidden={!present}
      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.4, ease: [0.32, 0.72, 0, 1] }}>
      <motion.div className={styles.readingContent} initial={{ y: reduced ? 0 : 64 }} animate={{ y: 0 }} exit={{ y: reduced ? 0 : 64 }}
        transition={{ duration: reduced ? 0 : 0.4, ease: [0.32, 0.72, 0, 1] }}>
        {category && spread && count !== null ? (
          <>
            {(categoryRequest.state.status === "error" || spreadRequest.state.status === "error") &&
              <CatalogStatus locale={locale} status="error" retry={retry} />}
            <CategoryTopBlock dictionary={dictionary.categoryPage.topBlock} locale={locale}
              categoryLabel={dictionary.cards[mapping.label]} categoryId={category.id} spreadId={spread.id}
              maxSelectableCards={count} sessionActive={present} embedded />
          </>
        ) : <div className={styles.pending}><CatalogStatus locale={locale} status={status} retry={retry} /></div>}
      </motion.div>
    </motion.div>
  );
}

export default function HomeReading({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const [selection, setSelection] = useState<{ slug: HomeCardSlug; session: number } | null>(null);
  const [session, setSession] = useState(0);
  const [pending, setPending] = useState<HomeCardSlug | null>(null);
  const [exiting, setExiting] = useState(false);
  const open = selection !== null || exiting;
  function select(slug: HomeCardSlug) {
    if (selection?.slug === slug) {
      setExiting(true);
      setSelection(null);
    } else if (selection) {
      setPending(slug);
    } else {
      setSession(value => value + 1);
      setSelection({ slug, session: session + 1 });
    }
  }
  function confirm() {
    if (!pending) return;
    setSession(value => value + 1);
    setSelection({ slug: pending, session: session + 1 });
    setPending(null);
  }
  return (
    <>
      <HeroCardsSection locale={locale} heroDictionary={dictionary.hero} cardsDictionary={dictionary.cards}
        selectedSlug={selection?.slug ?? null} onCardSelect={select} />
      <div className={`${styles.panels} ${open ? styles.open : ""}`}>
        <AnimatePresence mode="wait" onExitComplete={() => setExiting(false)}>
          {selection && <ReadingPanel key={`${selection.slug}:${selection.session}`} slug={selection.slug} dictionary={dictionary} locale={locale} />}
        </AnimatePresence>
        <div className={styles.promo}>
          <TopBlockSection dictionary={dictionary.topBlock} className={styles.topBlock} />
        </div>
      </div>
      <ConfirmationModal open={pending !== null} title={dictionary.readingConfirmation.title}
        message={dictionary.readingConfirmation.message} confirmLabel={dictionary.readingConfirmation.confirm}
        cancelLabel={dictionary.readingConfirmation.cancel} onConfirm={confirm} onCancel={() => setPending(null)} />
    </>
  );
}
