export interface CardFrontAssets {
  video: string;
  poster: string;
}

const cardFrontAssets = new Map<string, CardFrontAssets>(
  ["love", "yes-no", "one-card", "three-cards", "work", "family", "money"].map((slug) => {
    const root = `/images/cards/${slug}-motion/${slug}`;
    return [slug, {
      video: `${root}-motion.mp4`,
      poster: `${root}-poster.png`,
    }];
  }),
);

export function getCardFrontAssets(slug?: string) {
  return slug ? cardFrontAssets.get(slug) : undefined;
}
