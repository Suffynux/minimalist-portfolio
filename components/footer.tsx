import Link from "next/link";
import { site } from "@/lib/data";

export function Footer({ border = false }: { border?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-5 text-[13px] text-muted ${border ? "border-t border-ink/10 pt-8" : ""}`}>
      <span className="flex items-center gap-[9px] font-semibold tracking-[0.14em]">
        <span className="size-[7px] rounded-full bg-olive" />
        SUFIYAN
      </span>
      <span className="font-mono">© 2026 - I build, you grow.</span>
      <div className="flex flex-wrap gap-5 font-medium">
        <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-ink">WhatsApp</a>
        <a href={site.github} target="_blank" rel="noreferrer" className="hover:text-ink">GitHub</a>
        <a href={site.linkedin} target="_blank" rel="noreferrer" className="hover:text-ink">LinkedIn</a>
        <a href={site.upwork} target="_blank" rel="noreferrer" className="hover:text-ink">Upwork</a>
        <Link href={`mailto:${site.email}`} className="hover:text-ink">Email</Link>
      </div>
    </div>
  );
}
