"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lang";

export const LocaleContext = createContext<Locale>("en");
export const useLocale = () => useContext(LocaleContext);
