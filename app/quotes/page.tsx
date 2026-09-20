import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { PageShell } from "@/components/shell";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Wall } from "@/components/quotes/wall";
import { getQuotes, getWallSettings } from "@/lib/quotes/queries";
import { IndexGrid } from "@/components/quotes/index-grid";

export const metadata: Metadata = {
  title: "The Wall - Quotes & Inspiration",
  description:
    "A drifting wall of quotes - lines I've written, lines I keep coming back to, and words left here by people passing through.",
  alternates: { canonical: "/quotes" },
  openGraph: { url: "https://www.suffynux.com/quotes" }
};

// The wall is public and changes when someone submits; revalidate rather than
// rendering it fresh on every request.
export const revalidate = 60;

export default async function QuotesPage() {
  const [quotes, settings] = await Promise.all([getQuotes(), getWallSettings()]);

  return (
    <PageShell>
      <Navbar />

      {quotes.length > 0 ? (
        <Wall quotes={quotes} accepting={settings.accepting} />
      ) : (
        <div className="relative z-10 mx-auto max-w-[1200px] px-5 pb-20 pt-[160px] text-center sm:px-8">
          <p className="font-display text-[26px] italic text-olive">the wall is empty - for now</p>
        </div>
      )}

      {/*
        The index. The same quotes as plain, server-rendered text - what
        search engines and anyone without JavaScript get - and the fast way
        to jump: each entry links to its card's anchor in the deck above.
      */}
      <section id="index" className="relative z-10 mx-auto max-w-[1200px] scroll-mt-24 px-5 pb-10 pt-24 sm:px-8">
        <Reveal as="h2" className="mb-3 font-display text-[clamp(32px,4.6vw,52px)] font-normal leading-none tracking-[-0.01em]">
          Every line, in order.
        </Reveal>
        <Reveal as="p" className="mb-12 font-mono text-[11px] tracking-[0.14em] text-meta">
          {quotes.length} LINES · PICK ONE TO JUMP TO IT ON THE WALL
        </Reveal>

        <IndexGrid quotes={quotes} />
      </section>

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-[110px] sm:px-8">
        <Footer border />
      </section>

      <WhatsAppButton />
    </PageShell>
  );
}
