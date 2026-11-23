// @vitest-environment node
import { createServerClient } from "@supabase/ssr";
import { afterEach, expect, it, vi } from "vitest";
import { AUTH_TIMEOUT_MS, withAuthDeadline } from "./auth-deadline";

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
it.each([false, true])("bounds the real SDK with expired session=%s", async expired => {
  vi.useFakeTimers();
  const expires = Math.floor(Date.now() / 1000) + (expired ? -3600 : 3600);
  const jwt = [
    Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url"),
    Buffer.from(JSON.stringify({ sub: "00000000-0000-0000-0000-000000000001", exp: expires })).toString("base64url"),
    "test-signature",
  ].join(".");
  const value = "base64-" + Buffer.from(JSON.stringify({
    access_token: jwt, refresh_token: "test-refresh", expires_at: expires,
    token_type: "bearer", user: { id: "00000000-0000-0000-0000-000000000001" },
  })).toString("base64url");
  let signal: AbortSignal | undefined;
  const transport = vi.fn((_input, init) => {
    signal = init.signal;
    return new Promise<Response>(() => {});
  });
  vi.stubGlobal("fetch", transport);
  const result = withAuthDeadline(async fetcher => {
    const client = createServerClient("https://deadline-test.supabase.co", "test-key", {
      global: { fetch: fetcher },
      cookies: { getAll: () => [{ name: "sb-deadline-test-auth-token", value }], setAll: () => {} },
    });
    return client.auth.getUser();
  });
  const rejected = expect(result).rejects.toThrow("Auth deadline exceeded");
  await vi.advanceTimersByTimeAsync(AUTH_TIMEOUT_MS);
  await rejected;
  expect(transport).toHaveBeenCalledOnce();
  expect(String(transport.mock.calls[0][0])).toContain(expired ? "/token" : "/user");
  expect(signal?.aborted).toBe(true);
});
