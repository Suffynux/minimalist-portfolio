import { PageShell } from "@/components/shell";
import { getSessionEmail } from "@/lib/auth/admin";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const email = await getSessionEmail();

  return (
    <PageShell>
      <main className="relative z-10 mx-auto max-w-[1200px] px-5 py-[120px] sm:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-[18px] font-mono text-xs tracking-[0.14em] text-olive">ADMIN</p>
            <h1 className="font-display text-[clamp(40px,7vw,72px)] font-normal leading-[0.95] tracking-[-0.02em]">
              The wall.
            </h1>
            {email ? <p className="mt-3 font-mono text-[12px] text-meta">{email}</p> : null}
          </div>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>

        <p className="text-[15.5px] leading-[1.6] text-body">
          Quote management lands here next.
        </p>
      </main>
    </PageShell>
  );
}
