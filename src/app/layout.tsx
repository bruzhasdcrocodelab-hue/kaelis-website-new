import type { Metadata } from "next";
import { Bona_Nova_SC, Instrument_Sans } from "next/font/google";
import "./globals.css";
import GuestAuth from "@/components/GuestAuth";
import CatalogProvider from "@/components/categories/CatalogProvider";
import { getLocale } from "@/lib/locale";

const bonaNovaSC = Bona_Nova_SC({
  variable: "--font-bona-nova-sc",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Kaelis",
  description: "Kaelis",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${bonaNovaSC.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GuestAuth />
        <CatalogProvider locale={locale}>{children}</CatalogProvider>
      </body>
    </html>
  );
}
