import type { Metadata } from "next";
import Image from "next/image";
import { CompactCta } from "@/components/contact-block";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { CreativeGallery } from "@/components/creative-gallery";
import { PageShell } from "@/components/shell";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { creativeHeroes, creativeSections, creativeTags, creativeTools } from "@/lib/data";

export const metadata: Metadata = {
  title: "Creative and AI Visual Work",
  description:
    "Explore Sufiyan Ali's generative artwork, product concepts and visual experiments where technical thinking meets creative craft.",
  alternates: {
    canonical: "/creatives"
  },
  openGraph: {
    url: "https://www.suffynux.com/creatives"
  }
};

export default function CreativesPage() {
  return (
    <PageShell>
      <Navbar />
      <header className="relative z-10 mx-auto max-w-[1280px] px-5 pb-11 pt-[138px] sm:px-8">
        <Reveal as="p" className="mb-[22px] font-mono text-xs tracking-[0.14em] text-olive">
          CREATIVES - DESIGN & VISUAL DIRECTION
        </Reveal>
        <Reveal as="h1" className="font-display text-[clamp(54px,9vw,128px)] font-normal leading-[0.9] tracking-[-0.02em]">
          Where code
          <br />
          meets <span className="italic text-olive">craft</span>.
        </Reveal>
        <Reveal className="mt-10 flex flex-wrap items-end justify-between gap-10">
          <p className="max-w-[560px] text-lg leading-[1.6] text-body">
            Beyond development, I care how things look. This is the visual side of my process - the directions, references and mockups I work from before a line of code gets written.
          </p>
          <div className="flex flex-wrap gap-2">
            {creativeTags.map((tag) => (
              <a key={tag.label} href={tag.href} className="rounded-full border border-ink/15 px-4 py-[9px] font-mono text-xs text-body transition hover:border-olive hover:text-olive">
                {tag.label}
              </a>
            ))}
          </div>
        </Reveal>
      </header>

      <section className="relative z-10 mx-auto max-w-[1280px] px-5 py-[30px] sm:px-8">
        <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[1.4fr_1fr]">
          {creativeHeroes.map((hero) => (
            <Reveal key={hero.title} className="relative min-h-[440px] overflow-hidden rounded-[22px] bg-shade">
              <Image src={hero.img} alt={hero.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,21,14,0.88),rgba(20,21,14,0.35)_45%,rgba(20,21,14,0.12))]" />
              <div className="absolute bottom-7 left-[30px] text-bone">
                <div className="mb-2 font-mono text-[11px] tracking-[0.08em] text-olive-light">{hero.kicker}</div>
                <h3 className="font-display text-[34px] font-normal leading-none">{hero.title}</h3>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {creativeSections.map((section) => (
        <section key={section.id} id={section.id} className="relative z-10 mx-auto max-w-[1280px] px-5 pb-2.5 pt-16 sm:px-8">
          <Reveal className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/10 pb-[22px]">
            <div>
              <p className="mb-3 font-mono text-xs tracking-[0.12em] text-olive">{section.no}</p>
              <h2 className="font-display text-[clamp(32px,4.6vw,56px)] font-normal leading-none tracking-[-0.01em]">{section.title}</h2>
            </div>
            <p className="max-w-[360px] text-[15px] leading-[1.6] text-muted">{section.desc}</p>
          </Reveal>
          <CreativeGallery items={section.items} cols={section.cols} sectionId={section.id} sectionTitle={section.title} />
        </section>
      ))}

      <section className="relative z-10 mx-auto max-w-[1280px] px-5 pb-2.5 pt-[70px] sm:px-8">
        <Reveal className="grid gap-[34px] rounded-3xl bg-ink p-10 text-bone md:grid-cols-2 lg:grid-cols-4 lg:p-[72px]">
          <div className="max-w-[620px] md:col-span-2 lg:col-span-4">
            <p className="mb-[18px] font-mono text-xs tracking-[0.12em] text-olive-light">THE TOOLKIT</p>
            <h2 className="font-display text-[clamp(30px,4vw,46px)] font-normal leading-[1.05]">A creative who can also ship it.</h2>
            <p className="mt-4 text-base leading-[1.65] text-shade-deep">
              The advantage of hiring me: the same person who designs the visual can build the site it lives on. From AI concept to coded reality, nothing gets lost in translation.
            </p>
          </div>
          {creativeTools.map((tool) => (
            <div key={tool.name} className="border-t border-bone/15 pt-[18px]">
              <div className="mb-1.5 font-display text-[22px] italic text-olive-light">{tool.name}</div>
              <p className="text-[13px] leading-[1.5] text-bone/70">{tool.use}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="relative z-10 mx-auto max-w-[1280px] px-5 pb-[110px] pt-[70px] sm:px-8">
        <CompactCta centered title={<>Need visuals <span className="italic text-olive">and</span><br />a site to match?</>} />
        <Footer border />
      </section>
      <WhatsAppButton />
    </PageShell>
  );
}
