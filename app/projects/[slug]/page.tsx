import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { CompactCta } from "@/components/contact-block";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { PageShell } from "@/components/shell";
import { TagList } from "@/components/tag-list";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ReadingProgress } from "@/components/case-study/reading-progress";
import {
  AutomationList,
  Body,
  ColumnBlock,
  Divider,
  Eyebrow,
  FactCard,
  Lede,
  OfferList,
  PillarGrid,
  PullQuote,
  Section,
  SectionTitle,
  ShotStack,
  StatRow,
  TechTable
} from "@/components/case-study/sections";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    return { title: "Case study not found" };
  }

  return {
    title: `${study.project} Case Study`,
    description: study.lede,
    alternates: { canonical: `/projects/${study.slug}` },
    openGraph: {
      title: `${study.project} - ${study.title}`,
      description: study.lede,
      url: `https://www.suffynux.com/projects/${study.slug}`,
      type: "article"
    }
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    notFound();
  }

  return (
    <PageShell>
      <ReadingProgress />
      <Navbar />

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <header className="relative z-10 pt-[120px]">
        <Section>
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex min-h-[44px] items-center gap-2 font-mono text-[12px] text-meta transition hover:text-olive"
            >
              <ArrowLeft className="size-[14px]" /> All projects
            </Link>
          </Reveal>

          <Reveal>
            <p className="mt-4 inline-flex rounded-full border border-olive/35 px-4 py-2 font-mono text-[11.5px] tracking-[0.14em] text-olive">
              {study.eyebrow}
            </p>
          </Reveal>

          <Reveal as="h1" className="mt-7 font-display text-[clamp(38px,6.4vw,66px)] font-normal leading-[1.04] tracking-[-0.02em]">
            {study.title}
          </Reveal>

          <Reveal>
            <p className="mt-7 text-[18px] leading-[1.68] text-ink/85 sm:text-[19.5px]">{study.lede}</p>
          </Reveal>

          <Reveal className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="sm">
              <a href={study.live} target="_blank" rel="noreferrer">
                Visit the live site <span className="font-mono">↗</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={study.pdf} target="_blank" rel="noreferrer">
                <Download className="size-[15px]" /> Download PDF
              </a>
            </Button>
          </Reveal>
        </Section>

        <Section className="mt-12">
          <StatRow stats={study.stats} />
        </Section>

        <Section className="mt-10">
          <FactCard facts={study.facts} />
          <Reveal>
            <p className="mt-6 text-[14.5px] leading-[1.65] text-muted">{study.readingNote}</p>
          </Reveal>
        </Section>
      </header>

      <div className="mt-16">
        <Divider />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* The problem                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section className="pt-14">
        <Reveal>
          <Eyebrow>{study.problem.eyebrow}</Eyebrow>
          <SectionTitle>{study.problem.title}</SectionTitle>
          <Lede>{study.problem.lede}</Lede>
          <Body>{study.problem.body}</Body>
        </Reveal>
      </Section>

      <div className="mt-16">
        <Divider />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* What it is                                                       */}
      {/* ---------------------------------------------------------------- */}
      <Section className="pt-14">
        <Reveal>
          <Eyebrow>{study.pillars.eyebrow}</Eyebrow>
          <SectionTitle>{study.pillars.title}</SectionTitle>
          <Lede>{study.pillars.lede}</Lede>
        </Reveal>
        <PillarGrid items={study.pillars.items} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Automations                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section className="pt-20">
        <Reveal>
          <Eyebrow>{study.automations.eyebrow}</Eyebrow>
          <SectionTitle>{study.automations.title}</SectionTitle>
          <Lede>{study.automations.lede}</Lede>
        </Reveal>
        <AutomationList items={study.automations.items} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Screenshots - wider column, the detail needs the pixels          */}
      {/* ---------------------------------------------------------------- */}
      <Section wide className="pt-20">
        <ColumnBlock>
          <Reveal>
            <Eyebrow>{study.shots.eyebrow}</Eyebrow>
            <SectionTitle>{study.shots.title}</SectionTitle>
          </Reveal>
        </ColumnBlock>
        <ShotStack items={study.shots.items} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Judging                                                          */}
      {/* ---------------------------------------------------------------- */}
      <Section wide className="pt-20">
        <ColumnBlock>
          <Reveal>
            <Eyebrow>{study.judging.eyebrow}</Eyebrow>
            <SectionTitle>{study.judging.title}</SectionTitle>
          </Reveal>
        </ColumnBlock>
        <ShotStack items={study.judging.items} />
      </Section>

      <div className="mt-20">
        <Divider />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Technology - wide so the three-column table can breathe          */}
      {/* ---------------------------------------------------------------- */}
      <Section wide className="pt-14">
        <ColumnBlock>
          <Reveal>
            <Eyebrow>{study.tech.eyebrow}</Eyebrow>
            <SectionTitle>{study.tech.title}</SectionTitle>
            <Lede>{study.tech.lede}</Lede>
          </Reveal>
        </ColumnBlock>
        <Reveal>
          <TechTable rows={study.tech.rows} />
        </Reveal>
        <ColumnBlock>
          <PullQuote>{study.tech.pullquote}</PullQuote>
          <Reveal>
            <TagList tags={study.tech.stack} className="mt-9" />
          </Reveal>
        </ColumnBlock>
      </Section>

      <div className="mt-20">
        <Divider />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Takeaway                                                         */}
      {/* ---------------------------------------------------------------- */}
      <Section className="pt-14">
        <Reveal>
          <Eyebrow>{study.takeaway.eyebrow}</Eyebrow>
          <SectionTitle>{study.takeaway.title}</SectionTitle>
          <Lede>{study.takeaway.lede}</Lede>
        </Reveal>
        <OfferList items={study.takeaway.items} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Close                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-5 pb-[110px] pt-20 sm:px-8">
        <CompactCta
          title="Have a project in mind?"
          description="A website, an AI feature, an automation, or a full web app. One developer, start to finish."
        />
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-8">
          <Link href="/projects" className="inline-flex min-h-[44px] items-center gap-2 font-mono text-[12.5px] text-meta transition hover:text-olive">
            <ArrowLeft className="size-[14px]" /> Back to all projects
          </Link>
          <a
            href={study.pdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 font-mono text-[12.5px] text-meta transition hover:text-olive"
          >
            <Download className="size-[14px]" /> {study.project} case study (PDF)
          </a>
        </div>
        <div className="mt-[38px]">
          <Footer />
        </div>
      </section>

      <WhatsAppButton />
    </PageShell>
  );
}
