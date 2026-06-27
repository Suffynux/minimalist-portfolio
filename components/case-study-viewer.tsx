"use client";

import Image from "next/image";
import { FileText, X } from "lucide-react";
import { useState } from "react";
import type { DetailedProject } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { TagList } from "@/components/tag-list";

export function CaseStudyViewer({ project }: { project: DetailedProject }) {
  const [open, setOpen] = useState(false);
  const hasPdf = project.pdf && project.pdf !== "#";

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <FileText className="size-[15px]" /> Case study (PDF)
      </Button>

      {open ? (
        <div className="fixed inset-0 z-[90] bg-ink/55 px-4 py-5 backdrop-blur-sm sm:px-6" role="dialog" aria-modal="true" aria-label={`${project.name} case study viewer`}>
          <div className="mx-auto flex h-full max-w-[1080px] flex-col overflow-hidden rounded-[24px] border border-bone/10 bg-bone text-ink shadow-[0_35px_90px_-45px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-between gap-4 border-b border-ink/10 bg-surface px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="font-mono text-[11px] tracking-[0.12em] text-olive">CASE STUDY VIEWER</p>
                <h2 className="truncate font-display text-[28px] font-normal leading-none">{project.name}</h2>
              </div>
              <button
                type="button"
                aria-label="Close case study viewer"
                onClick={() => setOpen(false)}
                className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/10 bg-bone text-ink transition hover:border-olive hover:text-olive"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[310px_1fr]">
              <aside className="border-b border-ink/10 bg-surface p-5 lg:border-b-0 lg:border-r lg:p-6">
                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[16px] bg-[#E7E6DD]">
                  <Image src={project.img} alt={project.name} fill sizes="310px" className="object-cover" />
                </div>
                <p className="mb-2 font-mono text-[11px] text-[#9A9A8C]">{project.meta}</p>
                <p className="text-[14px] leading-[1.62] text-[#4F5246]">{project.desc}</p>
                <TagList tags={project.stack} className="mt-5" />
              </aside>

              <div className="min-h-[520px] bg-[#F6F4EC] p-4 sm:p-6">
                {hasPdf ? (
                  <iframe title={`${project.name} PDF`} src={project.pdf} className="h-full min-h-[520px] w-full rounded-[16px] border border-ink/10 bg-white" />
                ) : (
                  <div className="mx-auto flex min-h-[520px] max-w-[680px] flex-col rounded-[16px] border border-ink/10 bg-surface p-8 shadow-[0_30px_70px_-55px_rgba(35,37,29,0.55)] sm:p-10">
                    <p className="mb-8 font-mono text-xs tracking-[0.14em] text-olive">{project.no} / {project.kind}</p>
                    <h3 className="font-display text-[clamp(38px,6vw,62px)] font-normal leading-none tracking-[-0.01em]">{project.name}</h3>
                    <p className="mt-3 font-mono text-[12px] text-[#9A9A8C]">{project.meta}</p>
                    <div className="my-8 h-px bg-ink/10" />
                    <p className="text-[17px] leading-[1.75] text-body">{project.desc}</p>
                    <div className="mt-auto pt-10">
                      <TagList tags={project.stack} />
                      <p className="mt-8 rounded-[14px] border border-dashed border-ink/20 px-4 py-3 font-mono text-[11px] leading-[1.6] text-muted">
                        Add the real PDF URL in `lib/data.ts` under this project&apos;s `pdf` field and it will render here inside the website.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
