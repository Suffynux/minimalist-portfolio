"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, LoaderCircle, TriangleAlert, X } from "lucide-react";

type PreviewStatus = "checking" | "loading" | "ready" | "error";

export function SitePreview({
  name,
  url,
  onClose
}: {
  name: string;
  url: string;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<PreviewStatus>("checking");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  // Ask our server whether the site allows iframe embedding — blocked frames
  // are indistinguishable from loaded ones on the client side.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/embed-check?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setStatus(data.embeddable ? "loading" : "error");
      })
      .catch(() => {
        if (!cancelled) setStatus("loading");
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  // Safety net: if the iframe never finishes loading, surface the error state.
  useEffect(() => {
    if (status !== "loading") return;
    const timer = setTimeout(() => {
      setStatus((current) => (current === "loading" ? "error" : current));
    }, 15000);
    return () => clearTimeout(timer);
  }, [status]);

  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} live preview`}
      className="fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center p-2 sm:p-4 lg:p-6"
    >
      <button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0 z-0 cursor-default bg-ink/60 backdrop-blur-[6px]"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-[min(92dvh,820px)] w-full max-w-[1200px] flex-col overflow-hidden rounded-[14px] border border-ink/10 bg-surface shadow-[0_40px_120px_-30px_rgba(35,37,29,0.7)] sm:h-[90dvh] sm:rounded-[20px]">
        <div className="flex min-h-[56px] items-center justify-between gap-2 border-b border-ink/[0.09] bg-bone px-3 py-3 sm:gap-3 sm:px-5">
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
              className="inline-flex h-8 items-center gap-[6px] rounded-full border border-ink/15 px-2.5 text-[12px] font-medium text-body transition hover:border-olive hover:text-olive sm:px-3"
            >
              <span className="hidden sm:inline">Open site</span>
              <ExternalLink className="size-[13px]" />
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
          {status === "error" ? (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-bone px-6 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-olive/12 text-olive">
                <TriangleAlert className="size-6" />
              </span>
              <div>
                <p className="font-display text-[clamp(22px,5vw,26px)] tracking-[-0.01em]">Unable to load site preview</p>
                <p className="mx-auto mt-2 max-w-[380px] text-sm leading-[1.6] text-muted">
                  {host} can&apos;t be displayed inside the portfolio right now. You can still visit it
                  directly in a new tab.
                </p>
              </div>
              <div className="mt-1 flex items-center gap-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-[13.5px] font-semibold text-bone transition hover:bg-olive"
                >
                  Open site <ExternalLink className="size-4" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 items-center rounded-full border border-ink/20 px-6 text-[13.5px] font-semibold text-ink transition hover:border-olive hover:text-olive"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}

          {status === "checking" || status === "loading" ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-bone">
              <LoaderCircle className="size-7 animate-spin text-olive" />
              <p className="max-w-full truncate px-6 font-mono text-[12px] tracking-[0.08em] text-muted">
                LOADING {host.toUpperCase()}
              </p>
            </div>
          ) : null}

          {status === "loading" || status === "ready" ? (
            <iframe
              src={url}
              title={`${name} live site`}
              className="absolute inset-0 z-10 size-full border-0"
              onLoad={() => setStatus("ready")}
              referrerPolicy="no-referrer"
            />
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
