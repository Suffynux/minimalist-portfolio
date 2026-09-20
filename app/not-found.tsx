import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PageShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/data";

export default function NotFound() {
  return (
    <PageShell>
      <Navbar />
      <main className="relative z-10 mx-auto flex max-w-[1200px] flex-col px-5 pb-[110px] pt-[138px] sm:px-8">
        <p className="mb-[22px] font-mono text-xs tracking-[0.14em] text-olive">404 - PAGE NOT FOUND</p>
        <h1 className="max-w-[820px] font-display text-[clamp(54px,9vw,128px)] font-normal leading-[0.92] tracking-[-0.02em]">
          That page took a <span className="italic text-olive">wrong turn</span>.
        </h1>
        <p className="mt-10 max-w-[540px] text-lg leading-[1.6] text-body">
          The link may be out of date, or the page might have moved. Here&apos;s everything else you can reach from here.
        </p>

        <div className="mt-10 flex flex-wrap gap-2.5">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/projects">See selected work</Link>
          </Button>
        </div>

        <nav aria-label="All pages" className="mt-[60px] border-t border-line pt-8">
          <p className="mb-5 font-mono text-[11.5px] tracking-[0.14em] text-meta">EVERY PAGE</p>
          <ul className="flex flex-wrap gap-x-7 gap-y-3.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-[44px] items-center font-display text-[26px] leading-none transition hover:text-olive"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-[60px]">
          <Footer />
        </div>
      </main>
    </PageShell>
  );
}
