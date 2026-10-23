"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackRoute } from "@/lib/analytics";

let lastPathname: string | undefined;

export default function RouteAnalytics({ pathname, pageTitle }: { pathname: string; pageTitle: string }) {
  const currentPathname = usePathname();
  useEffect(() => {
    if (pathname !== currentPathname || pathname !== window.location.pathname || pathname === lastPathname) return;
    lastPathname = pathname;
    trackRoute(pathname, pageTitle);
  }, [pathname, currentPathname, pageTitle]);
  return null;
}
