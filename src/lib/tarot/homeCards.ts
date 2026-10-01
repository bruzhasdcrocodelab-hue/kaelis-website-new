import type { Dictionary } from "@/lang";

export const HOME_CARDS = {
  love: { label: "love", category: "answer", spread: "celtic-cross" },
  "yes-no": { label: "yesNo", category: "decision", spread: "yesno" },
  "one-card": { label: "oneCard", category: "answer", spread: "triplet" },
  "three-cards": { label: "threeCards", category: "answer", spread: "triplet" },
  work: { label: "work", category: "work", spread: "my-job" },
  family: { label: "family", category: "answer", spread: "celtic-cross" },
  money: { label: "money", category: "answer", spread: "celtic-cross" },
} as const satisfies Record<string, { label: keyof Dictionary["cards"]; category: string; spread: string }>;

export type HomeCardSlug = keyof typeof HOME_CARDS;
