// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Header } from "./header";
import LoginPage from "@/app/admin/login/page";
import { AUTH_TIMEOUT_MS } from "@/lib/supabase/auth-deadline";
vi.mock("next/headers", () => ({ headers: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/app/admin/actions", () => ({ signIn: vi.fn(), signOut: vi.fn() }));
afterEach(() => { vi.clearAllMocks(); vi.useRealTimers(); });
it("renders the login page and shared Header without any Supabase client", async () => {
  vi.mocked(headers).mockResolvedValue(new Headers({ "x-atlas-login-page": "true" }) as never);
  expect(await LoginPage({ searchParams: Promise.resolve({}) })).toBeTruthy();
  expect(await Header()).toBeTruthy();
  expect(createClient).not.toHaveBeenCalled();
});
it("bounds Header auth work on other pages", async () => {
  vi.useFakeTimers();
  vi.mocked(headers).mockResolvedValue(new Headers() as never);
  vi.mocked(createClient).mockResolvedValue({ auth: { getUser: () => new Promise(() => {}) } } as never);
  const result = Header();
  await vi.advanceTimersByTimeAsync(AUTH_TIMEOUT_MS);
  expect(await result).toBeTruthy();
  expect(vi.getTimerCount()).toBe(0);
});
