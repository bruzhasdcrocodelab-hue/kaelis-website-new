import type { PolicyBlock } from "./content";

const joinedHeadings: Record<string, string> = {
  "b87b3d224f98": "Prohibited Content",
  "b8130a80cccb": "Information We Collect",
  "bf131517c0b8": "How We Use Your Information",
  "1d6c7eb66882": "Legal Basis for Processing (GDPR)",
  "d067dcd62d2c": "Sharing of Data",
  "84dc2679a5fc": "Data Retention",
  "a2729edcd73a": "International Data Transfers",
  "18e25732b0ce": "Your Rights",
  "df56c40598d9": "Security of Your Data",
  "fcf8ae8e66e4": "Changes to this Policy",
  "c58b90dc80eb": "Governing Law and Jurisdiction",
  "fe4f5046cfaa": "Contact Us"
};

export function slicePolicySpans(block: PolicyBlock, start: number, end = Infinity) {
  let offset = 0;
  return block.children.flatMap(span => {
    const from = offset;
    offset += span.text.length;
    const text = span.text.slice(Math.max(0, start - from), Math.max(0, Math.min(span.text.length, end - from)));
    return text ? [{ ...span, text }] : [];
  });
}

export function withoutContactDetails(block: PolicyBlock): PolicyBlock {
  const text = block.children.map(span => span.text).join("");
  if (!/^(Contact Us|Свяжитесь с нами|Зв'яжіться з нами)/.test(text)) return block;
  const match = /(?:Maksim Shamkou|Максим Шамко)\s*info\.kaelis@gmail\.com/.exec(text);
  if (!match) return block;
  return {
    ...block,
    children: [
      ...slicePolicySpans(block, 0, match.index),
      ...slicePolicySpans(block, match.index + match[0].length).map(span => ({ ...span, _key: span._key + "-after-contact" })),
    ],
  };
}

export function numberedHeadingLength(block: PolicyBlock) {
  const text = block.children.map(span => span.text).join("");
  if (joinedHeadings[block._key]) return joinedHeadings[block._key].length;
  const newline = text.indexOf("\n");
  if (newline >= 0) return newline;
  if (block.children[0]?.marks.includes("strong")) {
    let length = 0;
    for (const span of block.children) {
      if (!span.marks.includes("strong")) break;
      length += span.text.length;
    }
    return length;
  }
  return text.length;
}
