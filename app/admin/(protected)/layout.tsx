import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false }
};

/**
 * Gate for the admin pages. The login route sits outside this group, so
 * there's no redirect loop.
 *
 * This is a convenience redirect, not the security boundary - RLS policies
 * calling is_admin() are what actually protect the data. A bug here would
 * show an empty panel, not leak rows.
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");

  return <>{children}</>;
}
