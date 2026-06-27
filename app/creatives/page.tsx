import Image from "next/image";
import { CompactCta } from "@/components/contact-block";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { PageShell } from "@/components/shell";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { creativeHeroes, creativeSections, creativeTags, creativeTools, site } from "@/lib/data";

export default function CreativesPage() {
  return (
    <PageShell>
      <Navbar />
      <header className="relative z-10 mx-auto max-w-[1280px] px-5 pb-11 pt-[138px] sm:px-8">
        <Reveal as="p" className="mb-[22px] font-mono text-xs tracking-[0.14em] text-olive">
          CREATIVES — AI ART, DESIGN & VISUAL EXPLORATIONS
        </Reveal>
        <Reveal as="h1" className="font-display text-[clamp(54px,10vw,140px)] font-normal leading-[0.9] tracking-[-0.02em]">
          Where code
          <br />
          meets <span className="italic text-olive">craft</span>.
        </Reveal>
        <Reveal className="mt-10 flex flex-wrap items-end justify-between gap-10">
          <p className="max-w-[560px] text-lg leading-[1.6] text-body">
            Beyond development, I create. This is my visual playground — AI-generated artwork, brand concepts, product mockups and design explorations. A look at how I think in pixels, not just code.
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
            <Reveal key={hero.title} className="relative min-h-[440px] overflow-hidden rounded-[22px] bg-[#E7E6DD]">
              <Image src={hero.img} alt={hero.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,21,14,0.78),transparent_55%)]" />
              <div className="absolute bottom-7 left-[30px] text-bone">
                <div className="mb-2 font-mono text-[11px] tracking-[0.08em] text-olive">{hero.kicker}</div>
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
          <div className="masonry" style={{ columnCount: section.cols }}>
            {section.items.map((item) => (
              <Reveal key={`${section.id}-${item.cap}`} className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#E7E6DD]">
                <Image src={item.img} alt={item.cap} width={700} height={920} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="block h-auto min-h-[120px] w-full object-cover" />
                <div className="absolute inset-0 flex items-end bg-[linear-gradient(to_top,rgba(20,21,14,0.7),transparent_50%)] p-4 opacity-0 transition group-hover:opacity-100">
                  <span className="font-mono text-[11px] text-bone">{item.cap}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      <section className="relative z-10 mx-auto max-w-[1280px] px-5 pb-2.5 pt-[70px] sm:px-8">
        <Reveal className="grid gap-[34px] rounded-3xl bg-ink p-10 text-bone md:grid-cols-2 lg:grid-cols-4 lg:p-[72px]">
          <div className="max-w-[620px] md:col-span-2 lg:col-span-4">
            <p className="mb-[18px] font-mono text-xs tracking-[0.12em] text-olive">THE TOOLKIT</p>
            <h2 className="font-display text-[clamp(30px,4vw,46px)] font-normal leading-[1.05]">A creative who can also ship it.</h2>
            <p className="mt-4 text-base leading-[1.65] text-[#D6D6CB]">
              The advantage of hiring me: the same person who designs the visual can build the site it lives on. From AI concept to coded reality, nothing gets lost in translation.
            </p>
          </div>
          {creativeTools.map((tool) => (
            <div key={tool.name} className="border-t border-bone/15 pt-[18px]">
              <div className="mb-1.5 font-display text-[22px] italic text-olive">{tool.name}</div>
              <p className="text-[13px] leading-[1.5] text-[#A8A89C]">{tool.use}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="relative z-10 mx-auto max-w-[1280px] px-5 pb-[110px] pt-[70px] sm:px-8">
        <CompactCta centered title={<>Need visuals <span className="italic text-olive">and</span><br />a site to match?</>} />
        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-ink/10 pt-8 text-[13px] text-muted">
          <span className="flex items-center gap-[9px] font-semibold tracking-[0.14em]"><span className="size-[7px] rounded-full bg-olive" />SUFIYAN</span>
          <span className="font-mono">© 2026 — I build, you grow.</span>
          <div className="flex flex-wrap gap-5 font-medium">
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-ink">WhatsApp</a>
            <a href={site.github} target="_blank" rel="noreferrer" className="hover:text-ink">GitHub</a>
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="hover:text-ink">LinkedIn</a>
            <a href={site.instagram} target="_blank" rel="noreferrer" className="hover:text-ink">Instagram</a>
          </div>
        </div>
      </section>
      <WhatsAppButton />
    </PageShell>
  );
}
