"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AvatarViewer } from "@/components/avatar-viewer";
import { MobileDock } from "@/components/mobile-dock";

const pageLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Creatives", href: "/creatives" },
  { label: "Journey", href: "/journey" }
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-ink/[0.09] bg-bone/70 backdrop-blur-[14px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3 sm:px-8 md:py-[14px]">
          <div className="flex items-center gap-[9px]">
            <Link href="/" aria-label="Home">
              <AvatarViewer />
            </Link>
            <Link href="/" className="hidden text-[13px] font-semibold tracking-[0.18em] md:inline">
              SUFIYAN
            </Link>
          </div>

          <div className="hidden items-center gap-1 rounded-full border border-ink/[0.07] bg-ink/[0.05] p-[5px] md:flex">
            {pageLinks.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-[7px] text-[13.5px] font-medium transition",
                    active ? "bg-ink text-bone" : "text-body hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/#contact">
              Let&apos;s talk <span className="font-mono">→</span>
            </Link>
          </Button>

          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center rounded-full bg-ink px-[18px] text-[13px] font-semibold text-bone transition hover:bg-olive md:hidden"
          >
            Talk
          </a>
        </div>
      </nav>

      <MobileDock />
    </>
  );
}
