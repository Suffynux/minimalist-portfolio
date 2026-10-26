import Link from "next/link";
import { site } from "@/lib/data";

export function Footer({border=false}:{border?:boolean}) {
  return <footer className={`studio-footer ${border?"footer-border":""}`}>
    <div className="studio-footer-top">
      <Link className="studio-footer-name" href="/">Sufiyan Ali<span>Good ideas deserve to be built.</span></Link>
      <nav className="studio-footer-nav" aria-label="Footer navigation">
        <Link href="/">The tour</Link><Link href="/projects">Selected work</Link><Link href="/journey">The human</Link>
        <Link href="/quotes">The quote wall</Link><Link href="/creatives">Playground</Link><Link href="/#contact">Get in touch</Link>
      </nav>
    </div>
    <div className="studio-footer-bottom"><span>© {new Date().getFullYear()} Sufiyan Ali / Suffynux</span><div><a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={site.upwork} target="_blank" rel="noreferrer">Upwork ↗</a></div><a href="#top">Back to top ↑</a></div>
  </footer>;
}
