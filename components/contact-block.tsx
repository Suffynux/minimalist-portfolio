import Link from "next/link";
import { site } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export function ContactBlock() {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-[26px] bg-ink px-9 py-12 text-bone sm:px-14 md:px-20 md:py-[90px]">
        <div className="pointer-events-none absolute -bottom-[90px] -right-[60px] font-display text-[300px] italic leading-none text-olive/15">&amp;</div>
        <p className="relative mb-[26px] font-mono text-xs tracking-[0.14em] text-olive">04 - LET&apos;S TALK</p>
        <h2 className="relative font-display text-[clamp(44px,7vw,96px)] font-normal leading-[0.98] tracking-[-0.015em]">
          Have a project?
          <br />
          Let&apos;s <span className="italic text-olive">build</span> it.
        </h2>
        <p className="relative mt-7 max-w-[480px] text-[17px] leading-[1.6] text-[#D6D6CB]">
          Tell me what you&apos;re working on. I reply within a day - Shopify build, web app, or just figuring out what you need.
        </p>
        <div className="relative mt-10 flex flex-wrap gap-3.5">
          <Button asChild variant="whatsapp" size="lg" className="w-[220px]">
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">
              <WhatsAppIcon className="size-[18px]" /> WhatsApp me
            </a>
          </Button>
          <Button asChild variant="olive" size="lg" className="w-[220px]">
            <Link href={`mailto:${site.email}`}>
              {site.email} <span className="font-mono">→</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-[220px] border-bone/20 text-bone hover:border-olive hover:text-olive">
            <Link href={`tel:${site.phone}`}>{site.phone}</Link>
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

export function CompactCta({
  title,
  description,
  centered = false
}: {
  title: React.ReactNode;
  description?: string;
  centered?: boolean;
}) {
  return (
    <Reveal>
      <div className={centered ? "py-5 pb-12 text-center" : "flex flex-wrap items-center justify-between gap-8 rounded-[26px] bg-ink p-10 text-bone md:p-[72px]"}>
        <div>
          <h2 className="font-display text-[clamp(34px,5vw,60px)] font-normal leading-none">{title}</h2>
          {description ? <p className="mt-3.5 max-w-[420px] text-base text-[#D6D6CB]">{description}</p> : null}
        </div>
        <div className={`flex flex-wrap gap-3 ${centered ? "mt-8 justify-center" : ""}`}>
          <Button asChild variant="whatsapp" size="md">
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp me</a>
          </Button>
          <Button asChild variant={centered ? "ink" : "olive"} size="md">
            <Link href={`mailto:${site.email}`}>Email →</Link>
          </Button>
          <Button asChild variant="outline" size="md" className={centered ? "" : "border-bone/20 text-bone hover:border-olive hover:text-olive"}>
            <Link href={`tel:${site.phone}`}>{site.phone}</Link>
          </Button>
        </div>
      </div>
    </Reveal>
  );
}
