"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { Dictionary } from "@/lang";
import ConfirmationModal from "@/components/global/ConfirmationModal/ConfirmationModal";

type Session = { started: boolean; reset: () => void };
type Action = () => void | Promise<void>;
type HomeReturn = (proceed: Action) => void;
type Reason = "leave" | "switch";
type Navigation = {
  register: (session: Session) => () => void;
  registerHomeReturn: (action: HomeReturn) => () => void;
  request: (action: Action, reason?: Reason, onCancel?: () => void) => void;
  reset: () => void;
  returnHome: (action: Action) => void;
};

const ReadingNavigation = createContext<Navigation | null>(null);

export function useReadingNavigation() {
  return useContext(ReadingNavigation);
}

export default function ReadingNavigationProvider({ dictionary, children }: {
  dictionary: Dictionary["readingConfirmation"]; children: ReactNode;
}) {
  const session = useRef<Session | null>(null);
  const homeReturn = useRef<HomeReturn | null>(null);
  const pending = useRef<Action | null>(null);
  const pendingCancel = useRef<(() => void) | undefined>(undefined);
  const confirmed = useRef(false);
  const [reason, setReason] = useState<Reason>("leave");
  const [open, setOpen] = useState(false);
  const register = useCallback((value: Session) => {
    session.current = value;
    return () => { if (session.current === value) session.current = null; };
  }, []);
  const registerHomeReturn = useCallback((value: HomeReturn) => {
    homeReturn.current = value;
    return () => { if (homeReturn.current === value) homeReturn.current = null; };
  }, []);
  const reset = useCallback(() => {
    const current = session.current;
    session.current = null;
    current?.reset();
  }, []);
  const request = useCallback((action: Action, nextReason: Reason = "leave", onCancel?: () => void) => {
    if (pending.current) { onCancel?.(); return; }
    if (!session.current?.started) {
      reset();
      void action();
      return;
    }
    pending.current = action;
    pendingCancel.current = onCancel;
    confirmed.current = false;
    setReason(nextReason);
    setOpen(true);
  }, [reset]);
  const returnHome = useCallback((action: Action) => {
    if (!homeReturn.current) { void action(); return; }
    request(() => {
      if (homeReturn.current) homeReturn.current(action);
      else void action();
    });
  }, [request]);
  const value = useMemo(() => ({ register, registerHomeReturn, request, reset, returnHome }),
    [register, registerHomeReturn, request, reset, returnHome]);
  return <ReadingNavigation.Provider value={value}>
    {children}
    <ConfirmationModal open={open} title={dictionary.title}
      message={reason === "leave" ? dictionary.leaveMessage : dictionary.message}
      confirmLabel={reason === "leave" ? dictionary.leaveConfirm : dictionary.confirm}
      cancelLabel={dictionary.cancel}
      onConfirm={() => { confirmed.current = true; setOpen(false); }}
      onCancel={() => { confirmed.current = false; setOpen(false); }}
      onExitComplete={() => {
        const action = pending.current;
        const cancel = pendingCancel.current;
        pending.current = null;
        pendingCancel.current = undefined;
        if (!confirmed.current || !action) { cancel?.(); return; }
        confirmed.current = false;
        reset();
        void action();
      }} />
  </ReadingNavigation.Provider>;
}
