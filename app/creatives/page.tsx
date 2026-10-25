import type { Metadata } from "next";
import { AsciiPortrait } from "@/components/ascii-portrait";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import Link from "next/link";
export const metadata: Metadata = {
  title: "ASCII Playground",
  description:
    "A little personality, written in characters. Play with Sufiyan's interactive ASCII portrait and download the original SVG, PNG or text artwork.",
  alternates: { canonical: "/creatives" },
  openGraph: {
    url: "https://www.suffynux.com/creatives",
    siteName: "Suffynux",
    type: "website",
    images: [{ url: "/og-ascii.png", width: 1200, height: 630, alt: "Sufiyan Ali — Full-Stack Developer & AI Builder" }],
  },
};
export default function CreativesPage() {
  return (
    <div className="portfolio-site" id="top">
      <Navbar />
      <main id="main-content">
        <header className="index-header page-width">
          <p className="eyebrow">THE PLAYGROUND / CODE WITH CHARACTER</p>
          <h1>
            A little less serious.
            <br />
            <span className="serif-word">Still very me.</span>
          </h1>
          <p>
            My actual face, rebuilt with letters and symbols.
            <br />
            Because a developer’s portfolio should have a little personality.
          </p>
        </header>
        <section className="page-width playground-grid">
          <AsciiPortrait />
          <div className="playground-notes">
            <p className="eyebrow">EXPERIMENT 001 / THE ASCII SELF</p>
            <h2>
              Human.
              <br />
              Character by
              <br />
              <span className="serif-word">character.</span>
            </h2>
            <p>
              Move your pointer around and I’ll follow along. Switch to focus
              mode, introduce a little glitch, or give the whole thing a blue
              backdrop.
            </p>
            <p>Same person. A different way of seeing.</p>
            <div className="playground-instructions">
              <span>
                <b>01</b> Move around. The portrait follows.
              </span>
              <span>
                <b>02</b> Try Hello, Focus and Glitch.
              </span>
              <span>
                <b>03</b> Change the palette. Take it with you.
              </span>
            </div>
            <p className="eyebrow">
              MADE FROM MY PORTRAIT / RENDERED IN REAL ASCII
            </p>
          </div>
        </section>
        <section className="page-width downloads-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">KEEP A COPY</p>
              <h2>
                Made for
                <br />
                <span className="serif-word">small circles.</span>
              </h2>
            </div>
            <p>
              Square exports for profile pictures.
              <br />
              PNG for WhatsApp. SVG for any size.
              <br />
              Plain text for the terminal at heart.
            </p>
          </div>
          <div className="download-cards">
            {[
              {
                name: "The original",
                file: "sufiyan-ascii",
                description: "Ink on paper / 1080 × 1080",
              },
              {
                name: "Electric blue",
                file: "sufiyan-ascii-blue",
                description: "Light on blue / 1080 × 1080",
              },
            ].map((avatar) => (
              <article key={avatar.file}>
                <div className="download-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/avatar/${avatar.file}.png`}
                    alt={`${avatar.name} ASCII portrait of Sufiyan Ali`}
                    loading="lazy"
                    width={1080}
                    height={1080}
                  />
                </div>
                <div className="download-description">
                  <h3>{avatar.name}</h3>
                  <p>{avatar.description}</p>
                  <div>
                    <a href={`/avatar/${avatar.file}.png`} download>
                      PNG <ArrowDownToLine size={14} />
                    </a>
                    <a href={`/avatar/${avatar.file}.svg`} download>
                      SVG <ArrowDownToLine size={14} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <a className="text-link" href="/avatar/sufiyan-ascii.txt" download>
            Or download the raw ASCII text <ArrowDownToLine size={16} />
          </a>
        </section>
        <section className="page-width index-cta">
          <p className="eyebrow">ENOUGH PLAYING AROUND?</p>
          <Link href="/projects">
            See what else I build.
            <ArrowUpRight />
          </Link>
        </section>
        <div className="page-width inner-footer">
          <Footer />
        </div>
      </main>
    </div>
  );
}
