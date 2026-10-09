"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, AnchorHTMLAttributes } from "react";
import { localizedHref } from "@/lib/routing";
import { useLocale } from "@/components/LocaleContext";
import { useReadingNavigation } from "./ReadingNavigationProvider";

export default function ReadingLink({ onNavigate, ...props }: ComponentProps<typeof Link>) {
  const locale = useLocale();
  props = { ...props, href: typeof props.href === "string" ? localizedHref(locale, props.href) : props.href };
  const navigation = useReadingNavigation();
  const router = useRouter();
  return <Link {...props} onNavigate={event => {
    let prevented = false;
    onNavigate?.({ preventDefault: () => { prevented = true; event.preventDefault(); } });
    if (prevented || !navigation || typeof props.href !== "string") return;
    const target = new URL(props.href, window.location.href);
    if (target.pathname === window.location.pathname && target.search === window.location.search) return;
    event.preventDefault();
    navigation.request(() => {
      const href = `${target.pathname}${target.search}${target.hash}`;
      if (props.replace) router.replace(href, { scroll: props.scroll });
      else router.push(href, { scroll: props.scroll });
    });
  }} />;
}

export function ReadingAnchor({ onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const locale = useLocale();
  props = { ...props, href: typeof props.href === "string" ? localizedHref(locale, props.href) : props.href };
  const navigation = useReadingNavigation();
  return <a {...props} onClick={event => {
    onClick?.(event);
    if (!navigation || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
      event.shiftKey || event.altKey || props.download || (props.target && props.target !== "_self")) return;
    const href = event.currentTarget.href;
    if (new URL(href).origin !== window.location.origin) return;
    event.preventDefault();
    navigation.request(() => { window.location.assign(href); });
  }} />;
}
