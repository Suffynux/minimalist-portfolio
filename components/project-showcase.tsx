"use client";
import { useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Database, Layers, Workflow } from "lucide-react";
import type { DetailedProject } from "@/lib/data";
import { projectShowcases, type ProjectModule } from "@/lib/project-showcase";
import { projectSlug } from "@/lib/portfolio-content";

export function ProjectShowcase({ project }: { project: DetailedProject }) {
  const slug = projectSlug(project.name);
  const data = projectShowcases[slug];
  const screens =
    data?.screens ??
    (project.img
      ? [
          {
            title: project.name,
            image: project.img,
            description:
              "Screenshot of the public website, captured in October 2026.",
            href: project.live,
            snapshot: false,
          },
        ]
      : []);
  const tabs = [
    ...(screens.length ? [{ key: "screens", label: "Screens" }] : []),
    ...(data?.modules?.length ? [{ key: "modules", label: "Modules" }] : []),
    ...(data?.reports?.length
      ? [{ key: "analytics", label: "Analytics" }]
      : []),
    ...(data?.jobs?.length ? [{ key: "jobs", label: "Background jobs" }] : []),
    ...(data?.records?.length
      ? [{ key: "records", label: "Data & records" }]
      : []),
  ];
  const [active, setActive] = useState(tabs[0]?.key ?? "screens");
  const [shot, setShot] = useState(0);
  const [jobGroup, setJobGroup] = useState("All jobs");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  if (!tabs.length) return null;
  const current = screens[shot];
  const source = data?.source || project.source;
  function moduleCards(items: ProjectModule[]) {
    return (
      <div className="module-grid">
        {items.map((item, i) => (
          <a
            key={item.href}
            className="module-card"
            href={item.href}
            target="_blank"
            rel="noreferrer"
          >
            <span className="module-number">
              {String(i + 1).padStart(2, "0")} <ArrowUpRight size={18} />
            </span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <span className="module-access">
              Open workspace · sign-in required
            </span>
          </a>
        ))}
      </div>
    );
  }
  return (
    <section className="project-showcase" aria-labelledby={`${id}-title`}>
      <div className="showcase-heading">
        <div>
          <p className="eyebrow">A CLOSER LOOK</p>
          <h2 id={`${id}-title`}>
            {data?.modules ? "Beyond the homepage." : "See the build."}
          </h2>
        </div>
        {data?.modules && (
          <div className="showcase-counts">
            <span>
              <Layers size={16} />
              {data.modules.length} modules
            </span>
            {data.jobs && (
              <span>
                <Workflow size={16} />
                {data.jobs.length} featured jobs
              </span>
            )}
            <span>
              <Database size={16} />
              Connected records
            </span>
          </div>
        )}
      </div>
      <div
        className="showcase-tabs"
        role="tablist"
        aria-label={`${project.name} showcase`}
        onKeyDown={(event) => {
          const i = tabs.findIndex((tab) => tab.key === active);
          let next = i;
          if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
          else if (event.key === "ArrowLeft")
            next = (i - 1 + tabs.length) % tabs.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = tabs.length - 1;
          else return;
          event.preventDefault();
          setActive(tabs[next].key);
          tabRefs.current[next]?.focus();
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-${tab.key}`}
            aria-selected={active === tab.key}
            aria-controls={`${id}-panel`}
            tabIndex={active === tab.key ? 0 : -1}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className="showcase-panel"
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-${active}`}
        tabIndex={0}
      >
        {active === "screens" && current && (
          <div className="screen-gallery">
            <div
              className="screen-picker"
              role="group"
              aria-label="Choose a project screen"
            >
              {screens.map((screen, i) => (
                <button
                  type="button"
                  key={screen.title}
                  aria-pressed={i === shot}
                  onClick={() => setShot(i)}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {screen.title}
                </button>
              ))}
            </div>
            <figure>
              <a
                className="screen-image"
                href={current.image}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open full-size screenshot: ${current.title}`}
              >
                <Image
                  src={current.image}
                  alt={`${project.name} — ${current.title}`}
                  width={1440}
                  height={1000}
                  sizes="(max-width:760px) 90vw, 75vw"
                />
              </a>
              <figcaption>
                <div>
                  <span className="screen-caption-type">
                    {current.snapshot
                      ? "PUBLISHED CASE-STUDY SNAPSHOT"
                      : "PUBLIC WEBSITE CAPTURE"}
                  </span>
                  <h3>{current.title}</h3>
                  <p>{current.description}</p>
                </div>
                {current.href && (
                  <a
                    className="text-link"
                    href={current.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {current.href.includes("/admin/") ||
                    (slug === "gomila-oms" &&
                      new URL(current.href).pathname !== "/")
                      ? "Open screen · sign-in"
                      : "Visit page"}{" "}
                    <ArrowUpRight size={16} />
                  </a>
                )}
              </figcaption>
            </figure>
          </div>
        )}
        {active === "modules" && data?.modules && (
          <>
            <p className="showcase-note">
              Explore the connected workspaces. Each link opens the
              application’s own access-controlled screen.
            </p>
            {moduleCards(data.modules)}
          </>
        )}
        {active === "analytics" && data?.reports && (
          <>
            <p className="showcase-note">
              Dashboards and reports with their own scope, filters and records.
              Open a report with an authorised account.
            </p>
            {moduleCards(data.reports)}
          </>
        )}
        {active === "jobs" && data?.jobs && (
          <>
            <div className="jobs-intro">
              <div>
                <h3>The work that keeps running.</h3>
                <p>
                  Order sync, inventory updates, retries and alerts. This is an
                  implementation walkthrough; schedules describe the configured
                  jobs, not live execution status.
                </p>
              </div>
              <a
                className="text-link"
                href="https://www.gomilaoms.com/synchronization"
                target="_blank"
                rel="noreferrer"
              >
                Open synchronization · sign-in <ArrowUpRight size={16} />
              </a>
            </div>
            <div
              className="job-filters"
              role="group"
              aria-label="Filter background jobs"
            >
              {["All jobs", ...new Set(data.jobs.map((job) => job.group))].map(
                (group) => (
                  <button
                    type="button"
                    key={group}
                    aria-pressed={group === jobGroup}
                    onClick={() => setJobGroup(group)}
                  >
                    {group}
                  </button>
                ),
              )}
            </div>
            <div className="job-list">
              {data.jobs
                .filter(
                  (job) => jobGroup === "All jobs" || job.group === jobGroup,
                )
                .map((job) => (
                  <article key={job.title}>
                    <span className="job-icon">
                      <Workflow size={19} />
                    </span>
                    <div>
                      <h4>{job.title}</h4>
                      <p>{job.description}</p>
                    </div>
                    <span className="job-cadence">{job.cadence}</span>
                  </article>
                ))}
            </div>
            <div className="job-record">
              <span>EVERY RUN HAS A RECORD</span>
              <div>
                {[
                  "Job key",
                  "Status",
                  "Started",
                  "Finished",
                  "Summary",
                  "Error",
                ].map((field) => (
                  <code key={field}>{field}</code>
                ))}
              </div>
              <p>
                The synchronization workspace also separates reservations,
                inventory publishing, orders, shipments, webhooks, finance
                issues and exports into their own tabs.
              </p>
            </div>
          </>
        )}
        {active === "records" && data?.records && (
          <>
            <p className="showcase-note">
              The information model behind the interface. These are field
              descriptions, not customer or applicant records.
            </p>
            <div className="record-grid">
              {data.records.map((record) => (
                <article key={record.title}>
                  <Database size={21} />
                  <h3>{record.title}</h3>
                  <p>{record.purpose}</p>
                  <div>
                    {record.fields.map((field) => (
                      <span key={field}>{field}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
      {source && (
        <div className="showcase-source">
          <span>
            Public screenshots and source-verified feature descriptions.
          </span>
          <a href={source} target="_blank" rel="noreferrer">
            Published project on GitHub <ArrowUpRight size={14} />
          </a>
        </div>
      )}
    </section>
  );
}
