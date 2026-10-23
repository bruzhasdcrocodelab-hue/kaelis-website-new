import { Fragment, type ReactNode } from "react";
import type { PolicyBlock, PolicyDocument } from "@/lib/policies/content";
import { numberedHeadingLength, slicePolicySpans, withoutContactDetails } from "@/lib/policies/presentation";
import styles from "./TermsArticleCard.module.css";

export interface TermsArticleCardProps {
  policy: PolicyDocument;
}

function spans(block: PolicyBlock) {
  return block.children.map(span => {
    let node: ReactNode = span.text;
    for (const mark of span.marks) {
      const definition = block.markDefs.find(item => item._key === mark);
      if (mark === "strong") node = <strong>{node}</strong>;
      else if (mark === "em") node = <em>{node}</em>;
      else if (mark === "underline") node = <u>{node}</u>;
      else if (definition?.href) node = <a href={definition.href}>{node}</a>;
    }
    return <Fragment key={span._key}>{node}</Fragment>;
  });
}

function blockText(block: PolicyBlock) {
  const props = { "data-policy-block": block._key, className: styles.block };
  if (block.listItem === "number") {
    const length = numberedHeadingLength(block);
    return (
      <div {...props}>
        <h2 className={styles.numberedTitle}>{spans({ ...block, children: slicePolicySpans(block, 0, length) })}</h2>
        {length < block.children.map(span => span.text).join("").length && (
          <p>{spans({ ...block, children: slicePolicySpans(block, length) })}</p>
        )}
      </div>
    );
  }
  const content = spans(block);
  switch (block.style) {
    case "h1": return <h1 {...props}>{content}</h1>;
    case "h2": return <h2 {...props}>{content}</h2>;
    case "h3": return <h3 {...props}>{content}</h3>;
    case "h4": return <h4 {...props}>{content}</h4>;
    case "h5": return <h5 {...props}>{content}</h5>;
    case "h6": return <h6 {...props}>{content}</h6>;
    case "blockquote": return <blockquote {...props}>{content}</blockquote>;
    default: return <p {...props}>{content}</p>;
  }
}

function renderBlocks(blocks: PolicyBlock[]): ReactNode[] {
  let index = 0;
  function list(level: number, type: string): ReactNode {
    const key = blocks[index]._key;
    const items: ReactNode[] = [];
    while (index < blocks.length) {
      const block = blocks[index];
      if (!block.listItem || (block.level ?? 1) !== level || block.listItem !== type) break;
      index++;
      const nested: ReactNode[] = [];
      while (index < blocks.length && blocks[index].listItem && (blocks[index].level ?? 1) > level) {
        nested.push(list(blocks[index].level ?? 1, blocks[index].listItem!));
      }
      items.push(<li key={block._key} className={type === "number" ? styles.numberedItem : undefined}>{blockText(block)}{nested}</li>);
    }
    return type === "number" ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>;
  }
  const nodes: ReactNode[] = [];
  while (index < blocks.length) {
    const block = blocks[index];
    if (block.listItem) nodes.push(list(block.level ?? 1, block.listItem));
    else {
      nodes.push(<Fragment key={block._key}>{blockText(block)}</Fragment>);
      index++;
    }
  }
  return nodes;
}

export default function TermsArticleCard({ policy }: TermsArticleCardProps) {
  return (
    <article className={`shadow-medium ${styles.card}`}>
      <p className={`font-instrument-xs ${styles.marker}`}>Kaela AI {policy.title}</p>
      <div className={`font-instrument-base ${styles.body}`} data-policy-content>
        {renderBlocks(policy.content.map(withoutContactDetails))}
      </div>
      <div className={styles.contactPlate}>
        <p className={`font-instrument-base-emphasized ${styles.contactName}`}>{policy.language === "en" ? "Maksim Shamkou" : "Максим Шамко"}</p>
        <a className={`font-instrument-sm ${styles.contactLine}`} href="mailto:info.kaelis@gmail.com">Email: info.kaelis@gmail.com</a>
      </div>
    </article>
  );
}
