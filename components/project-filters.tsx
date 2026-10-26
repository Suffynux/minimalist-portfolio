"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { projectSlug } from "@/lib/portfolio-content";
import { type DetailedProject } from "@/lib/data";
const categories = [
  { label: "All work", value: "All" },
  { label: "Full-stack", value: "MERN" },
  { label: "AI & SaaS", value: "SaaS / AI" },
  { label: "Commerce", value: "Shopify" },
  { label: "Websites", value: "Corporate" },
];
export function ProjectFilters({ projects }: { projects: DetailedProject[] }) {
  const [active, setActive] = useState("All");
  const visible = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((project) => project.category === active),
    [projects, active],
  );
  return (
    <div className="page-width project-index">
      <div className="project-filter-bar">
        <div role="group" aria-label="Filter projects by type">
          {categories.map((category) => (
            <button
              type="button"
              key={category.value}
              aria-pressed={active === category.value}
              onClick={() => setActive(category.value)}
            >
              {category.label}
              <span>
                {category.value === "All"
                  ? projects.length
                  : projects.filter((p) => p.category === category.value)
                      .length}
              </span>
            </button>
          ))}
        </div>
        <span aria-live="polite">
          {visible.length} PROJECT{visible.length !== 1 ? "S" : ""}
        </span>
      </div>
      <div className="project-index-list">
        {visible.map((project) => (
          <article className="index-project" key={project.no}>
            <div
              className={`index-visual index-visual-${project.category.replace(/[^a-z]/gi, "").toLowerCase()}`}
            >
              <span className="index-visual-no">
                [ {project.no} / {project.kind} ]
              </span>
              {project.name === "CEGA" ? (
                <Image
                  src="/case-studies/cega/training-overview.png"
                  alt="CEGA training platform"
                  width={1000}
                  height={700}
                  sizes="(max-width: 760px) 90vw, 45vw"
                />
              ) : (
                <div className="index-wordmark" aria-hidden="true">
                  {project.name === "AI Chat Agent" ? (
                    <>
                      <pre>{`  . : + * + : .
: + # @ @ @ # + :
+ @ @ : : : @ @ +
: + # @ @ @ # + :
  ' : + * + : '`}</pre>
                      <small>AI CHAT AGENT</small>
                    </>
                  ) : project.name === "Deeniverse" ? (
                    <>
                      d.<small>DEENIVERSE</small>
                    </>
                  ) : project.name === "Gomila Intersole" ? (
                    <>
                      Gomila<small>INTERSOLE / COMMERCE</small>
                    </>
                  ) : (
                    <>
                      nextgrid<span className="brand-dot">_</span>
                      <small>IT / UNITED KINGDOM</small>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="index-project-copy">
              <p className="eyebrow">
                {project.kind} / {project.no}
              </p>
              <h2>{project.name}</h2>
              <p>{project.desc}</p>
              <div className="work-tags">
                {project.stack.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="index-project-links">
                {(
                  <Link href={`/projects/${projectSlug(project.name)}`} className="text-link">
                    Explore project <ArrowRight size={16} />
                  </Link>
                )}
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  {project.live.includes("github.com")
                    ? "View source"
                    : "Visit website"}
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
