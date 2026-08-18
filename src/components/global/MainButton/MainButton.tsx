import { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Synced from Figma (KAELIS design file), node-id=1362-3145.
 * https://www.figma.com/design/WLLFrLah2LYPkWEhwudMCp/KAELIS--Copy-?node-id=1362-3145
 *
 * variant "gradient" / "gradient-black" share the same pink gradient fill and
 * differ only in label/icon color (white vs black) — matching the Figma naming.
 * variant "stroke" has a transparent fill and a solid border/label/icon color.
 *
 * The icon is provided as a path to a single-color SVG (e.g. "/icons/edit.svg")
 * and recolored via CSS mask-image to always match the label color, since the
 * source SVGs are flat-colored assets rather than `currentColor`-driven ones.
 */

export type MainButtonVariant = "default" | "gradient" | "gradient-black" | "stroke";
export type MainButtonSize = "large" | "medium" | "small";

export interface MainButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: MainButtonVariant;
  size?: MainButtonSize;
  /** Button label. Omit (with `icon` set) to render an icon-only button. */
  children?: ReactNode;
  /** Path to a single-color SVG icon, e.g. "/icons/edit.svg". */
  icon?: string;
}

const TEXT_ONLY_PADDING: Record<MainButtonSize, string> = {
  large: "h-[52px] px-[24px]",
  medium: "h-[44px] px-[16px] py-[6px]",
  small: "h-[40px] px-[16px] py-[10px]",
};

const ICON_ONLY_PADDING: Record<MainButtonSize, string> = {
  large: "size-[52px] p-[10px]",
  medium: "size-[44px] p-[6px]",
  small: "size-[40px] p-[4px]",
};

const WITH_ICON_LAYOUT: Record<MainButtonSize, string> = {
  large: "h-[52px] gap-[10px] py-[10px] pl-[24px] pr-[12px]",
  medium: "h-[44px] gap-[6px] py-[6px] pl-[24px] pr-[8px]",
  small: "h-[40px] gap-[4px] py-[10px] pl-[16px] pr-[8px]",
};

const TEXT_SIZE: Record<MainButtonSize, string> = {
  large: "text-base",
  medium: "text-sm",
  small: "text-xs",
};

const STROKE_BORDER_WIDTH: Record<MainButtonSize, string> = {
  large: "border-[1.2px]",
  medium: "border-[1.2px]",
  small: "border-[1.1px]",
};

const ICON_BOX = "flex items-center justify-center shrink-0 p-[4px] size-[32px]";

/** Fill applied to the icon mask per variant — matches the label color. */
const ICON_FILL_CLASS: Record<MainButtonVariant, string> = {
  default: "bg-black",
  gradient: "bg-white",
  "gradient-black": "bg-black",
  stroke: "bg-[#e78fe3]",
};

function Icon({ src, variant }: { src: string; variant: MainButtonVariant }) {
  return (
    <span
      className={`${ICON_BOX} ${ICON_FILL_CLASS[variant]}`}
      style={{
        maskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "24px 24px",
        WebkitMaskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "24px 24px",
      }}
    />
  );
}

export default function MainButton({
  variant = "default",
  size = "large",
  icon,
  children,
  className,
  type = "button",
  ...rest
}: MainButtonProps) {
  const hasLabel = children != null;
  const hasIcon = Boolean(icon);
  const isStroke = variant === "stroke";

  const labelColorClasses = isStroke
    ? "text-[#e78fe3]"
    : variant === "gradient"
      ? "text-white"
      : "text-black";

  const layoutClasses =
    hasLabel && hasIcon
      ? `flex items-center ${WITH_ICON_LAYOUT[size]}`
      : hasLabel
        ? `inline-flex items-center justify-center ${TEXT_ONLY_PADDING[size]}`
        : `inline-flex items-center justify-center ${ICON_ONLY_PADDING[size]}`;

  const buttonClasses = [
    "rounded-full font-instrument-base-emphasized whitespace-nowrap transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
    layoutClasses,
    isStroke
      ? `bg-transparent border-solid border-[#e78fe3] ${STROKE_BORDER_WIDTH[size]}`
      : variant === "default"
        ? "bg-white"
        : "bg-gradient-pink",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={buttonClasses} {...rest}>
      {hasLabel && <span className={`${TEXT_SIZE[size]} ${labelColorClasses}`}>{children}</span>}
      {hasIcon && icon && <Icon src={icon} variant={variant} />}
    </button>
  );
}
