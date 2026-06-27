"use client";

import Image from "next/image";
import avatar from "@/lib/assessts/Avator.jpeg";
import { cn } from "@/lib/utils";

export function AvatarViewer({ variant = "nav" }: { variant?: "nav" | "hero" | "heroMobile" | "heroLarge" }) {
  return (
    <div
      aria-label="Sufiyan avatar"
      className={cn(
        "relative overflow-hidden rounded-full border border-ink/10 bg-surface shadow-[0_12px_30px_-20px_rgba(35,37,29,0.45)]",
        variant === "heroLarge"
          ? "size-[280px] border-[6px] border-surface shadow-[0_35px_90px_-45px_rgba(35,37,29,0.75)]"
          : variant === "heroMobile"
            ? "size-[min(72vw,300px)] border-[6px] border-surface shadow-[0_32px_80px_-45px_rgba(35,37,29,0.8)]"
            : variant === "hero"
              ? "size-24 sm:size-28"
              : "size-9"
      )}
    >
      <Image src={avatar} alt="Sufiyan avatar" fill sizes={variant === "heroLarge" ? "280px" : variant === "heroMobile" ? "300px" : variant === "hero" ? "112px" : "36px"} className="object-cover" priority={variant !== "nav"} />
      <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-bone/30" />
    </div>
  );
}
