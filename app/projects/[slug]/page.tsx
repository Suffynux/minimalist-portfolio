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
  const study = getCaseStudy(slug);

  if (!study) {
    const project = projectDetails.find(
      (item) => projectSlug(item.name) === slug,
    );
    return project
      ? {
          title: `${project.name} — Project`,
          description: project.desc,
          alternates: { canonical: `/projects/${slug}` },
        }
      : { title: "Project not found" };
  }

  return {
    title: `${study.project} Case Study`,
    description: study.lede,
    alternates: { canonical: `/projects/${study.slug}` },
    openGraph: {
      title: `${study.project} - ${study.title}`,
      description: study.lede,
      url: `https://www.suffynux.com/projects/${study.slug}`,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({params}:{params:Promise<Params>}) {
 const {slug}=await params;
 const project=projectDetails.find(p=>projectSlug(p.name)===slug);
 if(!project)notFound();
 return <EditorialCaseStudy project={project}/>;
}
