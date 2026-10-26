import type { MetadataRoute } from "next";
import { projectDetails } from "@/lib/data";
import { projectSlug } from "@/lib/portfolio-content";
export default function sitemap():MetadataRoute.Sitemap {
  const base="https://www.suffynux.com";
  return ["","/projects","/journey","/creatives","/quotes",...projectDetails.map(p=>`/projects/${projectSlug(p.name)}`)].map(path=>({url:base+path,lastModified:new Date("2026-10-26"),changeFrequency:path==="/quotes"?"weekly":"monthly",priority:path===""?1:path==="/projects"?.9:.7}));
}
