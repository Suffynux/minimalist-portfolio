import type { Metadata } from "next";
import { CompactCta } from "@/components/contact-block";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { PageShell } from "@/components/shell";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { QuoteWall } from "@/components/quotes/quote-wall";
import { SubmitForm } from "@/components/quotes/submit-form";
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

      <header className="relative z-10 mx-auto max-w-[1200px] px-5 pb-16 pt-[138px] sm:px-8">
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
            through. Scroll to move through them - click any one to read it properly.
          </p>
        </Reveal>
      </header>

      {quotes.length > 0 ? (
        <QuoteWall quotes={quotes} />
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
                  {quote.author_name
                    ? `— ${quote.author_name.toUpperCase()}`
                    : quote.source === "owner"
                      ? "— SUFIYAN"
                      : "— ANONYMOUS"}
                </cite>
              </blockquote>
            </li>
          ))}
        </ol>
      </section>

      <section id="add" className="relative z-10 mx-auto max-w-[680px] px-5 py-24 sm:px-8">
        <Reveal>
          <p className="mb-[18px] font-mono text-xs tracking-[0.14em] text-olive">ADD YOURS</p>
          <h2 className="mb-4 font-display text-[clamp(30px,4.2vw,46px)] font-normal leading-[1.05] tracking-[-0.01em]">
            Leave something behind.
          </h2>
          <p className="mb-9 text-[15.5px] leading-[1.65] text-body">
            A line you wrote, or one that stuck with you. It goes straight onto the wall.
          </p>
          <SubmitForm accepting={settings.accepting} />
        </Reveal>
      </section>

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-[110px] sm:px-8">
        <CompactCta centered title={<>Like how this <span className="italic text-olive">feels</span>?<br />Let&apos;s build yours.</>} />
        <Footer border />
      </section>

      <WhatsAppButton />
    </PageShell>
  );
}
