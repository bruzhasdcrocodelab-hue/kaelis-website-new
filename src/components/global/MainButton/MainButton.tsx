import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

/**
 * Synced from Figma (KAELIS design file), node-id=1362-3145.
 * https://www.figma.com/design/WLLFrLah2LYPkWEhwudMCp/KAELIS--Copy-?node-id=1362-3145
 *
 * variant "gradient" / "gradient-black" share the same pink gradient fill and
 * differ only in label/icon color (white vs black) — matching the Figma naming.
 * variant "stroke" has a transparent fill, a solid `#d3aced` border, and a
 * pink-purple gradient label/icon (Figma's "pink-gradient" token).
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
  /** Rotation applied to the icon, in degrees (e.g. 90/180/-90 for directional arrows). */
  iconRotation?: number;
  /** When set, renders as a `next/link` with the same styling instead of a `<button>`. */
  href?: string;
  /** When true, forces the label and icon to `--color-black-75` regardless of `variant`. */
  muted?: boolean;
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
  stroke: "bg-gradient-pink-purple",
};

function Icon({
  src,
  variant,
  rotation,
  muted,
}: {
  src: string;
  variant: MainButtonVariant;
  rotation?: number;
  muted?: boolean;
}) {
  return (
    <span
      className={muted ? ICON_BOX : `${ICON_BOX} ${ICON_FILL_CLASS[variant]}`}
      style={{
        maskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "24px 24px",
        WebkitMaskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "24px 24px",
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        backgroundColor: muted ? "var(--color-black-75, rgba(47, 47, 47, 0.75))" : undefined,
      }}
    />
  );
}

export default function MainButton({
  variant = "default",
  size = "large",
  icon,
  iconRotation,
  href,
  muted,
  children,
  className,
  type = "button",
  style,
  ...rest
}: MainButtonProps) {
  const hasLabel = children != null;
  const hasIcon = Boolean(icon);
  const isStroke = variant === "stroke";

  const labelColorClasses = muted
    ? ""
    : isStroke
      ? "bg-gradient-pink bg-clip-text text-transparent"
      : variant === "gradient"
        ? "text-white"
        : "text-black";

  const labelColorStyle = muted ? { color: "var(--color-black-75, rgba(47, 47, 47, 0.75))" } : undefined;

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
      ? `bg-transparent border-solid border-[#d3aced] ${STROKE_BORDER_WIDTH[size]}`
      : variant === "default"
        ? "bg-white"
        : "bg-gradient-pink",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const blurStyle = {
    backdropFilter: "blur(12.5px)",
    WebkitBackdropFilter: "blur(12.5px)",
    ...style,
  };

  const content = (
    <>
      {hasLabel && (
        <span className={`${TEXT_SIZE[size]} ${labelColorClasses}`} style={labelColorStyle}>
          {children}
        </span>
      )}
      {hasIcon && icon && (
        <Icon src={icon} variant={variant} rotation={iconRotation} muted={muted} />
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={buttonClasses}
        // style={blurStyle}
        aria-label={rest["aria-label"]}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={buttonClasses} {...rest}>
      {content}
    </button>
  );
}
