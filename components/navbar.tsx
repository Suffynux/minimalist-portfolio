"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AvatarViewer } from "@/components/avatar-viewer";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-ink/[0.09] bg-bone/70 backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-[18px] sm:px-8">
        <div className="flex items-center gap-[9px]">
          <AvatarViewer />
          <Link href="/#top" className="text-[13px] font-semibold tracking-[0.18em]">
            SUFIYAN
          </Link>
        </div>

        <div className="hidden items-center gap-8 text-[13.5px] font-medium text-body md:flex">
          {navItems.map((item) => {
            const active = item.href.startsWith(pathname) && pathname !== "/" && item.href !== "/#services" && item.href !== "/#about";
            return (
              <Link key={item.label} href={item.href} className={cn("transition hover:text-ink", active && "text-olive")}>
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

        <button
          type="button"
          aria-label="Toggle menu"
          className="grid size-10 place-items-center rounded-full border border-ink/15 text-ink md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-ink/[0.09] bg-bone/95 px-5 py-5 backdrop-blur-[14px] md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-4 text-[14px] font-medium text-body">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-ink" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-2 w-fit" onClick={() => setOpen(false)}>
              <Link href="/#contact">
                Let&apos;s talk <span className="font-mono">→</span>
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
