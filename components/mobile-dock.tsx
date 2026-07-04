"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Sparkles, Waypoints, MessageCircle } from "lucide-react";
import { site } from "@/lib/data";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Work", href: "/projects", icon: LayoutGrid },
  { label: "Art", href: "/creatives", icon: Sparkles },
  { label: "Path", href: "/journey", icon: Waypoints }
] as const;

export function MobileDock() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden"
    >
      <div className="mx-auto grid max-w-[420px] grid-cols-5 items-center gap-1 rounded-[26px] border border-ink/10 bg-surface/85 p-2 shadow-[0_18px_45px_-18px_rgba(35,37,29,0.45)] backdrop-blur-[18px]">
        {tabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-[3px] rounded-[18px] py-2 text-[10.5px] font-medium transition",
                active ? "bg-olive/15 text-ink" : "text-muted hover:text-ink"
              )}
            >
              <Icon className={cn("size-5", active && "text-olive")} strokeWidth={active ? 2.2 : 1.8} />
              {tab.label}
            </Link>
          );
        })}

        <a
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex flex-col items-center gap-[3px] rounded-[18px] py-2 text-[10.5px] font-medium text-muted transition hover:text-ink"
        >
          <MessageCircle className="size-5" strokeWidth={1.8} />
          Talk
        </a>
      </div>
    </nav>
  );
}
