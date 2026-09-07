const SOFT_HYPHEN = "­";
const VOWELS = "aeiouyAEIOUYаеёиоуыэюяіїєАЕЁИОУЫЭЮЯІЇЄ";

export function isSingleWord(text: string): boolean {
  return text.trim().split(/\s+/).length === 1;
}

function isVowel(char: string): boolean {
  return VOWELS.includes(char);
}

function isLetter(char: string): boolean {
  return /\p{L}/u.test(char);
}

/**
 * Inserts soft-hyphen break opportunities so long words (Latin or Cyrillic)
 * can wrap at plausible syllable seams instead of overflowing the column or
 * breaking at an arbitrary character.
 *
 * A seam is placed after position `i` (between `i` and `i + 1`) when the next
 * three chars form one of:
 *  - vowel, consonant, vowel   (V-CV -> V-/CV), e.g.
 *    "compatibility" -> "compa/ti/bi/lity"; or
 *  - consonant, consonant, vowel, with a vowel somewhere before `i`
 *    (…VC-CV… -> …VC-/CV…), e.g. "pregnancy" -> "preg/nancy",
 *    "relationship" -> "relation/ship".
 *
 * Only the seam just before the last consonant of a cluster is used, so
 * runs like "ngth" are not sliced into single letters, and at least 2
 * letters are always kept on each side of a seam.
 */
export function withSoftHyphens(word: string): string {
  const chars = [...word];
  const n = chars.length;
  if (n < 5) return word;

  const vowel = chars.map(isVowel);
  const letter = chars.map(isLetter);

  let sawVowel = false;
  let result = "";
  for (let i = 0; i < n; i++) {
    result += chars[i];
    if (vowel[i]) sawVowel = true;

    // Keep >= 2 letters on each side of the seam.
    if (i < 2 || i > n - 3) continue;
    if (!letter[i] || !letter[i + 1] || !letter[i + 2]) continue;

    const vowelConsonantVowel = vowel[i] && !vowel[i + 1] && vowel[i + 2];
    const clusterBeforeLastConsonant =
      sawVowel && !vowel[i] && !vowel[i + 1] && vowel[i + 2];

    if (vowelConsonantVowel || clusterBeforeLastConsonant) {
      result += SOFT_HYPHEN;
    }
  }

  return result;
}
