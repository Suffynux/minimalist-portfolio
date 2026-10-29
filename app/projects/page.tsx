import type {Metadata} from "next";
import {EditorialShell} from "@/components/editorial-shell";
import {journeyProjects} from "@/lib/project-journey";
import {ProjectFilters} from "@/components/project-filters";
export const metadata: Metadata = {
  title: "Projects — Dashboards, Websites & AI",
  description:
    "Explore Sufiyan Ali’s full-stack platforms, AI tools, learning products and storefronts. The thinking and the working software.",
  alternates: { canonical: "/projects" },
};
export default function ProjectsPage(){return <EditorialShell className="editorial-collection"><header className="ed-collection-hero"><p className="editorial-eyebrow">THE COLLECTION / WEBSITES, SYSTEMS & TOOLS</p><h1>BUILT TO<br/>DO SOMETHING.</h1><p>Explore the problem, the product and the work behind it.</p></header><ProjectFilters projects={journeyProjects}/></EditorialShell>}
