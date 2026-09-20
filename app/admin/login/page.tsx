import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/shell";
import { isAdmin } from "@/lib/auth/admin";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false }
};

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <PageShell>
      <main className="relative z-10 mx-auto flex min-h-screen max-w-[480px] flex-col justify-center px-5 py-20 sm:px-8">
        <p className="mb-[18px] font-mono text-xs tracking-[0.14em] text-olive">ADMIN</p>
        <h1 className="mb-3 font-display text-[clamp(40px,7vw,64px)] font-normal leading-[0.95] tracking-[-0.02em]">
          Sign in.
        </h1>
        <p className="mb-10 text-[15.5px] leading-[1.6] text-body">
          Enter your email and I&apos;ll send a six-digit code.
        </p>
        <LoginForm />
      </main>
    </PageShell>
  );
}
