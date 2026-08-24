"use server";

import { cookies } from "next/headers";
import type { Locale } from "@/lang";
import { LOCALE_COOKIE } from "./locale";

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
