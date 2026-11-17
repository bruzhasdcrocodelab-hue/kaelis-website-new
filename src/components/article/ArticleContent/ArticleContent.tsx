import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import SanityImage from "@/components/article/SanityImage";
import styles from "./ArticleContent.module.css";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h2>{children}</h2>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    h5: ({ children }) => <h5>{children}</h5>,
    h6: ({ children }) => <h6>{children}</h6>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      if (!href) return <>{children}</>;
      const external = /^https?:\/\//i.test(href);
      return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{children}</a>;
    },
  },
  types: {
    image: ({ value }) => {
      const asset = value?.asset;
      const metadata = asset?.metadata;
      if (!asset?.url || !metadata?.dimensions?.width || !metadata.dimensions.height) return null;
      return <SanityImage
        image={{
          alt: value.alt ?? "",
          url: asset.url,
          width: metadata.dimensions.width,
          height: metadata.dimensions.height,
          lqip: metadata.lqip,
          crop: value.crop,
          hotspot: value.hotspot,
        }}
        className={styles.image}
        sizes="(max-width: 768px) 100vw, 760px"
      />;
    },
  },
};

export default function ArticleContent({ content }: { content: PortableTextBlock[] }) {
  return <div className={`font-instrument-base ${styles.content}`}>
    <PortableText value={content} components={components} onMissingComponent={false} />
  </div>;
}
