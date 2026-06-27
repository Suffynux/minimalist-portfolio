import Image from "next/image";
import { FileText } from "lucide-react";
import { CompactCta } from "@/components/contact-block";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { PageShell } from "@/components/shell";
import { TagList } from "@/components/tag-list";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { filters, projectDetails } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <PageShell>
      <Navbar />
      <header className="relative z-10 mx-auto max-w-[1200px] px-5 pb-14 pt-[138px] sm:px-8">
        <Reveal as="p" className="mb-[22px] font-mono text-xs tracking-[0.14em] text-olive">
          PROJECTS — CASE STUDIES & DELIVERABLES
        </Reveal>
        <Reveal as="h1" className="font-display text-[clamp(54px,9vw,128px)] font-normal leading-[0.92] tracking-[-0.02em]">
          Selected
          <br />
          <span className="italic text-olive">work</span>, in detail.
        </Reveal>
        <Reveal className="mt-10 flex flex-wrap items-end justify-between gap-10">
          <p className="max-w-[540px] text-lg leading-[1.6] text-body">
            A closer look at builds I&apos;ve shipped — live links, walkthroughs and downloadable case studies. Each one solved a real business problem end to end.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {filters.map((filter) => (
              <span key={filter} className="rounded-full border border-ink/15 px-4 py-[9px] font-mono text-xs text-body">
                {filter}
              </span>
            ))}
          </div>
        </Reveal>
      </header>

      <section className="relative z-10 mx-auto flex max-w-[1200px] flex-col gap-7 px-5 py-10 pt-[30px] sm:px-8">
        {projectDetails.map((project) => (
          <Reveal as="article" key={project.no} className="grid overflow-hidden rounded-[22px] border border-ink/[0.09] bg-surface transition hover:border-olive/40 hover:shadow-[0_30px_60px_-34px_rgba(35,37,29,0.32)] lg:grid-cols-2">
            <div className={`relative min-h-[340px] overflow-hidden bg-[#E7E6DD] ${project.reverse ? "lg:order-2" : ""}`}>
              <Image src={project.img} alt={project.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 font-mono text-[11px] tracking-[0.06em] text-surface backdrop-blur">
                {project.no} / {project.kind}
              </div>
            </div>
            <div className="flex flex-col justify-center gap-[18px] p-8 sm:p-10">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11.5px] text-[#9A9A8C]">{project.meta}</span>
                <span className="rounded-full border border-olive/30 px-[11px] py-1 font-mono text-[10.5px] tracking-[0.06em] text-olive">{project.status}</span>
              </div>
              <h2 className="font-display text-[clamp(34px,4vw,48px)] font-normal leading-none tracking-[-0.01em]">{project.name}</h2>
              <p className="max-w-[520px] text-[15.5px] leading-[1.65] text-[#4F5246]">{project.desc}</p>
              <TagList tags={project.stack} />
              <div className="mt-2 flex flex-wrap gap-2.5">
                <Button asChild size="sm">
                  <a href={project.live} target="_blank" rel="noreferrer">
                    Live site <span className="font-mono">↗</span>
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={project.pdf} target="_blank" rel="noreferrer">
                    <FileText className="size-[15px]" /> Case study (PDF)
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 py-10 pt-[30px] sm:px-8">
        <Reveal className="rounded-[22px] border-[1.5px] border-dashed border-ink/20 bg-surface/50 px-10 py-12 text-center">
          <div className="mb-2.5 font-display text-[26px] italic text-olive">more on the way</div>
          <p className="mx-auto max-w-[480px] text-[15px] leading-[1.6] text-[#4F5246]">
            New case studies and project images are added here regularly. Drop the project visuals or PDF into each card slot when you build this out.
          </p>
        </Reveal>
      </section>

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-[110px] pt-[60px] sm:px-8">
        <CompactCta title="Like what you see?" description="Tell me about your project — I'll reply within a day." />
        <div className="mt-[38px]">
          <Footer />
        </div>
      </section>
      <WhatsAppButton />
    </PageShell>
  );
}
