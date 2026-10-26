"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, X, ZoomIn, ZoomOut, ArrowUpRight } from "lucide-react";

/** Preserve the source aspect ratio; enlargement is an explicit reader action. */
export function ScreenshotPreview({
  src,
  alt,
  width = 1440,
  height = 1000,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const close = () => {
    dialog.current?.close();
    setZoomed(false);
  };
  return (
    <>
      <button
        type="button"
        className="screen-image screen-enlarge"
        aria-label={`Enlarge screenshot: ${alt}`}
        onClick={() => {
          setZoomed(false);
          dialog.current?.showModal();
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width:760px) 90vw, 75vw"
        />
        <span className="screen-enlarge-label">
          <Maximize2 size={15} /> Enlarge
        </span>
      </button>
      <dialog
        ref={dialog}
        className="screenshot-dialog"
        aria-label={alt}
        onClose={() => setZoomed(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="screenshot-dialog-bar">
          <p>{alt}</p>
          <div>
            <button
              type="button"
              onClick={() => setZoomed((v) => !v)}
              aria-pressed={zoomed}
              aria-label={zoomed ? "Fit screenshot to screen" : "Zoom in"}
            >
              {zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
              <span>{zoomed ? "Fit screen" : "Zoom in"}</span>
            </button>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              aria-label="Open original screenshot"
            >
              <ArrowUpRight size={18} />
            </a>
            <button type="button" onClick={close} aria-label="Close screenshot">
              <X size={21} />
            </button>
          </div>
        </div>
        <div
          className={`screenshot-dialog-view${zoomed ? " is-zoomed" : ""}`}
          data-lenis-prevent
          tabIndex={0}
        >
          {/* Keep the full capture available for reading small dashboard labels. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} width={width} height={height} />
        </div>
      </dialog>
    </>
  );
}
