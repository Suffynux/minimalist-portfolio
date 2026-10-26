import type { Metadata } from "next";
import { StoryPortfolio } from "@/components/story-portfolio";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  title: "Full-Stack Developer & AI Builder",
  description:
    "Sufiyan Ali builds full-stack apps, thoughtful websites, AI integrations and the business logic behind them. Meet the human behind Suffynux.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "https://www.suffynux.com/",
    siteName: "Suffynux",
    type: "website",
    images: [{ url: "/og-portfolio.png", width: 1200, height: 630, alt: "Sufiyan Ali — Full-Stack Developer & AI Builder" }],
  },
};

export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org", "@type": "Person",
      name: "Sufiyan Ali", alternateName: "Suffynux",
      url: "https://www.suffynux.com", jobTitle: "Full-Stack Developer & AI Builder",
      sameAs: [site.github, site.linkedin, site.upwork],
    }) }} />
    <StoryPortfolio />
  </>;
}
