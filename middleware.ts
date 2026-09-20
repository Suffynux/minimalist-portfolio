import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the admin's Supabase session cookie on each request.
 *
 * Must be named `middleware.ts` exporting `middleware`: Supabase's current
 * example uses `proxy.ts`, which is Next.js 16 only. On Next 15 that file is
 * never called, so sessions silently stop refreshing and the admin gets
 * logged out at random.
 *
 * Nothing may run between createServerClient() and getClaims(), and the
 * response object must be returned as-is - rebuilding it drops the refreshed
 * cookies.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        }
      }
    }
  );

  // getClaims() verifies the JWT signature locally against a cached JWKS.
  // getSession() is unsafe server-side (trusts the cookie unverified) and
  // getUser() costs a network round-trip.
  await supabase.auth.getClaims();

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and images - those never need a session.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
