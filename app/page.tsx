import Link from "next/link";
import { ContactBlock } from "@/components/contact-block";
import { Footer } from "@/components/footer";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { FeaturedProjectCard, ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/service-card";
import { PageShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { featuredProject, homeStats, marqueeText, process, projects, services } from "@/lib/data";

export default function Home() {
  return (
    <PageShell>
      <Navbar />
      <header id="top" className="relative z-10 mx-auto max-w-[1200px] px-5 pb-24 pt-[150px] sm:px-8 md:pt-[146px]">
        <Reveal className="mb-[46px] flex flex-wrap items-center gap-[18px] font-mono text-xs tracking-[0.05em] text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="size-[7px] rounded-full bg-[#3F9E68] shadow-[0_0_0_4px_rgba(63,158,104,0.16)]" />
            Available for new projects
          </span>
          <span className="opacity-40">/</span>
          <span>Full-stack developer</span>
          <span className="opacity-40">/</span>
          <span>Shopify · MERN</span>
        </Reveal>

        <Reveal as="h1" className="font-display text-[clamp(64px,12.5vw,168px)] font-normal leading-[0.92] tracking-[-0.02em]">
          I build,
          <br />
          you <span className="italic text-olive">grow</span>.
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap items-end justify-between gap-12">
          <p className="max-w-[520px] text-[18.5px] font-normal leading-[1.6] text-body">
            I take the entire technical side off your plate - custom Shopify stores, MERN web apps and smart automations - so you can focus on running and growing the business.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Button asChild size="md">
              <Link href="#work">
                View selected work <span className="font-mono">↘</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="#contact">Start a project</Link>
            </Button>
          </div>
        </Reveal>
      </header>

      <Marquee text={marqueeText} />

      <section id="services" className="relative z-10 mx-auto max-w-[1200px] px-5 py-10 pt-[120px] sm:px-8">
        <Reveal className="mb-16 flex flex-wrap items-baseline justify-between gap-5">
          <div>
            <p className="mb-[18px] font-mono text-xs tracking-[0.14em] text-olive">01 - SERVICES</p>
            <h2 className="font-display text-[clamp(38px,5.5vw,68px)] font-normal leading-[1.02] tracking-[-0.01em]">
              You run the business.
              <br />
              I run the code.
            </h2>
          </div>
          <p className="max-w-[340px] text-[15.5px] leading-[1.65] text-muted">
            From storefront to shipping, from idea to deployed product - one developer, end to end. No agency overhead, no hand-offs.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.no} service={service} />
          ))}
        </div>
      </section>

      <section id="work" className="relative z-10 mx-auto max-w-[1200px] px-5 py-10 pt-[120px] sm:px-8">
        <Reveal className="mb-[54px]">
          <p className="mb-[18px] font-mono text-xs tracking-[0.14em] text-olive">02 - SELECTED WORK</p>
          <h2 className="font-display text-[clamp(38px,5.5vw,68px)] font-normal leading-none tracking-[-0.01em]">
            Recent things
            <br />
            I&apos;ve shipped.
          </h2>
        </Reveal>
        <FeaturedProjectCard project={featuredProject} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      <section id="about" className="relative z-10 mx-auto max-w-[1200px] px-5 py-10 pt-[120px] sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="mb-[22px] font-mono text-xs tracking-[0.14em] text-olive">03 - ABOUT</p>
            <h2 className="mb-7 font-display text-[clamp(34px,4.6vw,56px)] font-normal leading-[1.08] tracking-[-0.01em]">
              A developer who thinks like a partner, not a vendor.
            </h2>
            <p className="mb-[18px] max-w-[560px] text-[17px] leading-[1.7] text-body">
              I&apos;m Sufiyan - a full-stack developer specialising in Shopify and the MERN stack. Over the last few years I&apos;ve built conversion-focused storefronts, automated the boring operational work, and shipped web platforms used by thousands.
            </p>
            <p className="max-w-[560px] text-[17px] leading-[1.7] text-body">
              My promise is simple: clear communication, clean code, and work that actually moves your numbers. You stay in your zone of genius - I handle everything technical.
            </p>
          </Reveal>
          <Reveal className="grid grid-cols-2 gap-4">
            {homeStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-ink/[0.09] bg-surface px-6 py-7">
                <div className="font-display text-[46px] leading-none tracking-[-0.01em] text-olive">{stat.num}</div>
                <div className="mt-3 text-[13px] leading-[1.45] text-muted">{stat.label}</div>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal className="mt-20 grid gap-8 border-t border-ink/10 pt-[42px] sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step) => (
            <div key={step.no}>
              <div className="mb-3.5 font-mono text-xs text-olive">{step.no}</div>
              <h4 className="mb-2 font-display text-2xl font-normal">{step.title}</h4>
              <p className="text-[13.5px] leading-[1.55] text-muted">{step.desc}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section id="contact" className="relative z-10 mx-auto max-w-[1200px] px-5 pb-[110px] pt-[120px] sm:px-8">
        <ContactBlock />
        <div className="mt-[42px]">
          <Footer />
        </div>
      </section>
      <WhatsAppButton />
    </PageShell>
  );
}
