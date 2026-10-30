import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { projectDetails } from "@/lib/data";
import { projectSlug } from "@/lib/portfolio-content";
export default function sitemap():MetadataRoute.Sitemap {
  const base=SITE_URL;
  return ["","/projects","/journey","/creatives","/quotes",...projectDetails.map(p=>`/projects/${projectSlug(p.name)}`)].map(path=>({url:base+path,changeFrequency:path==="/quotes"?"weekly":"monthly",priority:path===""?1:path==="/projects"?.9:.7}));
}
