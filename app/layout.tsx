import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument"
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope"
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.suffynux.com"),
  title: {
    default: "Sufiyan Ali — Shopify & Full-Stack Developer",
    template: "%s | Sufiyan Ali"
  },
  description:
    "I build Shopify stores, full-stack products and automation systems that solve real problems, help businesses grow and are used by thousands of people.",
  keywords: [
    "Sufiyan Ali",
    "Suffynux",
    "Shopify developer",
    "Full-stack developer",
    "MERN developer",
    "Next.js developer",
    "Web developer Pakistan",
    "E-commerce developer"
  ],
  authors: [{ name: "Sufiyan Ali" }],
  creator: "Sufiyan Ali",
  openGraph: {
    title: "Sufiyan Ali — I Build Products People Use",
    description:
      "From conversion-focused Shopify stores to platforms serving thousands, I turn real business problems into useful digital products.",
    url: "https://www.suffynux.com",
    siteName: "Suffynux",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sufiyan Ali — Shopify and Full-Stack Developer building products people use"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sufiyan Ali — I Build Products People Use",
    description:
      "Shopify stores, full-stack platforms and automation systems built to solve real problems and help businesses grow.",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrument.variable} ${manrope.variable} ${jetbrains.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
