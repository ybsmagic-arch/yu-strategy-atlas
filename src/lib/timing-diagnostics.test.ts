import { afterEach, expect, it, vi } from "vitest";
import { measureTiming, recordTiming, timingDiagnosticsEnabled } from "./timing-diagnostics";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

it("stays disabled unless both preview and the deployment-only flag are present", () => {
  vi.stubEnv("VERCEL_ENV", "preview");
  expect(timingDiagnosticsEnabled()).toBe(false);
  vi.stubEnv("YMOS_TIMING_DIAGNOSTICS", "1");
  expect(timingDiagnosticsEnabled()).toBe(true);
});

it("records only a metric name and rounded duration", () => {
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("YMOS_TIMING_DIAGNOSTICS", "1");
  const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
  recordTiming("app_auth", 12.345);
  expect(JSON.parse(String(info.mock.calls[0][0]))).toEqual({
    event: "ymos_timing",
    metric: "app_auth",
    duration_ms: 12.3,
  });
});

it("preserves task results while measuring", async () => {
  const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
  expect(await measureTiming("sites_registry_query", async () => "ok")).toBe("ok");
  expect(info).not.toHaveBeenCalled();
});
