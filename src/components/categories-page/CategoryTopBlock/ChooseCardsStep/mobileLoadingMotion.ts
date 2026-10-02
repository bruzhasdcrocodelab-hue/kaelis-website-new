import { cardFanMobile, MOBILE_CARD_TRUE_WIDTH, MOBILE_CARD_TRUE_HEIGHT } from "../cardFanMobile";
import { loadingCards, type Track, type Tracks } from "./loadingMotion";

// Retarget the desktop choreography to the existing mobile fan, without scaling
// its layout. The spread is the zero-translation pose at 26.56% of the timeline.
const centre = cardFanMobile.find(card => card.id === "13")!;
const pile = { x: centre.left + MOBILE_CARD_TRUE_WIDTH / 2, y: centre.top + MOBILE_CARD_TRUE_HEIGHT / 2 };
const entry = { x: pile.x, y: 30 }; // Deck begins above the clipped mobile panel.

function retarget(track: Track, position: number, start: number, end: number, fallbackScale: number): Track {
  const sourceStart = track.values[0];
  const sourceEnd = track.values[track.timing.times.findIndex(time => time >= 0.8561)];
  return {
    timing: track.timing,
    values: track.values.map((value, index) => {
      const time = track.timing.times[index];
      const entering = time <= 0.2656 || time >= 0.9994;
      const source = entering ? sourceStart : sourceEnd;
      const target = (entering ? start : end) - position;
      return Math.abs(source) < 0.001 ? value * fallbackScale : value * target / source;
    }),
  };
}

export const mobileLoadingCards = cardFanMobile.map(card => {
  const desktop = loadingCards.find(source => source.cardId === card.id)!;
  const source = desktop.tracks;
  const rotationOffset = card.rotate - source.rotate!.values[1];
  const tracks: Tracks = {
    ...source,
    x: retarget(source.x!, card.left + MOBILE_CARD_TRUE_WIDTH / 2, entry.x, pile.x, MOBILE_CARD_TRUE_WIDTH / 98),
    y: retarget(source.y!, card.top + MOBILE_CARD_TRUE_HEIGHT / 2, entry.y, pile.y, MOBILE_CARD_TRUE_HEIGHT / 175),
    rotate: { ...source.rotate!, values: source.rotate!.values.map(value => value + rotationOffset) },
  };
  return { ...card, tracks };
});
