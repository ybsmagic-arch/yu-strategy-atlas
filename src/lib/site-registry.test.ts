import { describe, expect, it } from "vitest";
import { approvedKnowledgeRelations, knowledgeRelationSchema, parseList, parseSiteMetadata, serializeSiteMetadata, siteFormSchema, siteFormToRecord } from "./site-registry";

describe("site registry metadata", () => {
  it("round-trips controlled lifecycle and readable relations", () => {
    const encoded = serializeSiteMetadata({ lifecycle: "candidate", relations: ["余氏針灸學", "93 穴育苗園"], note: "隔離測試" });
    expect(parseSiteMetadata(encoded)).toEqual({ lifecycle: "candidate", relations: ["余氏針灸學", "93 穴育苗園"], note: "隔離測試", knowledgeRelationsVersion: 1, knowledgeRelations: [] });
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

  it("keeps existing metadata while round-tripping versioned knowledge relations", () => {
    const relation = { sourceType: "strategy_article" as const, knowledgeId: "a005", route: "/articles/ikea-standardization-and-imagination", relationType: "brand_case_reference" as const, displayName: "IKEA、秦始皇與 LEGO：標準化如何釋放想像", approvalStatus: "approved" as const };
    const notes = serializeSiteMetadata({ lifecycle: "production", relations: ["耳穴知識領域"], note: "原有備註", knowledgeRelationsVersion: 1, knowledgeRelations: [relation] });
    expect(parseSiteMetadata(notes)).toEqual({ lifecycle: "production", relations: ["耳穴知識領域"], note: "原有備註", knowledgeRelationsVersion: 1, knowledgeRelations: [relation] });
  });

  it("exposes only Owner-approved relations for public display", () => {
    const base = { sourceType: "strategy_article" as const, knowledgeId: "a005", route: "/articles/ikea-standardization-and-imagination", relationType: "brand_case_reference" as const, displayName: "IKEA 案例" };
    const metadata = parseSiteMetadata(serializeSiteMetadata({ lifecycle: "production", relations: [], note: "", knowledgeRelations: [{ ...base, approvalStatus: "approved" }, { ...base, knowledgeId: "a006", route: "/articles/spotify-discovery-and-attention", approvalStatus: "pending" }] }));
    expect(approvedKnowledgeRelations(metadata).map((relation) => relation.knowledgeId)).toEqual(["a005"]);
  });

  it("rejects external, mismatched and duplicate knowledge routes", () => {
    const valid = { sourceType: "strategy_article" as const, knowledgeId: "a005", route: "/articles/ikea-standardization-and-imagination", relationType: "brand_case_reference" as const, displayName: "IKEA 案例", approvalStatus: "approved" as const };
    expect(knowledgeRelationSchema.safeParse(valid).success).toBe(true);
    expect(knowledgeRelationSchema.safeParse({ ...valid, route: "https://example.com/private" }).success).toBe(false);
    expect(knowledgeRelationSchema.safeParse({ ...valid, route: "/tcm/herb/example" }).success).toBe(false);
    const base = { title: "測試站", url: "https://example.com", description: "測試", category: "知識網站", tags: "", lifecycle: "candidate", relations: "", note: "" };
    expect(siteFormSchema.safeParse({ ...base, knowledgeRelations: JSON.stringify([valid, valid]) }).success).toBe(false);
  });

  it("validates the Owner-reviewed first batch as fixture only", () => {
    const article = (knowledgeId: string, slug: string, displayName: string, approvalStatus: "approved" | "pending" | "deferred") => ({ sourceType: "strategy_article" as const, knowledgeId, route: `/articles/${slug}`, relationType: "brand_case_reference" as const, displayName, approvalStatus });
    const fixture = [
      { siteTitle: "耳林高手", relations: [
        article("a005", "ikea-standardization-and-imagination", "IKEA：標準化如何釋放想像", "approved"),
        article("a006", "spotify-discovery-and-attention", "Spotify：平台如何分配注意力", "approved"),
        article("a004", "patagonia-purpose-and-boundaries", "Patagonia：使命如何約束成長", "deferred"),
      ] },
      { siteTitle: "小方 LET GO", relations: [
        article("a003", "toyota-system-and-resilience", "豐田：慢系統如何累積韌性", "pending"),
        article("a007", "muji-subtraction-and-clarity", "無印良品：減法如何留下核心", "pending"),
      ] },
      { siteTitle: "醫生醫世", relations: [
        article("a003", "toyota-system-and-resilience", "豐田：慢系統如何累積韌性", "deferred"),
        article("a007", "muji-subtraction-and-clarity", "無印良品：減法如何留下核心", "deferred"),
      ] },
    ];
    const base = { url: "https://example.com", description: "fixture", category: "知識網站", tags: "", lifecycle: "candidate", relations: "", note: "" };
    expect(fixture.every((site) => siteFormSchema.safeParse({ ...base, title: site.siteTitle, knowledgeRelations: JSON.stringify(site.relations) }).success)).toBe(true);
    expect(fixture.flatMap((site) => site.relations).filter((relation) => relation.approvalStatus === "approved")).toHaveLength(2);
  });
});
