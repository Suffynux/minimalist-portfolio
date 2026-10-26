"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

export function LogicScratch({
  onProgress,
}: {
  onProgress: (progress: number) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const previous = useRef<{ x: number; y: number } | null>(null);
  const visited = useRef(new Set<number>());
  const [revealed, setRevealed] = useState(false);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const el = canvas.current,
      ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#d6d8cb";
    ctx.fillRect(0, 0, 800, 480);
    ctx.fillStyle = "#8a917b";
    for (let y = 0; y < 480; y += 5)
      for (let x = 0; x < 800; x += 5)
        if ((x * 17 + y * 31) % 19 < 9) ctx.fillRect(x, y, 1.5, 1.5);
    ctx.textAlign = "center";
    ctx.fillStyle = "#23251d";
    ctx.font = "600 40px sans-serif";
    ctx.fillText("Scratch to see the logic.", 400, 228);
    ctx.font = "16px monospace";
    ctx.fillText("A SIMPLE CLICK. A WHOLE SYSTEM.", 400, 267);
  }, [version]);
  const reveal = () => {
    setRevealed(true);
    onProgress(1);
  };
  const scratch = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealed) return;
    const el = canvas.current,
      ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 800,
      y = ((event.clientY - rect.top) / rect.height) * 480;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 72;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(previous.current?.x ?? x, previous.current?.y ?? y);
    ctx.lineTo(x, y);
    ctx.stroke();
    previous.current = { x, y };
    for (let row = 0; row < 12; row++)
      for (let col = 0; col < 20; col++)
        if (Math.hypot(col * 40 + 20 - x, row * 40 + 20 - y) < 55)
          visited.current.add(row * 20 + col);
    const fraction = Math.min(1, visited.current.size / 100);
    onProgress(fraction);
    if (fraction >= 1) reveal();
  };
  return (
    <div className="scratch-experience">
      <div className={`scratch-surface ${revealed ? "is-revealed" : ""}`}>
        <div className="logic-reveal">
          <span className="logic-reveal-label">
            WHAT HAPPENS AFTER “APPLY”?
          </span>
          <div className="logic-chain">
            <span>Application</span>
            <ArrowRight />
            <span>Validation</span>
            <ArrowRight />
            <span>Review</span>
          </div>
          <div className="logic-chain second">
            <span>Decision</span>
            <ArrowRight />
            <span>Notification</span>
            <ArrowRight />
            <span>Dashboard</span>
          </div>
          <p>
            The interface is the beginning.
            <br />
            <strong>The business logic makes it work.</strong>
          </p>
          <small>AN ILLUSTRATIVE WORKFLOW / BUILT AROUND YOUR BUSINESS</small>
        </div>
        <canvas
          ref={canvas}
          width={800}
          height={480}
          aria-label="Scratch with your pointer to reveal a business workflow, or use the reveal button below."
          onPointerDown={(e) => {
            drawing.current = true;
            previous.current = null;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratch(e);
          }}
          onPointerMove={scratch}
          onPointerUp={() => {
            drawing.current = false;
            previous.current = null;
          }}
          onPointerCancel={() => {
            drawing.current = false;
            previous.current = null;
          }}
        />
      </div>
      <div className="scratch-actions">
        <span aria-live="polite">
          {revealed
            ? "That’s the part I love building."
            : "A little curiosity goes a long way."}
        </span>
        {revealed ? (
          <button
            type="button"
            onClick={() => {
              setRevealed(false);
              visited.current.clear();
              onProgress(0);
              setVersion((v) => v + 1);
            }}
          >
            Try again <RotateCcw size={15} />
          </button>
        ) : (
          <button type="button" onClick={reveal}>
            Reveal the logic <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
