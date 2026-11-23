export type TimingMetric = "app_auth" | "middleware_auth" | "research_counts_query" | "sites_registry_query";

export function timingDiagnosticsEnabled() {
  return process.env.VERCEL_ENV === "preview" && process.env.YMOS_TIMING_DIAGNOSTICS === "1";
}

export function roundDuration(durationMs: number) {
  return Math.round(durationMs * 10) / 10;
}

export function recordTiming(metric: TimingMetric, durationMs: number) {
  if (!timingDiagnosticsEnabled()) return;
  console.info(JSON.stringify({ event: "ymos_timing", metric, duration_ms: roundDuration(durationMs) }));
}

export async function measureTiming<T>(metric: TimingMetric, task: () => Promise<T>): Promise<T> {
  const startedAt = performance.now();
  try {
    return await task();
  } finally {
    recordTiming(metric, performance.now() - startedAt);
  }
}
