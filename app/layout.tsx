import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./portfolio.css";

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
  metadataBase: new URL("https://www.suffynux.com"),
  title: {
    default: "Sufiyan Ali — Full-Stack Developer & AI Builder",
    template: "%s | Sufiyan Ali",
  },
  description:
    "I build full-stack applications, websites, AI integrations and automation systems around real business problems.",
  keywords: [
    "Sufiyan Ali",
    "Suffynux",
    "AI developer",
    "Shopify developer",
    "Full-stack developer",
    "MERN developer",
    "Next.js developer",
    "Web developer Pakistan",
    "E-commerce developer",
  ],
  authors: [{ name: "Sufiyan Ali" }],
  creator: "Sufiyan Ali",
  openGraph: {
    title: "Sufiyan Ali — I Build Products People Use",
    description:
      "Full-stack apps, websites and AI integrations. I turn real business problems into useful digital products.",
    url: "https://www.suffynux.com/",
    siteName: "Suffynux",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-ascii.png",
        width: 1200,
        height: 630,
        alt: "Sufiyan Ali — Full-Stack Developer and AI Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sufiyan Ali — I Build Products People Use",
    description:
      "Full-stack apps, thoughtful websites and practical AI integrations. From the interface to the business logic.",
    images: ["/og-ascii.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${manrope.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
