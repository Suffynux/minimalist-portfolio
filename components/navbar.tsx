"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { label: "Work", href: "/#work" },
  { label: "Expertise", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Playground", href: "/creatives" },
];
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById("nav-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <nav className="page-width nav-inner" aria-label="Main navigation">
          <Link href="/" className="brand" aria-label="Suffynux home">
            <span className="brand-mark" aria-hidden="true">
              [s]
            </span>
            <span>
              suffynux<span className="brand-dot">.</span>
              <small>SUFIYAN ALI / DEVELOPER</small>
            </span>
          </Link>
          <div className="desktop-links">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <a className="nav-contact" href="/#contact">
            Let’s talk <ArrowUpRight size={16} />
          </a>
          <button
            id="nav-toggle"
            className="nav-toggle"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
        {open && (
          <div className="mobile-menu" id="mobile-menu">
            {[
              ...links,
              { label: "All projects", href: "/projects" },
              { label: "The wall", href: "/quotes" },
              { label: "Journey", href: "/journey" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
                <ArrowUpRight size={18} />
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
