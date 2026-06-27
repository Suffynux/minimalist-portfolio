export function Marquee({ text }: { text: string }) {
  return (
    <div className="relative z-10 overflow-hidden whitespace-nowrap border-y border-ink/10 py-[22px]">
      <div className="inline-flex animate-marquee will-change-transform">
        <span className="font-display text-[30px] italic text-ink">{text}</span>
        <span className="font-display text-[30px] italic text-ink">{text}</span>
      </div>
    </div>
  );
}
