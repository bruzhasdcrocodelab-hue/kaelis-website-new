import { headers } from "next/headers";
import { isUrlLocale, toLocale } from "./routing";
import type { Locale } from "@/lang";

export async function getLocale(): Promise<Locale> {
  const value = (await headers()).get("x-site-locale") ?? "en";
  return isUrlLocale(value) ? toLocale(value) : "en";
}
