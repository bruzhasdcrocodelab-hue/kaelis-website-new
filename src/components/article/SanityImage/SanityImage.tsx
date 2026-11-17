import Image from "next/image";
import type { ArticleImage } from "@/lib/articles/types";

export default function SanityImage({ image, className, priority, sizes }: {
  image: ArticleImage;
  className?: string;
  priority?: boolean;
  sizes: string;
}) {
  return <Image
    src={image.url}
    alt={image.alt}
    width={image.width}
    height={image.height}
    className={className}
    priority={priority}
    sizes={sizes}
    placeholder={image.lqip ? "blur" : "empty"}
    blurDataURL={image.lqip}
  />;
}
