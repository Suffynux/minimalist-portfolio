import { pageMetadata } from "@/lib/seo";
import {EditorialShell} from "@/components/editorial-shell";
import {journeyProjects} from "@/lib/project-journey";
import {ProjectFilters} from "@/components/project-filters";
export const metadata = pageMetadata({ title: "Projects: Websites, Business Apps & AI", description: "Explore Sufiyan Ali’s websites, business applications, e-commerce platforms and AI tools, with case studies explaining the problems and solutions.", path: "/projects" });
export default function ProjectsPage(){return <EditorialShell className="editorial-collection"><header className="ed-collection-hero"><p className="editorial-eyebrow">THE COLLECTION / WEBSITES, SYSTEMS & TOOLS</p><h1>BUILT TO<br/>DO SOMETHING.</h1><p>Explore the problem, the product and the work behind it.</p></header><ProjectFilters projects={journeyProjects}/></EditorialShell>}
