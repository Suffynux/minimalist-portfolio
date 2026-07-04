"use client";

import { useEffect, useState } from "react";
import { ExternalLink, LoaderCircle, X } from "lucide-react";

export function SitePreview({
  name,
  url,
  onClose
}: {
  name: string;
  url: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} live preview`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0 cursor-default bg-ink/60 backdrop-blur-[6px]"
        onClick={onClose}
      />

      <div className="relative flex h-[90dvh] w-full max-w-[1200px] flex-col overflow-hidden rounded-[20px] border border-ink/10 bg-surface shadow-[0_40px_120px_-30px_rgba(35,37,29,0.7)]">
        <div className="flex items-center justify-between gap-3 border-b border-ink/[0.09] bg-bone px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden gap-[6px] sm:flex" aria-hidden="true">
              <span className="size-[10px] rounded-full bg-ink/15" />
              <span className="size-[10px] rounded-full bg-ink/15" />
              <span className="size-[10px] rounded-full bg-olive/60" />
            </span>
            <p className="truncate text-[13.5px] font-semibold">{name}</p>
            <p className="hidden truncate font-mono text-[11.5px] text-muted md:block">{host}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-[6px] rounded-full border border-ink/15 px-3 text-[12px] font-medium text-body transition hover:border-olive hover:text-olive"
            >
              Open site <ExternalLink className="size-[13px]" />
            </a>
            <button
              type="button"
              aria-label="Close preview"
              onClick={onClose}
              className="grid size-8 place-items-center rounded-full bg-ink text-bone transition hover:bg-olive"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="relative flex-1 bg-bone">
          {loading ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-bone">
              <LoaderCircle className="size-7 animate-spin text-olive" />
              <p className="font-mono text-[12px] tracking-[0.08em] text-muted">LOADING {host.toUpperCase()}</p>
            </div>
          ) : null}
          <iframe
            src={url}
            title={`${name} live site`}
            className="size-full border-0"
            onLoad={() => setLoading(false)}
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}
