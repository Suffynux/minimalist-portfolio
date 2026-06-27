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
import { AvatarViewer } from "@/components/avatar-viewer";

export default function Home() {
  return (
    <PageShell>
      <Navbar />
      <header id="top" className="relative z-10 mx-auto max-w-[1200px] px-5 pb-24 pt-[150px] sm:px-8 md:min-h-[calc(100vh-72px)] md:pb-16 md:pt-[154px]">
        <div className="text-center md:hidden">
          <Reveal className="mb-16 flex justify-center font-mono text-[clamp(14px,3.1vw,18px)] font-medium tracking-[0.09em] text-muted">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface px-5 py-2.5 shadow-[0_18px_45px_-36px_rgba(35,37,29,0.55)]">
              <span className="size-[10px] rounded-full bg-[#3F9E68] shadow-[0_0_0_5px_rgba(63,158,104,0.16)]" />
              Available for new projects
            </span>
          </Reveal>

          <Reveal className="relative mx-auto mb-14 flex max-w-[360px] justify-center">
            <span className="absolute left-2 top-7 z-10 rounded-full border border-ink/10 bg-surface px-4 py-2.5 font-mono text-[15px] font-semibold tracking-[0.06em] text-body shadow-[0_20px_50px_-35px_rgba(35,37,29,0.55)]">
              ★ 5.0
            </span>
            <span className="absolute bottom-8 right-2 z-10 rounded-full bg-olive px-4 py-2.5 font-mono text-[15px] font-semibold tracking-[0.06em] text-surface shadow-[0_20px_50px_-35px_rgba(35,37,29,0.55)]">
              &lt;24h reply
            </span>
            <AvatarViewer variant="heroMobile" />
          </Reveal>

          <Reveal as="h1" className="mx-auto max-w-[620px] font-display text-[clamp(48px,10vw,72px)] font-normal leading-[0.95] tracking-[-0.02em]">
            Hi, I&apos;m Sufiyan.
            <br />
            I build, you <span className="italic text-olive">grow</span>.
          </Reveal>

          <Reveal as="p" className="mx-auto mt-8 max-w-[620px] text-[clamp(18px,3.6vw,24px)] leading-[1.5] text-body">
            A full-stack &amp; Shopify developer who takes the whole technical side off your plate - so you can focus on growing the business.
          </Reveal>

          <Reveal className="mx-auto mt-8 grid max-w-[440px] grid-cols-2 justify-items-center gap-x-3 gap-y-3">
            <span className="w-full rounded-full border border-ink/10 bg-bone px-3 py-2 text-center font-mono text-[14px] font-semibold tracking-[0.06em] text-body">15+ projects</span>
            <span className="w-full rounded-full border border-ink/10 bg-bone px-3 py-2 text-center font-mono text-[14px] font-semibold tracking-[0.06em] text-body">10k+ users</span>
            <span className="col-span-2 w-[46%] rounded-full border border-ink/10 bg-bone px-3 py-2 text-center font-mono text-[14px] font-semibold tracking-[0.06em] text-body">5+ yrs</span>
          </Reveal>

          <Reveal className="mx-auto mt-10 flex max-w-[520px] flex-col gap-4">
            <Button asChild size="lg" className="h-[58px] w-full text-[17px] underline underline-offset-4">
              <Link href="#work">
                View selected work <span className="font-mono">↘</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-[58px] w-full text-[17px] underline underline-offset-4">
              <Link href="#contact">Start a project</Link>
            </Button>
          </Reveal>
        </div>

        <div className="hidden text-center md:block">
          <Reveal className="mb-[72px] flex justify-center font-mono text-sm tracking-[0.09em] text-muted">
            <span className="inline-flex items-center gap-3">
              <span className="size-[9px] rounded-full bg-[#3F9E68] shadow-[0_0_0_5px_rgba(63,158,104,0.16)]" />
              Available for new projects
            </span>
          </Reveal>

          <Reveal className="relative mx-auto mb-[74px] flex w-[560px] max-w-full justify-center">
            <span className="absolute left-0 top-6 rounded-full border border-ink/10 bg-surface px-5 py-3 font-mono text-sm tracking-[0.06em] text-muted shadow-[0_20px_50px_-35px_rgba(35,37,29,0.55)]">
              ★ 5.0 rating
            </span>
            <span className="absolute right-0 top-0 rounded-full border border-ink/10 bg-surface px-5 py-3 font-mono text-sm tracking-[0.06em] text-muted shadow-[0_20px_50px_-35px_rgba(35,37,29,0.55)]">
              15+ projects
            </span>
            <span className="absolute bottom-0 left-6 rounded-full border border-ink/10 bg-surface px-5 py-3 font-mono text-sm tracking-[0.06em] text-muted shadow-[0_20px_50px_-35px_rgba(35,37,29,0.55)]">
              10k+ users
            </span>
            <span className="absolute bottom-2 right-2 rounded-full bg-olive px-5 py-3 font-mono text-sm tracking-[0.06em] text-surface shadow-[0_20px_50px_-35px_rgba(35,37,29,0.55)]">
              Replies &lt;24h
            </span>
            <AvatarViewer variant="heroLarge" />
          </Reveal>

          <Reveal as="h1" className="mx-auto max-w-[900px] font-display text-[clamp(78px,8.4vw,124px)] font-normal leading-[0.92] tracking-[-0.02em]">
            Hi, I&apos;m Sufiyan.
            <br />
            I build, you <span className="italic text-olive">grow</span>.
          </Reveal>

          <Reveal as="p" className="mx-auto mt-8 max-w-[650px] text-[22px] leading-[1.45] text-muted">
            A full-stack &amp; Shopify developer who takes the entire technical side off your plate - custom stores, MERN web apps and automations - so you can focus on growing the business.
          </Reveal>

          <Reveal className="mt-12 flex justify-center gap-4">
            <Button asChild size="lg" className="w-[250px]">
              <Link href="#work">
                View selected work <span className="font-mono">↘</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-[205px]">
              <Link href="#contact">Start a project</Link>
            </Button>
          </Reveal>
        </div>
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
