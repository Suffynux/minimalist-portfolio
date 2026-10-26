import type { Metadata } from "next";
import { PortfolioPage, PageIntro, NextChapter } from "@/components/portfolio-page";
import { ProjectFilters } from "@/components/project-filters";
import { projectDetails } from "@/lib/data";

export const metadata: Metadata = {
  title:"Selected Work — Full-Stack, AI & Web",
  description:"Explore Sufiyan Ali’s full-stack platforms, AI tools, learning products and storefronts. The thinking and the working software.",
  alternates:{canonical:"/projects"},
};
export default function ProjectsPage() {
  return <PortfolioPage>
    <PageIntro eyebrow="02 / SELECTED WORK" title={<>From “what if”<br/><em>to out in the world.</em></>}>Platforms, storefronts and useful AI. Different businesses, different problems, and ownership of the whole build.</PageIntro>
    <section className="studio-section" aria-label="Project collection"><ProjectFilters projects={projectDetails}/></section>
    <NextChapter/>
  </PortfolioPage>;
}
