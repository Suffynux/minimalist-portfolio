import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { PageShell } from "@/components/shell";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Wall } from "@/components/quotes/wall";
import { getQuotes, getWallSettings } from "@/lib/quotes/queries";

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

      <header className="relative z-10 mx-auto max-w-[1200px] px-5 pb-14 pt-[130px] sm:px-8">
        <Reveal as="p" className="mb-[22px] font-mono text-xs tracking-[0.14em] text-olive">
          THE WALL - QUOTES & INSPIRATION
        </Reveal>
        <Reveal as="h1" className="font-display text-[clamp(54px,9vw,128px)] font-normal leading-[0.92] tracking-[-0.02em]">
          Words worth
          <br />
          <span className="italic text-olive">keeping</span>.
        </Reveal>
        <Reveal className="mt-10 max-w-[560px]">
          <p className="text-lg leading-[1.6] text-body">
            Lines I&apos;ve written, lines I keep coming back to, and words left here by people passing
            through. One at a time, at walking pace. Swipe to move on, or tap a line to hold it.
          </p>
        </Reveal>
      </header>

      {quotes.length > 0 ? (
        <Wall quotes={quotes} accepting={settings.accepting} />
      ) : (
        <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-20 text-center sm:px-8">
          <p className="font-display text-[26px] italic text-olive">the wall is empty - for now</p>
        </div>
      )}

      {/*
        The same quotes as plain text. This is what screen readers, search
        engines and anyone without 3D transforms actually get - the wall above
        is the decorative view of this list, not a replacement for it.
      */}
      <section className="relative z-10 mx-auto max-w-[900px] px-5 pb-10 pt-24 sm:px-8">
        <Reveal as="h2" className="mb-10 font-display text-[clamp(32px,4.6vw,52px)] font-normal leading-none tracking-[-0.01em]">
          Every line, in order.
        </Reveal>
        <ol className="flex flex-col gap-9">
          {quotes.map((quote) => (
            <li key={quote.id}>
              <blockquote className="border-l-2 border-olive/30 pl-6">
                <p className="font-display text-[clamp(20px,2.6vw,28px)] leading-[1.35] text-ink">{quote.body}</p>
                <cite className="mt-2.5 block font-mono text-[11px] not-italic tracking-[0.1em] text-meta">
                  {quote.author_name ? `— ${quote.author_name.toUpperCase()}` : "— UNATTRIBUTED"}
                  {quote.posted_by ? (
                    <span className="ml-2 text-[10px] text-muted/70">POSTED BY {quote.posted_by.toUpperCase()}</span>
                  ) : null}
                </cite>
              </blockquote>
            </li>
          ))}
        </ol>
      </section>

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-[110px] sm:px-8">
        <Footer border />
      </section>

      <WhatsAppButton />
    </PageShell>
  );
}
