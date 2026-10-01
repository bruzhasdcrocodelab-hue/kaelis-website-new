"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import { createStyleStore } from "@/lib/tarot/styleStore";

const StyleContext = createContext<ReturnType<typeof createStyleStore> | null>(null);

export default function TarotStyleProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(createStyleStore);
  return <StyleContext.Provider value={store}>{children}</StyleContext.Provider>;
}

export function useTarotStyle() {
  const store = useContext(StyleContext);
  if (!store) throw new Error("TarotStyleProvider is required");
  const speakerId = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { speakerId, setSpeakerId: store.set, getSpeakerId: store.getSnapshot };
}
