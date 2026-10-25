"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, Code2, RotateCcw, Sparkles } from "lucide-react";

type Mode = "hello" | "focus" | "glitch";
const messages: Record<Mode, string> = {
  hello: "Hey, I'm Sufiyan. Yes, that's really my face.",
  focus: "Headphones on. Turning coffee into working software.",
  glitch: "It's a feature. Definitely a feature.",
};

export function AsciiPortrait() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const modeRef = useRef<Mode>("hello");
  const blueRef = useRef(false);
  const [mode, setMode] = useState<Mode>("hello");
  const [blue, setBlue] = useState(false);
  const [ready, setReady] = useState(false);
  const [download, setDownload] = useState(false);
  modeRef.current = mode;
  blueRef.current = blue;

  useEffect(() => {
    const controller = new AbortController();
    let frame = 0;
    let inView = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const el = canvas.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    observer.observe(el);
    fetch("/avatar/portrait.json", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Portrait unavailable");
        return r.json() as Promise<string[]>;
      })
      .then((lines) => {
        setReady(true);
        let last = 0;
        const render = (time: number) => {
          frame = requestAnimationFrame(render);
          if (!inView || document.hidden || time - last < 50) return;
          last = time;
          context.clearRect(0, 0, 864, 864);
          context.fillStyle = blueRef.current ? "#f5f4ef" : "#20211f";
          context.font = "bold 8px monospace";
          context.textBaseline = "top";
          const moving = !reduced.matches;
          const px = moving ? pointer.current.x : 0;
          const py = moving ? pointer.current.y : 0;
          const t = time * 0.001;
          const breathing = moving ? Math.sin(t * 1.3) * 2 : 0;
          for (let y = 0; y < lines.length; y++) {
            const line = lines[y];
            const glitch =
              modeRef.current === "glitch" &&
              moving &&
              Math.sin(y * 0.55 + t * 7) > 0.88;
            const offset = glitch ? Math.sin(t * 19 + y) * 27 : 0;
            for (let x = 0; x < line.length; x++) {
              if (line[x] === " ") continue;
              const head = Math.max(0, 1 - y / 145);
              const xx = x * 6 + px * head * 14 + offset;
              const yy = y * 6 + py * head * 9 + breathing;
              context.fillText(line[x], xx, yy);
            }
          }
          if (modeRef.current === "focus") {
            // Pixel headphones sit over the ears of the actual portrait.
            context.strokeStyle = blueRef.current ? "#f5f4ef" : "#2455eb";
            context.lineWidth = 13;
            context.beginPath();
            context.arc(428 + px * 8, 293 + py * 6, 155, Math.PI, 0);
            context.stroke();
            context.fillStyle = context.strokeStyle;
            context.fillRect(268 + px * 8, 290 + py * 6, 28, 85);
            context.fillRect(562 + px * 8, 290 + py * 6, 28, 85);
          }
        };
        frame = requestAnimationFrame(render);
      })
      .catch(() => {
        /* The pre-rendered SVG remains visible if loading fails. */
      });
    return () => {
      controller.abort();
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`portrait-panel ${blue ? "portrait-blue" : ""}`}>
      <div className="portrait-topline">
        <span>
          <span className="live-dot" /> SUFIYAN.EXE
        </span>
        <span>HUMAN, MOSTLY.</span>
      </div>
      <div
        className="portrait-stage"
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          pointer.current = {
            x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
            y: ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
            active: true,
          };
        }}
        onPointerLeave={() => {
          pointer.current = { x: 0, y: 0, active: false };
        }}
      >
        <span className="portrait-coordinate" aria-hidden="true">
          + YOU FOUND THE HUMAN
        </span>
        {/* Static art also supports no-JS and a failed canvas/data request. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/avatar/sufiyan-ascii${blue ? "-blue" : ""}.svg`}
          alt="Sufiyan Ali's actual portrait rendered in ASCII characters"
          className={ready ? "portrait-fallback is-ready" : "portrait-fallback"}
        />
        <canvas
          ref={canvas}
          width={864}
          height={864}
          className={ready ? "is-ready" : ""}
          aria-hidden="true"
        />
        <span className="portrait-cross cross-one" aria-hidden="true">
          +
        </span>
        <span className="portrait-cross cross-two" aria-hidden="true">
          +
        </span>
        <span className="portrait-note" aria-hidden="true">
          a face made of code ↗
        </span>
        <span className="portrait-signature" aria-hidden="true">
          &lt;suffynux /&gt;
        </span>
      </div>
      <div className="portrait-caption" aria-live="polite">
        <span aria-hidden="true">↳</span> {messages[mode]}
      </div>
      <div className="portrait-controls">
        <div
          className="portrait-modes"
          role="group"
          aria-label="Portrait interactions"
        >
          <button
            type="button"
            aria-pressed={mode === "hello"}
            onClick={() => setMode("hello")}
          >
            <RotateCcw size={14} /> Hello
          </button>
          <button
            type="button"
            aria-pressed={mode === "focus"}
            onClick={() => setMode("focus")}
          >
            <Code2 size={15} /> Focus
          </button>
          <button
            type="button"
            aria-pressed={mode === "glitch"}
            onClick={() => setMode("glitch")}
          >
            <Sparkles size={14} /> Glitch
          </button>
        </div>
        <button
          type="button"
          className="palette-toggle"
          onClick={() => setBlue(!blue)}
          aria-pressed={blue}
          aria-label="Toggle blue portrait background"
        >
          <span />
        </button>
        <button
          type="button"
          className="portrait-save"
          onClick={() => setDownload(!download)}
          aria-label="Download ASCII portrait"
          aria-expanded={download}
          aria-controls="portrait-downloads"
        >
          <ArrowDownToLine size={17} />
        </button>
      </div>
      {download && (
        <div id="portrait-downloads" className="portrait-downloads">
          <p>
            Take a little me with you. <span>1080 × 1080 · WhatsApp ready</span>
          </p>
          <a href={`/avatar/sufiyan-ascii${blue ? "-blue" : ""}.png`} download>
            Download PNG ↗
          </a>
          <a href={`/avatar/sufiyan-ascii${blue ? "-blue" : ""}.svg`} download>
            SVG ↗
          </a>
          <a href="/avatar/sufiyan-ascii.txt" download>
            ASCII text ↗
          </a>
        </div>
      )}
    </div>
  );
}
