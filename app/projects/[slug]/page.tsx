import { pageMetadata } from "@/lib/seo";
import {EditorialCaseStudy} from "@/components/editorial-case-study";
import {projectDetails} from "@/lib/data";
import {projectSlug} from "@/lib/portfolio-content";
import {getCaseStudy} from "@/lib/case-studies";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projectDetails.map((project) => ({ slug: projectSlug(project.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectDetails.find(item => projectSlug(item.name) === slug);
  if (!project) notFound();
  const study = getCaseStudy(slug);
  return pageMetadata({
    title: `${study?.project ?? project.name}: Project Case Study`,
    description: study?.lede ?? project.desc,
    path: `/projects/${slug}`,
  });
}

export default async function CaseStudyPage({params}:{params:Promise<Params>}) {
 const {slug}=await params;
 const project=projectDetails.find(p=>projectSlug(p.name)===slug);
 if(!project)notFound();
 return <EditorialCaseStudy project={project}/>;
}
