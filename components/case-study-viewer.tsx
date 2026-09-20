import Link from "next/link";
import { FileText } from "lucide-react";
import type { DetailedProject } from "@/lib/data";
import { getCaseStudyForProject } from "@/lib/case-studies";
import { Button } from "@/components/ui/button";

/**
 * The "read the case study" action on a project card.
 *
 * Projects with a written case study link to their own page. The rest render
 * nothing at all - an button that opened an empty "coming soon" panel was
 * worse than no button, because it promised detail that did not exist.
 */
export function CaseStudyViewer({ project }: { project: DetailedProject }) {
  const study = getCaseStudyForProject(project.name);

  if (!study) {
    return null;
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href={`/projects/${study.slug}`}>
        <FileText className="size-[15px]" /> Read case study
      </Link>
    </Button>
  );
}
