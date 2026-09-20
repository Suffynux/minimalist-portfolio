import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import type {
  CaseStudyAutomation,
  CaseStudyFact,
  CaseStudyOffer,
  CaseStudyPillar,
  CaseStudyShot,
  CaseStudyStat,
  CaseStudyTechRow
} from "@/lib/case-studies";

/**
 * Case-study building blocks.
 *
 * The whole page is a single reading column (max-w-[820px]) so line length
 * stays in the comfortable 65-75 character range. Screenshots are the one
 * exception: they break out wider because dashboard detail needs the pixels.
 */

const COLUMN = "mx-auto w-full max-w-[820px] px-5 sm:px-8";
const WIDE = "mx-auto w-full max-w-[1100px] px-5 sm:px-8";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 font-mono text-[11.5px] tracking-[0.16em] text-olive">{children}</p>;
}

/** Section heading. Serif display face, generous leading, never all-caps. */
export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("font-display text-[clamp(30px,4.6vw,46px)] font-normal leading-[1.08] tracking-[-0.01em]", className)}>
      {children}
    </h2>
  );
}

/** Intro paragraph under a heading - slightly larger than body copy. */
export function Lede({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 text-[17.5px] leading-[1.68] text-ink/85 sm:text-[18.5px]">{children}</p>;
}

export function Body({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 text-[16px] leading-[1.75] text-body sm:text-[16.5px]">{children}</p>;
}

export function Section({
  children,
  className,
  wide = false
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return <section className={cn("relative z-10", wide ? WIDE : COLUMN, className)}>{children}</section>;
}

/**
 * The reading column inside a `wide` section.
 *
 * A wide section is 1100px, the reading column is 820px. Without this wrapper
 * the prose would hug the left edge of the wide container while the rest of
 * the page stays centred, so headings would visibly shift sideways mid-scroll.
 */
export function ColumnBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[820px]", className)}>{children}</div>;
}

export function Divider() {
  return (
    <div className={COLUMN}>
      <div className="h-px bg-ink/10" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export function StatRow({ stats }: { stats: CaseStudyStat[] }) {
  return (
    <Reveal>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-ink/10 py-8 sm:grid-cols-4 sm:divide-x sm:divide-ink/10">
        {stats.map((stat) => (
          <div key={stat.label} className="sm:px-6 sm:first:pl-0">
            <dd className="font-display text-[clamp(32px,5vw,44px)] font-normal leading-none tracking-[-0.01em]">
              {stat.num}
            </dd>
            <dt className="mt-2.5 font-mono text-[10.5px] leading-[1.45] tracking-[0.12em] text-meta">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

export function FactCard({ facts }: { facts: CaseStudyFact[] }) {
  return (
    <Reveal>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-6 rounded-[20px] border border-ink/[0.09] bg-surface p-7 sm:grid-cols-2 sm:p-9 lg:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="font-mono text-[10.5px] tracking-[0.12em] text-olive">{fact.label}</dt>
            <dd className="mt-2 text-[15px] leading-[1.55] text-body">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

/* -------------------------------------------------------------------------- */
/* Programs                                                                   */
/* -------------------------------------------------------------------------- */

export function PillarGrid({ items }: { items: CaseStudyPillar[] }) {
  return (
    <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Reveal key={item.no}>
          <article className="h-full rounded-[18px] border border-ink/[0.09] bg-surface p-6 sm:p-7">
            <p className="font-mono text-[11px] tracking-[0.1em] text-olive">
              {item.no} / {item.tag}
            </p>
            <h3 className="mt-3.5 text-[19px] font-semibold leading-[1.3] tracking-[-0.01em]">{item.title}</h3>
            <p className="mt-2.5 text-[15px] leading-[1.65] text-body">{item.desc}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Automations                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Each row pairs the capability with the manual process it replaced. On mobile
 * the before/now pills sit under the text; from `lg` they move into their own
 * column so the eye can scan "before -> now" down the page.
 */
export function AutomationList({ items }: { items: CaseStudyAutomation[] }) {
  return (
    <div className="mt-9 divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item) => (
        <Reveal key={item.no}>
          <article className="grid grid-cols-1 gap-4 py-7 lg:grid-cols-[auto_1fr_210px] lg:gap-7">
            <p className="font-mono text-[12px] leading-none text-olive lg:pt-1.5">{item.no}</p>
            <div>
              <h3 className="text-[18.5px] font-semibold leading-[1.3] tracking-[-0.01em]">{item.title}</h3>
              <p className="mt-2 max-w-[560px] text-[15.5px] leading-[1.65] text-body">{item.desc}</p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11.5px] leading-[1.5] lg:flex-col lg:gap-2 lg:pt-1">
              <p className="text-meta">
                <span className="text-ink/45">Before:</span> {item.before}
              </p>
              <p className="text-olive">
                <span className="text-ink/45">Now:</span> {item.now}
              </p>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Screenshots                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Dashboard screenshots. `priority` is passed for the first shot only so the
 * largest contentful paint below the fold is not delayed by lazy loading.
 */
export function Shot({ shot, priority = false }: { shot: CaseStudyShot; priority?: boolean }) {
  return (
    <Reveal className={shot.portrait && !shot.half ? "max-w-[340px]" : undefined}>
      <figure>
        <div
          className={cn(
            "relative overflow-hidden rounded-[16px] border border-ink/10 bg-surface shadow-[0_28px_60px_-40px_rgba(35,37,29,0.45)]",
            shot.portrait ? "mx-auto aspect-[348/535] max-w-[340px]" : "aspect-[1617/1278]"
          )}
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes={shot.portrait ? "340px" : "(min-width: 1100px) 1040px, 100vw"}
            className="object-contain"
            priority={priority}
          />
        </div>
        <figcaption className="mt-4">
          <h3 className="text-[17px] font-semibold leading-[1.3] tracking-[-0.01em]">{shot.title}</h3>
          <p className="mt-1.5 max-w-[680px] text-[15px] leading-[1.65] text-body">{shot.desc}</p>
        </figcaption>
      </figure>
    </Reveal>
  );
}

/**
 * Screenshots stacked down the page.
 *
 * Landscape shots get a full row to themselves. Consecutive narrow shots are
 * paired into one row instead, so a phone-shaped screenshot does not sit alone
 * next to a column of empty space.
 */
export function ShotStack({ items }: { items: CaseStudyShot[] }) {
  const rows: CaseStudyShot[][] = [];

  for (const shot of items) {
    const last = rows[rows.length - 1];
    if (shot.half && last?.length === 1 && last[0].half) {
      last.push(shot);
    } else {
      rows.push([shot]);
    }
  }

  let seen = 0;

  return (
    <div className="mt-9 flex flex-col gap-12">
      {rows.map((row) => {
        const isPair = row.length > 1;
        return (
          <div
            key={row[0].src}
            className={cn(isPair && "grid grid-cols-1 items-start gap-10 sm:grid-cols-2")}
          >
            {row.map((shot) => {
              const priority = seen++ === 0;
              return <Shot key={shot.src} shot={shot} priority={priority} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Technology table                                                           */
/* -------------------------------------------------------------------------- */

/**
 * The plain-words table. A real <table> on desktop (it is tabular data, and
 * screen readers announce the column headers), and stacked definition blocks
 * on mobile where three columns would be unreadable.
 */
export function TechTable({ rows }: { rows: CaseStudyTechRow[] }) {
  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10 lg:hidden">
        {rows.map((row) => (
          <div key={row.part} className="py-6">
            <h3 className="text-[17px] font-semibold leading-[1.3]">{row.part}</h3>
            <p className="mt-2 text-[15px] leading-[1.65] text-body">{row.does}</p>
            <p className="mt-3 font-mono text-[12px] leading-[1.55] text-olive">{row.built}</p>
          </div>
        ))}
      </div>

      {/* Desktop: real table */}
      <div className="mt-8 hidden lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/10">
              <th scope="col" className="w-[24%] pb-3 font-mono text-[10.5px] font-normal tracking-[0.12em] text-meta">
                PART OF THE SYSTEM
              </th>
              <th scope="col" className="w-[44%] pb-3 pl-6 font-mono text-[10.5px] font-normal tracking-[0.12em] text-meta">
                WHAT IT DOES
              </th>
              <th scope="col" className="pb-3 pl-6 font-mono text-[10.5px] font-normal tracking-[0.12em] text-meta">
                BUILT WITH
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.part} className="border-b border-ink/10 align-top">
                <th scope="row" className="py-5 pr-4 text-[16px] font-semibold leading-[1.4]">
                  {row.part}
                </th>
                <td className="py-5 pl-6 text-[15.5px] leading-[1.65] text-body">{row.does}</td>
                <td className="py-5 pl-6 font-mono text-[12.5px] leading-[1.6] text-olive">{row.built}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <blockquote className="mt-10 border-l-[3px] border-olive pl-6 text-[17px] leading-[1.7] text-ink/85 sm:text-[18px]">
        {children}
      </blockquote>
    </Reveal>
  );
}

/* -------------------------------------------------------------------------- */
/* Takeaway                                                                   */
/* -------------------------------------------------------------------------- */

export function OfferList({ items }: { items: CaseStudyOffer[] }) {
  return (
    <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item) => (
        <Reveal key={item.tag}>
          <article className="flex flex-col gap-3 py-6 sm:flex-row sm:items-baseline sm:gap-6">
            <p className="inline-flex shrink-0 self-start rounded-full bg-ink px-3.5 py-1.5 font-mono text-[10.5px] tracking-[0.1em] text-bone">
              {item.tag}
            </p>
            <p className="text-[15.5px] leading-[1.7] text-body">
              <span className="font-semibold text-ink">{item.title}</span> {item.desc}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
