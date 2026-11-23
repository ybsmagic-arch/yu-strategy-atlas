import { describe, expect, it } from "vitest";
import { parseList, parseSiteMetadata, serializeSiteMetadata, siteFormSchema, siteFormToRecord } from "./site-registry";

describe("site registry metadata", () => {
  it("round-trips controlled lifecycle and readable relations", () => {
    const encoded = serializeSiteMetadata({ lifecycle: "candidate", relations: ["余氏針灸學", "93 穴育苗園"], note: "隔離測試" });
    expect(parseSiteMetadata(encoded)).toEqual({ lifecycle: "candidate", relations: ["余氏針灸學", "93 穴育苗園"], note: "隔離測試" });
  });

  it("keeps legacy reference link notes backward compatible", () => {
    expect(parseSiteMetadata("既有好站備註，不是網站戶籍資料")).toBeNull();
    expect(parseSiteMetadata("YMOS_SITE_REGISTRY_V1\nnot-json")).toBeNull();
  });

  it("normalizes tag and relation lists", () => {
    expect(parseList("針灸、耳穴, 針灸\n經絡")).toEqual(["針灸", "耳穴", "經絡"]);
  });

  it("rejects missing or unsafe website URLs", () => {
    const base = { title: "測試站", description: "測試", category: "知識網站", tags: "", lifecycle: "idea", relations: "", note: "" };
    expect(siteFormSchema.safeParse({ ...base, url: "" }).success).toBe(false);
    expect(siteFormSchema.safeParse({ ...base, url: "http://example.com" }).success).toBe(false);
    expect(siteFormSchema.safeParse({ ...base, url: "https://example.com" }).success).toBe(true);
  });

  it("maps create and edit input without touching reference link status", () => {
    const record = siteFormToRecord({ title: "余氏針灸學", url: "https://acupuncture.yu-tcm.com/", description: "針灸教室", category: "教室", tags: "針灸、經絡", lifecycle: "production", relations: "93 穴育苗園", note: "獨立運作" });
    expect(record.source_type).toBe("yu-site");
    expect(record.tags).toEqual(["針灸", "經絡"]);
    expect(parseSiteMetadata(record.notes)?.relations).toEqual(["93 穴育苗園"]);
    expect(record).not.toHaveProperty("status");
  });
});
