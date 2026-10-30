import type { Metadata } from "next";

export const SITE_URL = "https://www.suffynux.com";
export const HOME_TITLE = "Suffynux: Websites, Business Apps & AI";
export const HOME_DESCRIPTION = "Sufiyan Ali builds websites, full-stack business applications, e-commerce systems and practical AI integrations. Explore the work and discuss your project.";

/** Define every preview explicitly: Next.js replaces nested metadata objects. */
export function pageMetadata({ title, description, path, home = false }: {
  title: string;
  description: string;
  path: string;
  home?: boolean;
}): Metadata {
  const fullTitle = home ? title : `${title} | Suffynux`;
  const url = new URL(path, SITE_URL).href;
  const images = [{ url: "/share-image?v=citron-hero-2", width: 1200, height: 630, alt: "Suffynux: You have the what if. I build what’s next. Websites, business apps and practical AI." }];
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: { title: fullTitle, description, url, siteName: "Suffynux", locale: "en_US", type: "website", images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: images.map(image => image.url) },
  };
}
