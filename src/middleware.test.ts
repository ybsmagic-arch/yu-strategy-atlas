// @vitest-environment node
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { middleware } from "./middleware";
import { AUTH_TIMEOUT_MS } from "./lib/supabase/auth-deadline";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { config } from "./middleware";

vi.mock("@supabase/ssr", () => ({ createServerClient: vi.fn() }));
const getUser = vi.fn();
const request = (path: string) => new NextRequest("https://atlas.test" + path);
beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://auth.test");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-key");
  vi.mocked(createServerClient).mockReturnValue({ auth: { getUser } } as never);
  getUser.mockResolvedValue({ data: { user: null }, error: null });
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.clearAllMocks(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

it.each(["/admin/login", "/admin/login/", "/api/ingest/daily-research", "/api/import/strategy-case"])("bypasses auth for %s", async path => {
  expect((await middleware(request(path))).status).toBe(200);
  expect(createServerClient).not.toHaveBeenCalled();
});
it("fails closed and ends at the login page without a loop", async () => {
  const denied = await middleware(request("/"));
  expect(denied.status).toBe(307);
  const location = new URL(denied.headers.get("location")!);
  expect(location.pathname).toBe("/admin/login");
  expect((await middleware(request(location.pathname + location.search))).status).toBe(200);
  expect(getUser).toHaveBeenCalledTimes(1);
});
it("preserves authenticated access", async () => {
  getUser.mockResolvedValue({ data: { user: { id: "user" } }, error: null });
  expect((await middleware(request("/admin"))).status).toBe(200);
});
it.each([new Error("fetch failed"), new Error("unknown")])("fails closed on rejection", async error => {
  getUser.mockRejectedValue(error);
  expect((await middleware(request("/admin"))).status).toBe(307);
});
it("does not trust a user returned alongside an auth error", async () => {
  getUser.mockResolvedValue({ data: { user: { id: "user" } }, error: new Error("auth error") });
  expect((await middleware(request("/admin"))).status).toBe(307);
});
it("cancels hanging fetch and bounds SDK retries/unfinished work to the total deadline", async () => {
  vi.useFakeTimers();
  let signal: AbortSignal | undefined;
  vi.stubGlobal("fetch", vi.fn((_input, init) => {
    signal = init.signal;
    return new Promise(() => {}); // Even an uncooperative transport cannot hold middleware open.
  }));
  vi.mocked(createServerClient).mockImplementation((_url, _key, options) => ({
    auth: { getUser: () => options!.global!.fetch!("https://auth.test/auth/v1/user") },
  }) as never);
  const result = middleware(request("/"));
  await vi.advanceTimersByTimeAsync(AUTH_TIMEOUT_MS - 1);
  expect(signal?.aborted).toBe(false);
  await vi.advanceTimersByTimeAsync(1);
  expect((await result).status).toBe(307);
  expect(signal?.aborted).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});
it("overwrites a spoofed display hint without bypassing protected auth", async () => {
  const req = new NextRequest("https://atlas.test/admin", { headers: { "x-atlas-login-page": "true" } });
  expect((await middleware(req)).status).toBe(307);
  expect(getUser).toHaveBeenCalledOnce();
});
it.each(["/_next/static/chunks/app.js", "/_next/image?url=test", "/favicon.ico", "/yu-tcm-logo.png"])("keeps existing static exclusion: %s", path => {
  expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: "https://atlas.test" + path })).toBe(false);
});
it("preserves refreshed cookies on authenticated responses and denial redirects", async () => {
  for (const user of [{ id: "user" }, null]) {
    vi.mocked(createServerClient).mockImplementation((_url, _key, options) => ({
      auth: { getUser: async () => {
        options!.cookies!.setAll!([{ name: "session-test", value: "refreshed", options: { httpOnly: true, path: "/" } }]);
        return { data: { user }, error: null };
      } },
    }) as never);
    const response = await middleware(request("/admin"));
    expect(response.status).toBe(user ? 200 : 307);
    expect(response.cookies.get("session-test")?.value).toBe("refreshed");
    if (user) expect(response.headers.get("x-middleware-request-cookie")).toContain("session-test=refreshed");
  }
});
