import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {journeyProjects} from "@/lib/project-journey";
import {projectSlug} from "@/lib/portfolio-content";
export function NextProject({name}:{name:string}){const index=journeyProjects.findIndex(p=>p.name===name);const next=journeyProjects[(index+1)%journeyProjects.length];return <section className="next-project-invitation page-width"><p className="client-kicker">YOU’VE SEEN THE BUILD / CONTINUE THE COLLECTION</p><Link href={`/projects/${projectSlug(next.name)}`}><h2>Next project.<br/><em>{next.name}</em></h2><ArrowUpRight size={48}/></Link><Link className="client-text-link" href={`/?project=${projectSlug(next.name)}#work`}>Read it in the project carousel <ArrowUpRight size={16}/></Link></section>}
