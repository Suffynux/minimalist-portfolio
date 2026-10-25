import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  Braces,
  Workflow,
  Sparkles,
  Globe2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AsciiPortrait } from "@/components/ascii-portrait";
import { CopyEmail } from "@/components/copy-email";
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
    images: [{ url: "/og-ascii.png", width: 1200, height: 630, alt: "Sufiyan Ali — Full-Stack Developer & AI Builder" }],
  },
};
const capabilities = [
  {
    icon: Braces,
    title: "Full-stack applications",
    text: "From the first screen to the last database query. Portals, dashboards, SaaS products and APIs built around how your business actually works.",
    tags: "NEXT.JS / REACT / NODE.JS / DATABASES",
  },
  {
    icon: Sparkles,
    title: "AI with a real job to do",
    text: "Useful assistants, integrated LLMs and smarter workflows. AI connected to your product, your data and a problem worth solving.",
    tags: "LLM INTEGRATIONS / CHAT AGENTS / PYTHON",
  },
  {
    icon: Workflow,
    title: "Business logic, untangled",
    text: "Applications, approvals, bookings, notifications. I turn the spreadsheets and manual handoffs into systems that keep things moving.",
    tags: "AUTOMATION / INTEGRATIONS / ADMIN TOOLS",
  },
  {
    icon: Globe2,
    title: "Websites that mean business",
    text: "Fast, considered websites and custom storefronts. A thoughtful frontend, a dependable backend and a clear path from visitor to customer.",
    tags: "WEBSITES / SHOPIFY / COMMERCE",
  },
];

export default function Home() {
  return (
    <div className="portfolio-site" id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Sufiyan Ali",
            alternateName: "Suffynux",
            url: "https://www.suffynux.com",
            jobTitle: "Full-Stack Developer & AI Builder",
            sameAs: [site.github, site.linkedin, site.upwork],
          }),
        }}
      />
      <Navbar />
      <main id="main-content">
        <section
          className="hero-section page-width"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="blue-square" /> INDEPENDENT DEVELOPER · PAKISTAN
              ↗ WORLDWIDE
            </div>
            <h1 id="hero-title">
              I make
              <br />
              ideas <em>work.</em>
              <span className="title-period" aria-hidden="true">
                *
              </span>
            </h1>
            <p className="hero-intro">
              Hey, I’m <strong>Sufiyan Ali.</strong>
              <br />
              Full-stack developer. AI builder.
              <br />
              The person who figures it out.
            </p>
            <p className="hero-description">
              I turn “what if” into websites, apps and systems that people
              actually use. From the interface to the business logic — I build
              the whole thing.
            </p>
            <div className="hero-actions">
              <a className="primary-link" href="#work">
                Explore my work <ArrowDownRight size={20} />
              </a>
              <a className="text-link" href="#contact">
                Let’s talk <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="hero-footnote">
              <span className="live-dot" /> OPEN FOR GOOD PROJECTS{" "}
              <span className="footnote-divider">/</span> FULL STACK. FULL
              OWNERSHIP.
            </div>
          </div>
          <AsciiPortrait />
        </section>
        <div className="stack-strip">
          <div className="page-width">
            <span>IDEA → INTERFACE → LOGIC → LAUNCH</span>
            <span>
              React <i>✳</i> Next.js <i>✳</i> Node.js <i>✳</i> AI integrations{" "}
              <i>✳</i> Shopify
            </span>
            <a href="#work" aria-label="Scroll to selected work">
              <ArrowDownRight size={23} />
            </a>
          </div>
        </div>
        <section id="work" className="work-section page-width section-space">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / SELECTED WORK</p>
              <h2>
                Less talk.
                <br />
                <span className="serif-word">More shipped.</span>
              </h2>
            </div>
            <p>
              A few things I’ve taken from
              <br />
              “we need this” to “it’s live.”
              <br />
              <Link href="/projects" className="text-link">
                All projects <ArrowUpRight size={16} />
              </Link>
            </p>
          </div>
          <Link href="/projects/cega" className="featured-work work-link">
            <div className="featured-visual">
              <div className="work-visual-top">
                <span>CEGA®</span>
                <span>
                  ONE PLATFORM.
                  <br />A WHOLE ECOSYSTEM.
                </span>
              </div>
              <div className="cega-window">
                <div className="window-bar">
                  <span>● ● ●</span>
                  <span>cega.com.pk / training</span>
                  <ArrowUpRight size={12} />
                </div>
                <Image
                  src="/case-studies/cega/training-overview.png"
                  alt="CEGA training dashboard showing course and applicant statistics"
                  width={1440}
                  height={1000}
                  sizes="(max-width: 760px) 90vw, 65vw"
                  className="cega-screenshot"
                />
              </div>
              <span className="visual-index">
                [ FULL-STACK DEVELOPMENT / SOLO BUILD ]
              </span>
            </div>
            <div className="featured-info">
              <div className="project-overline">
                <span>01 / NATIONAL PLATFORM</span>
                <ArrowUpRight />
              </div>
              <h3>CEGA</h3>
              <p>
                A national gaming &amp; animation hub. Connected portals,
                enrollment, judging, bookings and an AI assistant — one system
                that brings it all together.
              </p>
              <div className="project-stat">
                <strong>14+</strong>
                <span>connected application portals</span>
              </div>
              <div className="work-tags">
                <span>Next.js</span>
                <span>MongoDB</span>
                <span>AI integration</span>
              </div>
              <span className="case-study-link">
                Explore the case study <ArrowRight size={19} />
              </span>
            </div>
          </Link>
          <div className="work-pair">
            <a
              href="https://github.com/suffynux/ai-chat-agent"
              target="_blank"
              rel="noreferrer"
              className="work-link small-work"
            >
              <div className="agent-visual">
                <div className="visual-label">
                  AI CHAT AGENT <span>INTERFACE CONCEPT / 02</span>
                </div>
                <div className="ascii-orb" aria-hidden="true">
                  <pre>{`       . : : : : .
    . : + * # * + : .
   : + # @ @ @ # + :
  : * @ @ : : @ @ * :
  : # @ : + + : @ # :
  : * @ @ : : @ @ * :
   : + # @ @ @ # + :
    ' : + * # * + : '
       ' : : : : '`}</pre>
                </div>
                <div className="agent-prompt">
                  <span>How can I help your business?</span>
                  <span>↵</span>
                </div>
                <div className="agent-bottom">
                  <span>AUTHENTICATE → ASK → RESPOND</span>
                  <span className="live-dot" />
                </div>
              </div>
              <div className="project-summary">
                <div>
                  <h3>AI Chat Agent</h3>
                  <p>Full-stack AI app · LLM integration · OAuth</p>
                </div>
                <ArrowUpRight />
              </div>
            </a>
            <a
              href="https://deeniverse.com/"
              target="_blank"
              rel="noreferrer"
              className="work-link small-work"
            >
              <div className="deen-visual">
                <div className="visual-label">
                  DEENIVERSE <span>LEARNING, CONNECTED / 03</span>
                </div>
                <div className="deen-art" aria-hidden="true">
                  <span className="orbit orbit-one" />
                  <span className="orbit orbit-two" />
                  <span className="orbit orbit-three" />
                  <span className="deen-symbol">d.</span>
                  <span className="orbit-point" />
                </div>
                <div className="deen-bottom">
                  <span>
                    A little progress.
                    <br />
                    Every single day.
                  </span>
                  <span>
                    LEARN
                    <br />
                    CONNECT
                    <br />
                    GROW ↗
                  </span>
                </div>
              </div>
              <div className="project-summary">
                <div>
                  <h3>Deeniverse</h3>
                  <p>Learning platform · React · Node.js · MongoDB</p>
                </div>
                <ArrowUpRight />
              </div>
            </a>
          </div>
          <div className="more-work">
            <span className="eyebrow">ALSO SHIPPED</span>
            <a
              href="https://gomilaintersole.pk/"
              target="_blank"
              rel="noreferrer"
            >
              <strong>Gomila Intersole</strong>
              <span>Custom Shopify storefront</span>
              <ArrowUpRight size={20} />
            </a>
            <a
              href="https://www.nextgridit.co.uk/"
              target="_blank"
              rel="noreferrer"
            >
              <strong>NextGrid IT</strong>
              <span>Corporate website · Next.js</span>
              <ArrowUpRight size={20} />
            </a>
          </div>
        </section>
        <section id="services" className="capabilities-section section-space">
          <div className="page-width">
            <div className="section-heading">
              <div>
                <p className="eyebrow">02 / WHAT I BRING TO THE BUILD</p>
                <h2>
                  The whole picture.
                  <br />
                  <span className="serif-word">Every layer.</span>
                </h2>
              </div>
              <p>
                A good product needs more than a nice frontend.
                <br />I connect the experience, the intelligence
                <br />
                and the engine underneath.
              </p>
            </div>
            <div className="capability-list">
              {capabilities.map(({ icon: Icon, title, text, tags }, index) => (
                <article className="capability-row" key={title}>
                  <span className="capability-number">0{index + 1}</span>
                  <div className="capability-title">
                    <Icon size={29} strokeWidth={1.4} />
                    <h3>{title}</h3>
                  </div>
                  <div>
                    <p>{text}</p>
                    <span className="capability-tags">{tags}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="about" className="about-section section-space page-width">
          <div className="about-aside">
            <p className="eyebrow">03 / THE HUMAN BEHIND THE CODE</p>
            <div className="about-stamp" aria-hidden="true">
              <span>&lt;/&gt;</span>
              <p>
                CURIOUS MIND.
                <br />
                BUILDER AT HEART.
              </p>
            </div>
            <Link href="/journey" className="text-link">
              The longer story <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="about-copy">
            <h2>
              I care about
              <br />
              how it <span className="serif-word">works.</span>
              <br />
              And why it exists.
            </h2>
            <p>
              I’m Sufiyan, a developer based in Pakistan, working with people
              wherever good ideas happen. I like the space where a messy
              business problem becomes a clear, useful product.
            </p>
            <p>
              That means asking questions before writing code. Understanding who
              uses it, what needs to happen behind the scenes, and what success
              looks like for you. Then owning the build, end to end.
            </p>
            <div className="about-principles">
              <span>
                01 <strong>Understand first.</strong>
              </span>
              <span>
                02 <strong>Build with purpose.</strong>
              </span>
              <span>
                03 <strong>Ship. Learn. Improve.</strong>
              </span>
            </div>
          </div>
        </section>
        <section id="contact" className="contact-section">
          <div className="page-width">
            <div className="contact-top">
              <p className="eyebrow">04 / NEXT UP: YOUR IDEA</p>
              <span>
                <span className="live-dot" /> LET’S MAKE SOMETHING USEFUL
              </span>
            </div>
            <h2>
              Got a good
              <br />
              <span className="serif-word">“what if”?</span>
              <ArrowUpRight aria-hidden="true" />
            </h2>
            <div className="contact-bottom">
              <p>
                A website, an app, a workflow that could be smarter.
                <br />
                Tell me what’s on your mind.
              </p>
              <a
                className="contact-whatsapp"
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                Let’s talk on WhatsApp <ArrowUpRight size={20} />
              </a>
            </div>
            <CopyEmail />
            <Footer border />
          </div>
        </section>
      </main>
    </div>
  );
}
