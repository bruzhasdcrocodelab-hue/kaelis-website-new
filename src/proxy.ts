import { NextResponse, type NextRequest } from "next/server";
import { isUrlLocale, localizedHref, LOCALE_COOKIE, negotiateLocale, toLocale } from "@/lib/routing";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const prefix = pathname.split("/")[1];
  const locale = isUrlLocale(prefix) ? prefix : negotiateLocale(request.cookies.get(LOCALE_COOKIE)?.value, request.headers.get("accept-language"));
  const target = localizedHref(toLocale(locale), pathname);
  if (target !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, isUrlLocale(prefix) ? 308 : 307);
  }
  const headers = new Headers(request.headers);
  headers.set("x-site-locale", locale);
  const response = NextResponse.next({ request: { headers } });
  response.cookies.set(LOCALE_COOKIE, locale, { path: "/", sameSite: "lax" });
  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
