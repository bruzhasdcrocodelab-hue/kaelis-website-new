"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import MainButton from "@/components/global/MainButton";
import styles from "./ConfirmationModal.module.css";

export interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  onExitComplete?: () => void;
}

function Dialog({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel }: Omit<ConfirmationModalProps, "open">) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const reduced = useReducedMotion();
  const present = useIsPresent();
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    dialog.querySelector("button")?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog ref={ref} className={styles.root} inert={!present} aria-labelledby={`${id}-title`} aria-describedby={`${id}-message`}
      onCancel={event => { event.preventDefault(); onCancel(); }}>
      <motion.div className={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.25 }} onClick={onCancel} />
      <motion.div className={styles.panel} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        transition={{ duration: reduced ? 0 : 0.32, ease: [0.32, 0.72, 0, 1] }}>
        <h2 id={`${id}-title`} className="font-bona-2xl-emphasized">{title}</h2>
        <p id={`${id}-message`} className="font-instrument-sm">{message}</p>
        <div className={styles.actions}>
          <MainButton type="button" variant="stroke" onClick={onCancel}>{cancelLabel}</MainButton>
          <MainButton type="button" variant="gradient" onClick={onConfirm}>{confirmLabel}</MainButton>
        </div>
      </motion.div>
    </dialog>
  );
}

export default function ConfirmationModal({ open, onExitComplete, ...props }: ConfirmationModalProps) {
  if (typeof document === "undefined") return null;
  return createPortal(<AnimatePresence onExitComplete={onExitComplete}>{open && <Dialog key="confirmation" {...props} />}</AnimatePresence>, document.body);
}
