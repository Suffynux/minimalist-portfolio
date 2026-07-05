import { NextRequest, NextResponse } from "next/server";
import { featuredProject, projects } from "@/lib/data";

const allowedUrls = new Set<string>([featuredProject.href, ...projects.map((p) => p.href)]);

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url") ?? "";
  if (!allowedUrls.has(url)) {
    return NextResponse.json({ embeddable: false, reason: "unknown-url" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": BROWSER_UA, accept: "text/html" },
      signal: AbortSignal.timeout(8000)
    });

    const xfo = (res.headers.get("x-frame-options") ?? "").toLowerCase();
    const csp = (res.headers.get("content-security-policy") ?? "").toLowerCase();
    const frameAncestors = csp.match(/frame-ancestors\s+([^;]+)/)?.[1]?.trim();

    let embeddable = res.ok;
    if (frameAncestors) {
      // CSP frame-ancestors overrides X-Frame-Options in modern browsers
      if (frameAncestors === "'none'" || frameAncestors === "'self'") embeddable = false;
    } else if (xfo.includes("deny") || xfo.includes("sameorigin")) {
      embeddable = false;
    }

    return NextResponse.json({ embeddable });
  } catch {
    return NextResponse.json({ embeddable: false, reason: "unreachable" });
  }
}
