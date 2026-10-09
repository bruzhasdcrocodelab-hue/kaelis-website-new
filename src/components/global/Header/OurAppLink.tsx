"use client";

import { useRouter } from "next/navigation";
import Link from "@/components/reading/ReadingLink";
import { useReadingNavigation } from "@/components/reading/ReadingNavigationProvider";

export interface OurAppLinkProps {
  className?: string;
  children: React.ReactNode;
  role?: string;
  onClick?: () => void;
}

export default function OurAppLink({ className, children, role, onClick }: OurAppLinkProps) {
  const router = useRouter();
  const navigation = useReadingNavigation();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    onClick?.();

    if (window.location.pathname !== "/") return;

    event.preventDefault();
    const proceed = () => {
      const target = document.getElementById("top-block");
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth" });
      router.replace("/#top-block", { scroll: false });
    };
    if (navigation) navigation.returnHome(proceed);
    else proceed();
  }

  return (
    <Link href="/#top-block" className={className} role={role} onClick={handleClick}>
      {children}
    </Link>
  );
}
