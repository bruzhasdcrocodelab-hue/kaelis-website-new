export interface CardFrontAssets {
  video: string;
  poster: string;
  title: string;
}

const cardFrontAssets = new Map<string, CardFrontAssets>(
  ["love", "yes-no", "one-card", "three-cards", "work", "family", "money"].map((slug) => {
    const root = `/images/cards/${slug}-motion/${slug}`;
    return [slug, {
      video: `${root}-motion.mp4`,
      poster: `${root}-poster.png`,
      title: `${root}-title.svg`,
    }];
  }),
);

export function getCardFrontAssets(slug?: string) {
  return slug ? cardFrontAssets.get(slug) : undefined;
}
