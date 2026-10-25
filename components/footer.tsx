import Link from "next/link";
import { site } from "@/lib/data";
export function Footer({ border = false }: { border?: boolean }) {
  return (
    <footer className={`site-footer ${border ? "footer-border" : ""}`}>
      <div>
        <Link className="footer-brand" href="/">
          suffynux.
        </Link>
        <span>© {new Date().getFullYear()} Sufiyan Ali</span>
      </div>
      <div className="footer-links">
        <a href={site.github} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <a href={site.linkedin} target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>
        <a href={site.upwork} target="_blank" rel="noreferrer">
          Upwork ↗
        </a>
        <Link href="/quotes">The wall ↗</Link>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
