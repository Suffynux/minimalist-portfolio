import { pageMetadata, SITE_URL, HOME_TITLE, HOME_DESCRIPTION } from "@/lib/seo";
import { PortfolioGuide } from "@/components/portfolio-guide";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./portfolio.css";
import "./story.css";
import "./studio.css";
import "./cinematic.css";
import "./showcase.css";
import "./client-home.css";
import "./editorial.css";
import "./editorial-complete.css";

const archivo = localFont({src:"../public/fonts/Archivo-Variable.ttf",variable:"--font-archivo",display:"swap",weight:"100 900"});

const instrument = localFont({
  src: [
    {
      path: "../public/fonts/InstrumentSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/InstrumentSerif-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument",
  display: "swap",
});
const manrope = localFont({
  src: "../public/fonts/Manrope-Variable.ttf",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});
const jetbrains = localFont({
  src: "../public/fonts/JetBrainsMono-Variable.ttf",
  variable: "--font-jetbrains",
  display: "swap",
  weight: "100 800",
});

export const metadata: Metadata = {
  ...pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/", home: true }),
  metadataBase: new URL(SITE_URL),
  applicationName: "Suffynux",
  icons: {
    icon: [
      { url: "/portrait-icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/portrait-icon-64.png", sizes: "64x64", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  authors: [{ name: "Sufiyan Ali", url: SITE_URL }],
  creator: "Sufiyan Ali",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${manrope.variable} ${jetbrains.variable} ${archivo.variable}`}
    >
      <body className="font-sans">{children}<PortfolioGuide /></body>
    </html>
  );
}
