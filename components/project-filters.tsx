"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Search } from "lucide-react";
import { projectSlug } from "@/lib/portfolio-content";
import { sourceProjects } from "@/lib/project-showcase";
import { type DetailedProject } from "@/lib/data";
const categories = [
  { label: "All work", value: "All" },
  { label: "Full-stack", value: "MERN" },
  { label: "AI & tools", value: "SaaS / AI" },
  { label: "Commerce", value: "Shopify" },
  { label: "Websites", value: "Corporate" },
];
export function ProjectFilters({ projects }: { projects: DetailedProject[] }) {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      projects.filter(
        (project) =>
          (active === "All" || project.category === active) &&
          [project.name, project.desc, ...project.stack]
            .join(" ")
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [projects, active, query],
  );
  return (
    <div className="page-width project-index expanded-project-index">
      <div className="project-search">
        <Search size={18} />
        <input
          type="search"
          aria-label="Search projects"
          placeholder="Find a website, dashboard, or technology…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
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
      <div className="catalog-grid">
        {visible.map((project) => (
          <article className="catalog-card" key={project.name}>
            <Link
              href={`/projects/${projectSlug(project.name)}`}
              className="catalog-cover"
              aria-label={`Explore ${project.name}`}
            >
              {project.img ? (
                <Image
                  src={project.img}
                  alt={`${project.name} project screenshot`}
                  width={1440}
                  height={1000}
                  sizes="(max-width:760px) 90vw, 45vw"
                />
              ) : (
                <div className="catalog-code" aria-hidden="true">
                  <pre>
                    {
                      "  . : + * + : .\n: + # @ @ @ # + :\n+ @ @ : : : @ @ +\n: + # @ @ @ # + :\n  . : + * + : ."
                    }
                  </pre>
                  <span>{project.name}</span>
                </div>
              )}
              <span className="catalog-status">{project.status}</span>
              <span className="catalog-arrow">
                <ArrowUpRight size={20} />
              </span>
            </Link>
            <div className="catalog-copy">
              <p className="eyebrow">
                {project.kind} / {project.no}
              </p>
              <h2>
                <Link href={`/projects/${projectSlug(project.name)}`}>
                  {project.name}
                </Link>
              </h2>
              <p>{project.desc}</p>
              <div className="work-tags">
                {project.stack.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="catalog-links">
                <Link
                  href={`/projects/${projectSlug(project.name)}`}
                  className="text-link"
                >
                  {["Gomila OMS", "CEGA"].includes(project.name)
                    ? "Explore screens & modules"
                    : "Explore project"}{" "}
                  <ArrowRight size={16} />
                </Link>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  {project.status === "SOURCE"
                    ? "Source"
                    : project.status === "PREVIEW"
                      ? "Preview"
                      : project.status.includes("SIGN-IN")
                        ? "Workspace · sign-in"
                        : "Live website"}{" "}
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="catalog-empty">
          <p>No projects match this search.</p>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setQuery("");
              setActive("All");
            }}
          >
            Show all projects <ArrowRight size={16} />
          </button>
        </div>
      )}
      <section className="source-archive" aria-labelledby="source-title">
        <div className="showcase-heading">
          <div>
            <p className="eyebrow">SMALLER BUILDS & EXPERIMENTS</p>
            <h2 id="source-title">More in the source.</h2>
          </div>
          <a
            href="https://github.com/Suffynux?tab=repositories"
            className="text-link"
            target="_blank"
            rel="noreferrer"
          >
            GitHub profile <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="source-grid">
          {sourceProjects.map((project) => (
            <a
              key={project.repo}
              href={`https://github.com/Suffynux/${project.repo}`}
              target="_blank"
              rel="noreferrer"
            >
              <h3>
                {project.name}
                <ArrowUpRight size={16} />
              </h3>
              <p>{project.description}</p>
              <span>View repository ↗</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
