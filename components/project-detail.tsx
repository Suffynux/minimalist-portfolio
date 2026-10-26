import { ProjectShowcase } from "@/components/project-showcase";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import {
  PortfolioPage,
  PageIntro,
  NextChapter,
} from "@/components/portfolio-page";
import { projectDetails, type DetailedProject } from "@/lib/data";
import { projectSlug } from "@/lib/portfolio-content";

export function ProjectDetail({ project }: { project: DetailedProject }) {
  const next =
    projectDetails[
      (projectDetails.indexOf(project) + 1) % projectDetails.length
    ];
  return (
    <PortfolioPage>
      <PageIntro
        eyebrow={`${project.no} / ${project.kind}`}
        title={
          <>
            {project.name}
            <br />
            <em>Behind the build.</em>
          </>
        }
      >
        {project.meta}
      </PageIntro>
      <section className="studio-section page-width project-detail-overview">
        <p className="eyebrow">THE PROJECT</p>
        <div>
          <p>{project.desc}</p>
          <a
            className="story-pill"
            style={{ marginTop: 30 }}
            href={project.live}
            target="_blank"
            rel="noreferrer"
          >
            {project.live.includes("github.com")
              ? "Explore the source"
              : project.status.includes("SIGN-IN")
                ? "Open workspace · sign-in"
                : "Visit the website"}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <div className="page-width">
        <ProjectShowcase project={project} />
        <section className="project-detail-facts" aria-label="Project facts">
          <div>
            <span>THE DISCIPLINE</span>
            <p>{project.kind}</p>
          </div>
          <div>
            <span>THE TOOLKIT</span>
            <p>{project.stack.join(" / ")}</p>
          </div>
          <div>
            <span>THE BUILD</span>
            <p>{project.name}</p>
            <Link
              href="/projects"
              className="text-link"
              style={{ marginTop: 15 }}
            >
              Back to all work <ArrowRight size={16} />
            </Link>
          </div>
        </section>
        <Link
          href={`/projects/${projectSlug(next.name)}`}
          className="project-next"
        >
          <span>Next up: {next.name}</span>
          <ArrowUpRight />
        </Link>
      </div>
      <NextChapter />
    </PortfolioPage>
  );
}
