import { pageMetadata, HOME_TITLE, HOME_DESCRIPTION } from "@/lib/seo";
import { EditorialPrototype } from "@/components/editorial-prototype";
import { site } from "@/lib/data";

export const metadata = pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/", home: true });

export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite", "@id": "https://www.suffynux.com/#website",
          name: "Suffynux", alternateName: "Sufiyan Ali",
          url: "https://www.suffynux.com/", inLanguage: "en",
          publisher: { "@id": "https://www.suffynux.com/#person" },
        },
        {
          "@type": "Person", "@id": "https://www.suffynux.com/#person",
          name: "Sufiyan Ali", alternateName: "Suffynux",
          url: "https://www.suffynux.com/", jobTitle: "Full-Stack Developer & AI Builder",
          sameAs: [site.github, site.linkedin, site.upwork],
        },
      ],
    }).replace(/</g, "\\u003c") }} />
    <EditorialPrototype />
  </>;
}
