import { NextResponse, type NextRequest } from "next/server";
import { isUnsupportedLocalePrefix, isUrlLocale, localizedHref, lowercaseKnownLocalePathname, LOCALE_COOKIE, negotiateLocale, toLocale } from "@/lib/routing";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const prefix = pathname.split("/")[1];
  const lowercasePathname = lowercaseKnownLocalePathname(pathname);
  if (lowercasePathname !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = lowercasePathname;
    return NextResponse.redirect(url, 308);
  }
  if (/^\/(?:en|ru|ua)\/tarot\/dreams\/dream$/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -"/dream".length);
    return NextResponse.redirect(url, 301);
  }
  if (isUnsupportedLocalePrefix(prefix)) {
    const url = request.nextUrl.clone();
    url.pathname = localizedHref("en", pathname.slice(prefix.length + 1) || "/");
    return NextResponse.redirect(url, 308);
  }
  const locale = isUrlLocale(prefix) ? prefix : negotiateLocale(request.cookies.get(LOCALE_COOKIE)?.value, request.headers.get("accept-language"));
  if (!isUrlLocale(prefix)) {
    const url = request.nextUrl.clone();
    url.pathname = localizedHref(toLocale(locale), pathname);
    return NextResponse.redirect(url, 307);
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
