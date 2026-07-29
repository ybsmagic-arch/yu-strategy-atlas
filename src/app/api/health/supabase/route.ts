import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const report: Record<string, unknown> = {
    configured: Boolean(url && key),
    url,
    urlLength: url.length,
    keyPrefix: key.slice(0, 15),
    keyLength: key.length,
  };
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/health`, {
      headers: { apikey: key }, cache: "no-store",
    });
    report.status = response.status;
    report.reachable = response.ok;
  } catch (error) {
    report.reachable = false;
    report.error = error instanceof Error ? error.message : "Unknown fetch error";
    report.cause = error instanceof Error && error.cause instanceof Error ? error.cause.message : undefined;
  }
  return NextResponse.json(report, { status: report.reachable ? 200 : 503 });
}
