"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export interface OurAppLinkProps {
  className?: string;
  children: React.ReactNode;
  role?: string;
  onClick?: () => void;
}

export default function OurAppLink({ className, children, role, onClick }: OurAppLinkProps) {
  const router = useRouter();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.();

    if (window.location.pathname !== "/") return;

    event.preventDefault();
    const target = document.getElementById("top-block");
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth" });
    router.replace("/#top-block", { scroll: false });
  }

  return (
    <Link href="/#top-block" className={className} role={role} onClick={handleClick}>
      {children}
    </Link>
  );
}
