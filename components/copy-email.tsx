"use client";
import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { site } from "@/lib/data";

export function CopyEmail() {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <div className="email-copy">
      <a href={`mailto:${site.email}`}>{site.email}</a>
      <button
        type="button"
        aria-label="Copy email address"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(site.email);
            setState("copied");
          } catch {
            setState("error");
          }
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => setState("idle"), 3000);
        }}
      >
        {state === "copied" ? <Check size={20} /> : <Copy size={20} />}
      </button>
      <span className="copy-status" role="status">
        {state === "copied"
          ? "Copied. Talk soon!"
          : state === "error"
            ? "Select the address to copy, or click to email."
            : ""}
      </span>
    </div>
  );
}
