import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { withAuthDeadline } from "@/lib/supabase/auth-deadline";
import { recordTiming, roundDuration, timingDiagnosticsEnabled } from "@/lib/timing-diagnostics";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

const PUBLIC_PATHS = [
  "/admin/login",
  "/api/ingest/daily-research",
  "/api/import/strategy-case",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const headers = new Headers(request.headers);
  // Display hint only; never used to authorize access. Overwrite client input.
  headers.set("x-atlas-login-page", String(pathname === "/admin/login" || pathname.startsWith("/admin/login/")));
  const next = () => NextResponse.next({ request: { headers } });
  let response = next();
  if (isPublicPath(pathname)) return response;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "?error=config";
    return NextResponse.redirect(loginUrl);
  }

  let user = null;
  const authStartedAt = performance.now();
  try {
    user = await withAuthDeadline(async (fetcher, signal) => {
      const supabase = createServerClient(url, key, {
        global: { fetch: fetcher },
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(values: CookieToSet[]) {
            if (signal.aborted) return;
            values.forEach(({ name, value }) => request.cookies.set(name, value));
            headers.set("cookie", request.cookies.toString());
            response = next();
            values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      });

      const { data, error } = await supabase.auth.getUser();
      return error ? null : data.user;
    });
  } catch {
    // Network failures, deadlines and unexpected errors must fail closed.
    user = null;
  }
  const authDuration = performance.now() - authStartedAt;

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    const redirect = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie));
    return redirect;
  }

  if (timingDiagnosticsEnabled()) {
    recordTiming("middleware_auth", authDuration);
    response.headers.append("Server-Timing", `ymos_mw_auth;dur=${roundDuration(authDuration)}`);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|yu-tcm-logo.png).*)"],
};
