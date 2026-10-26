import Link from "next/link";
import { PortfolioPage, PageIntro } from "@/components/portfolio-page";
import { ArrowUpRight } from "lucide-react";
export default function NotFound(){return <PortfolioPage><PageIntro eyebrow="404 / A SMALL DETOUR" title={<>This way?<br/><em>Not quite.</em></>}>That page might have moved, or the link has taken a wrong turn. There’s still plenty to explore.</PageIntro><div className="page-width studio-section flex flex-wrap gap-4"><Link href="/" className="story-pill">Back to the tour <ArrowUpRight size={17}/></Link><Link href="/projects" className="story-pill">Explore the work <ArrowUpRight size={17}/></Link></div></PortfolioPage>}
