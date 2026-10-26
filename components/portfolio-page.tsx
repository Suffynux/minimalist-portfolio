import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function PortfolioPage({children,className=""}:{children:React.ReactNode;className?:string}) {
  return <div className={`studio-page ${className}`} id="top"><Navbar/><main id="main-content">{children}</main><div className="page-width"><Footer/></div></div>;
}
export function PageIntro({eyebrow,title,children}:{eyebrow:string;title:React.ReactNode;children:React.ReactNode}) {
  return <header className="studio-hero page-width"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{children}</p></header>;
}
export function NextChapter({eyebrow="YOUR NEXT CHAPTER",title=<>Let’s make<br/><em>something useful.</em></>,href="/#contact",label="Tell me your idea"}:{eyebrow?:string;title?:React.ReactNode;href?:string;label?:string}) {
  return <section className="studio-cta page-width"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><Link href={href} className="story-pill">{label}<ArrowUpRight size={18}/></Link></section>;
}
