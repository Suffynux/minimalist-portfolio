import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ProjectFilters } from "@/components/project-filters";
import { projectDetails } from "@/lib/data";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export const metadata: Metadata = {
  title: "Selected Work — Full-Stack, AI & Web",
  description:
    "Full-stack platforms, AI tools, learning products and storefronts built by Sufiyan Ali. Explore the thinking and the working software.",
  alternates: { canonical: "/projects" },
  openGraph: {
    url: "https://www.suffynux.com/projects",
    siteName: "Suffynux",
    type: "website",
    images: [{ url: "/og-ascii.png", width: 1200, height: 630, alt: "Sufiyan Ali — Full-Stack Developer & AI Builder" }],
  },
};
export default function ProjectsPage() {
  return (
    <div className="portfolio-site" id="top">
      <Navbar />
      <main id="main-content">
        <header className="index-header page-width">
          <p className="eyebrow">THE WORK / FROM IDEA TO PRODUCTION</p>
          <h1>
            Built to be
            <br />
            <span className="serif-word">used.</span>
          </h1>
          <p>
            Different businesses. Different problems.
            <br />
            The same commitment to building the whole thing properly.
          </p>
        </header>
        <ProjectFilters projects={projectDetails} />
        <section className="page-width index-cta">
          <p className="eyebrow">YOUR PROJECT COULD BE NEXT</p>
          <Link href="/#contact">
            Let’s build something useful.
            <ArrowUpRight />
          </Link>
        </section>
        <div className="page-width inner-footer">
          <Footer />
        </div>
      </main>
    </div>
  );
}
