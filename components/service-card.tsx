"use client";

import { motion } from "framer-motion";
import type { Service } from "@/lib/data";
import { Reveal } from "@/components/reveal";
import { TagList } from "@/components/tag-list";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Reveal>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="flex min-h-[340px] flex-col gap-[18px] rounded-[18px] border border-ink/[0.09] bg-surface px-8 py-9 shadow-none transition hover:border-olive/40 hover:shadow-[0_24px_50px_-28px_rgba(35,37,29,0.32)]"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-[#9A9A8C]">{service.no}</span>
          <span className="font-display text-[26px] italic text-olive">{service.tag}</span>
        </div>
        <h3 className="mt-1 font-display text-[30px] font-normal leading-[1.08] tracking-[-0.01em]">{service.title}</h3>
        <p className="flex-1 text-[15px] leading-[1.62] text-[#4F5246]">{service.desc}</p>
        <TagList tags={service.stack} className="mt-1" />
      </motion.div>
    </Reveal>
  );
}
