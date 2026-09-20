import type { Metadata } from "next";
import { CompactCta } from "@/components/contact-block";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { PageShell } from "@/components/shell";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { projectDetails } from "@/lib/data";
import { ProjectFilters } from "@/components/project-filters";

export const metadata: Metadata = {
  title: "Web Development Projects",
  description:
    "Explore Shopify stores, full-stack platforms, AI tools and automation systems built by Sufiyan Ali to solve real business problems.",
  alternates: {
    canonical: "/projects"
  },
  openGraph: {
    url: "https://www.suffynux.com/projects"
  }
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <Navbar />
      <header className="relative z-10 mx-auto max-w-[1200px] px-5 pb-14 pt-[138px] sm:px-8">
        <Reveal as="p" className="mb-[22px] font-mono text-xs tracking-[0.14em] text-olive">
          PROJECTS - CASE STUDIES & DELIVERABLES
        </Reveal>
        <Reveal as="h1" className="font-display text-[clamp(54px,9vw,128px)] font-normal leading-[0.92] tracking-[-0.02em]">
          Selected
          <br />
          <span className="italic text-olive">work</span>, in detail.
        </Reveal>
        <Reveal className="mt-10 flex flex-wrap items-end justify-between gap-10">
          <p className="max-w-[540px] text-lg leading-[1.6] text-body">
            A closer look at builds I&apos;ve shipped - live links, walkthroughs and downloadable case studies. Each one solved a real business problem end to end.
          </p>
        </Reveal>
      </header>

      <ProjectFilters projects={projectDetails} />

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 py-10 pt-[30px] sm:px-8">
        <Reveal className="rounded-[22px] border-[1.5px] border-dashed border-ink/20 bg-surface/50 px-10 py-12 text-center">
          <div className="mb-2.5 font-display text-[26px] italic text-olive">more on the way</div>
          <p className="mx-auto max-w-[480px] text-[15px] leading-[1.6] text-body">
            I&apos;m always shipping - new case studies land here as projects wrap up. If you want detail on something not listed, just ask.
          </p>
        </Reveal>
      </section>

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-[110px] pt-[60px] sm:px-8">
        <CompactCta title="Like what you see?" description="Tell me about your project - I'll reply within a day." />
        <div className="mt-[38px]">
          <Footer />
        </div>
      </section>
      <WhatsAppButton />
    </PageShell>
  );
}
