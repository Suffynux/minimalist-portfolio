import { cn } from "@/lib/utils";

export function TagList({
  tags,
  dark = false,
  className
}: {
  tags: string[];
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "rounded-full border px-[11px] py-[5px] font-mono text-[11px]",
            dark ? "border-bone/20 text-[#D6D6CB]" : "border-ink/[0.14] text-body"
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
