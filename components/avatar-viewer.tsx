"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";
import avatar from "@/lib/assessts/Avator.jpeg";
import { cn } from "@/lib/utils";

export function AvatarViewer({ variant = "nav" }: { variant?: "nav" | "hero" | "heroLarge" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="View Sufiyan avatar"
        onClick={() => setOpen(true)}
        className={cn(
          "group relative overflow-hidden rounded-full border border-ink/10 bg-surface shadow-[0_12px_30px_-20px_rgba(35,37,29,0.45)] transition hover:-translate-y-0.5 hover:border-olive/50",
          variant === "heroLarge" ? "size-[280px] border-[6px] border-surface shadow-[0_35px_90px_-45px_rgba(35,37,29,0.75)]" : variant === "hero" ? "size-24 sm:size-28" : "size-9"
        )}
      >
        <Image src={avatar} alt="Sufiyan avatar" fill sizes={variant === "heroLarge" ? "280px" : variant === "hero" ? "112px" : "36px"} className="object-cover" priority={variant !== "nav"} />
        <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-bone/30" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/45 px-5 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-[360px] rounded-[24px] border border-bone/10 bg-ink p-4 text-bone shadow-[0_30px_80px_-35px_rgba(0,0,0,0.65)]">
            <button
              type="button"
              aria-label="Close avatar preview"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-bone/10 text-bone transition hover:bg-bone/20"
            >
              <X className="size-4" />
            </button>
            <div className="relative aspect-square overflow-hidden rounded-[18px] bg-bone">
              <Image src={avatar} alt="Sufiyan avatar large preview" fill sizes="360px" className="object-cover" />
            </div>
            <div className="flex items-center justify-between px-1 pb-1 pt-4">
              <span className="flex items-center gap-[9px] text-[13px] font-semibold tracking-[0.14em]">
                <span className="size-[7px] rounded-full bg-olive" />
                SUFIYAN
              </span>
              <span className="font-mono text-[11px] text-[#A8A89C]">avatar preview</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
