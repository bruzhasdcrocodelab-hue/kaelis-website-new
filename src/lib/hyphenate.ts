const SOFT_HYPHEN = "­";
const VOWELS = "aeiouyAEIOUYаеёиоуыэюяіїєАЕЁИОУЫЭЮЯІЇЄ";

export function isSingleWord(text: string): boolean {
  return text.trim().split(/\s+/).length === 1;
}

function isVowel(char: string): boolean {
  return VOWELS.includes(char);
}

export function withSoftHyphens(word: string): string {
  const chars = [...word];
  let result = "";

  for (let i = 0; i < chars.length; i++) {
    result += chars[i];
    const isBoundary =
      i >= 1 &&
      i <= chars.length - 3 &&
      isVowel(chars[i]) &&
      !isVowel(chars[i + 1]) &&
      isVowel(chars[i + 2]);
    if (isBoundary) {
      result += SOFT_HYPHEN;
    }
  }

  return result;
}
