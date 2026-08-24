import Image from "next/image";
import Link from "next/link";
import type { CategoryIcon } from "@/lib/categories/data";
import type { SubcategoryPosition } from "@/lib/categories/subcategoryLayout";
import styles from "./SubcategoryNode.module.css";

export interface SubcategoryNodeProps {
  href: string;
  label: string;
  icon: CategoryIcon;
  position: SubcategoryPosition;
}

const ICON_SRC: Record<CategoryIcon, string> = {
  star: "/icons/main-star.svg",
  "filled-star": "/icons/filled-main-star.svg",
};

export default function SubcategoryNode({ href, label, icon, position }: SubcategoryNodeProps) {
  return (
    <Link
      href={href}
      className={styles.node}
      style={{ left: `${position.xPct}%`, top: position.yPx }}
    >
      <Image src={ICON_SRC[icon]} alt="" width={50} height={62} className={styles.icon} />
      <span className={`font-instrument-lg-emphasized ${styles.label}`}>{label}</span>
    </Link>
  );
}
