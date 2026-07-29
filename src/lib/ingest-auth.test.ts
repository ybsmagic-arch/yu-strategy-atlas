import { describe, expect, it } from "vitest";
import { isValidIngestToken } from "./ingest-auth";

describe("isValidIngestToken", () => {
  it("accepts an exact bearer token", () => expect(isValidIngestToken("Bearer daily-secret", "daily-secret")).toBe(true));
  it("rejects missing or incorrect tokens", () => {
    expect(isValidIngestToken(null, "daily-secret")).toBe(false);
    expect(isValidIngestToken("Bearer wrong", "daily-secret")).toBe(false);
  });
});
