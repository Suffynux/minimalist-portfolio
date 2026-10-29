import type { Metadata } from "next";
import { EditorialPrototype } from "@/components/editorial-prototype";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  title: "Suffynux — Websites, Business Apps & AI",
  description:
    "Websites, commerce operations, custom applications and practical AI. Explore Gomila OMS, CEGA and Zone Pro Matériaux, then discuss your project with Sufiyan Ali.",
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
    <EditorialPrototype />
  </>;
}
