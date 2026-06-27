import { CompactCta } from "@/components/contact-block";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { PageShell } from "@/components/shell";
import { TagList } from "@/components/tag-list";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { journeyStats, milestones, principles } from "@/lib/data";

export default function JourneyPage() {
  return (
    <PageShell>
      <Navbar />
      <header className="relative z-10 mx-auto max-w-[1200px] px-5 pb-10 pt-[138px] sm:px-8">
        <Reveal as="p" className="mb-[22px] font-mono text-xs tracking-[0.14em] text-olive">THE JOURNEY - HOW I GOT HERE</Reveal>
        <Reveal as="h1" className="font-display text-[clamp(54px,9vw,128px)] font-normal leading-[0.92] tracking-[-0.02em]">
          From curious
          <br />
          to <span className="italic text-olive">trusted</span>.
        </Reveal>
        <Reveal as="p" className="mt-9 max-w-[560px] text-lg leading-[1.6] text-body">
          Every line of code I write today is built on years of shipping, breaking, fixing and learning. Here&apos;s the path - and the principles I carry into every client project.
        </Reveal>
      </header>

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 py-10 sm:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {principles.map((principle) => (
            <Reveal key={principle.title} className="rounded-[18px] border border-ink/[0.09] bg-surface px-7 py-[30px]">
              <div className="mb-3 font-display text-2xl italic text-olive">{principle.tag}</div>
              <h3 className="mb-2 font-display text-[23px] font-normal">{principle.title}</h3>
              <p className="text-sm leading-[1.6] text-[#4F5246]">{principle.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[920px] px-5 py-10 pt-[70px] sm:px-8">
        <Reveal as="h2" className="mb-[54px] font-display text-[clamp(34px,5vw,56px)] font-normal leading-none">The timeline.</Reveal>
        <div className="relative pl-[34px]">
          <div className="absolute bottom-1.5 left-[7px] top-1.5 w-0.5 bg-[linear-gradient(180deg,#6E7A45,rgba(110,122,69,0.15))]" />
          <div className="flex flex-col gap-[46px]">
            {milestones.map((milestone) => (
              <Reveal key={`${milestone.year}-${milestone.label}`} className="relative">
                <span className="absolute -left-[34px] top-1 size-4 rounded-full border-[3px] border-olive bg-bone" />
                <div className="mb-2 font-mono text-xs tracking-[0.06em] text-olive">{milestone.year} · {milestone.label}</div>
                <h3 className="mb-2.5 font-display text-[clamp(26px,3.4vw,38px)] font-normal leading-[1.05] tracking-[-0.01em]">{milestone.title}</h3>
                <p className="max-w-[600px] text-[15.5px] leading-[1.66] text-[#4F5246]">{milestone.desc}</p>
                {milestone.stack ? <TagList tags={milestone.stack} className="mt-3.5" /> : null}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 py-10 pt-[70px] sm:px-8">
        <Reveal className="grid gap-[30px] rounded-3xl bg-ink p-10 text-bone sm:grid-cols-2 lg:grid-cols-4 lg:p-16">
          {journeyStats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-[clamp(40px,5vw,58px)] leading-none text-olive">{stat.num}</div>
              <div className="mt-3 text-[13.5px] leading-[1.45] text-[#D6D6CB]">{stat.label}</div>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-[110px] pt-[60px] sm:px-8">
        <CompactCta centered title={<>Now - let&apos;s write<br />your <span className="italic text-olive">chapter</span>.</>} />
        <Footer border />
      </section>
      <WhatsAppButton />
    </PageShell>
  );
}
