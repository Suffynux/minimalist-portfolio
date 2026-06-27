"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/lib/data";
import { Reveal } from "@/components/reveal";
import { TagList } from "@/components/tag-list";

export function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <Reveal>
      <motion.a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35 }}
        className="mb-5 block overflow-hidden rounded-[22px] bg-ink text-bone"
      >
        <div className="grid min-h-[400px] grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col justify-between gap-[30px] p-8 sm:p-11">
            <div className="flex items-center justify-between gap-4 font-mono text-xs text-[#9A9A8C]">
              <span>FEATURED PROJECT</span>
              <span className="inline-flex items-center gap-[7px] text-olive">
                <span className="size-[7px] rounded-full bg-olive" />
                {project.status}
              </span>
            </div>
            <div>
              <h3 className="mb-1 font-display text-[clamp(40px,5vw,62px)] font-normal leading-none tracking-[-0.01em]">
                {project.name}
              </h3>
              <p className="mb-[22px] font-mono text-[12.5px] text-[#9A9A8C]">{project.meta}</p>
              <p className="max-w-[440px] text-base leading-[1.62] text-[#D6D6CB]">{project.desc}</p>
            </div>
            <TagList tags={project.stack} dark />
          </div>
          <div className="relative min-h-[300px] overflow-hidden bg-[#14150E]">
            <Image src={project.img} alt={project.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover opacity-[0.82]" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,#23251D_0%,transparent_45%)]" />
          </div>
        </div>
      </motion.a>
    </Reveal>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Reveal>
      <motion.a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="flex h-full flex-col overflow-hidden rounded-[18px] border border-ink/[0.09] bg-surface transition hover:border-olive/40 hover:shadow-[0_24px_50px_-28px_rgba(35,37,29,0.3)]"
      >
        <div className="relative h-[170px] overflow-hidden bg-[#E7E6DD]">
          <Image src={project.img} alt={project.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-1 flex-col gap-[13px] px-[26px] pb-[30px] pt-[26px]">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-[25px] font-normal tracking-[-0.01em]">{project.name}</h3>
            <span className="whitespace-nowrap rounded-full border border-olive/30 px-[9px] py-[3px] font-mono text-[10.5px] tracking-[0.06em] text-olive">
              {project.status}
            </span>
          </div>
          <p className="-mt-1 font-mono text-[11.5px] text-[#9A9A8C]">{project.meta}</p>
          <p className="flex-1 text-sm leading-[1.6] text-[#4F5246]">{project.desc}</p>
          <TagList tags={project.stack} />
        </div>
      </motion.a>
    </Reveal>
  );
}
