"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PageShell } from "@/components/shell";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell>
      <main className="relative z-10 mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center px-5 py-[110px] sm:px-8">
        <p className="mb-[22px] font-mono text-xs tracking-[0.14em] text-olive">SOMETHING BROKE</p>
        <h1 className="max-w-[820px] font-display text-[clamp(44px,7vw,96px)] font-normal leading-[0.94] tracking-[-0.02em]">
          This page hit an <span className="italic text-olive">error</span>.
        </h1>
        <p className="mt-8 max-w-[540px] text-lg leading-[1.6] text-body">
          Sorry about that - it&apos;s on my end, not yours. Try again, or head back home.
        </p>
        <div className="mt-10 flex flex-wrap gap-2.5">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </main>
    </PageShell>
  );
}
