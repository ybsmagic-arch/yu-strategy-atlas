import type { Article } from "./types";

const field = (markdown: string, labels: string[]) => {
  for (const label of labels) {
    const match = markdown.match(new RegExp(`(?:^|\\n)(?:[-*]\\s*)?(?:\\*\\*)?${label}(?:\\*\\*)?[：:]\\s*(.+)`, "i"));
    if (match?.[1]) return match[1].trim();
  }
  return "";
};

export interface ParsedResearch {
  title: string;
  excerpt: string;
  companyName: string;
  leaderName: string;
  ipName: string;
  stratagemTitle: string;
  tags: string[];
}

export function parseResearchMarkdown(markdown: string): ParsedResearch {
  const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "";
  const withoutTitle = markdown.replace(/^#\s+.+$/m, "").trim();
  const excerpt = field(markdown, ["摘要", "研究摘要"]) || withoutTitle.split(/\n\s*\n/)[0]?.replace(/^#+\s*/, "").slice(0, 240) || "";
  const tagsRaw = field(markdown, ["標籤", "關鍵字"]);
  return {
    title,
    excerpt,
    companyName: field(markdown, ["企業名稱", "企業案例"]),
    leaderName: field(markdown, ["人物名稱", "領導者案例", "領導者"]),
    ipName: field(markdown, ["IP 名稱", "IP案例", "IP 案例"]),
    stratagemTitle: field(markdown, ["兵法出處", "兵法", "兵法對照"]),
    tags: tagsRaw ? tagsRaw.split(/[、,，|｜]/).map(x => x.trim()).filter(Boolean) : [],
  };
}

export function buildArticleContent(input: {
  id: string; slug: string; date: string; title: string; excerpt: string; markdown: string;
  companyName: string; leaderName: string; ipName: string; stratagemTitle: string; tags: string[];
}): Article {
  return {
    id: input.id, slug: input.slug, publishedAt: input.date, title: input.title, excerpt: input.excerpt,
    company: { name: input.companyName, industry: "待補充", foundingBackground: "詳見完整原稿", timeline: [], firstDividend: "待補充", core: "詳見完整原稿", flywheel: "待補充", revenue: [], fragileRevenue: "待補充", organizationLevel: "待補充", singlePointFailure: "待補充", trustCrisisPath: "待補充", successForces: {}, organizationType: "待補充" },
    leader: { name: input.leaderName, regime: "待補充", era: "待補充", dilemma: "詳見完整原稿", breakthrough: "待補充", institution: "待補充", talentStrategy: "待補充", tradeoff: "待補充", historicalCost: "待補充", sources: [] },
    ip: { name: input.ipName, type: "待補充", origin: "待補充", narrative: "詳見完整原稿", characters: "待補充", emotionalHook: "待補充", worldview: "待補充", symbols: "待補充", community: "待補充", platformDividend: "待補充", monetization: "待補充", longevity: "待補充", backlashRisk: "待補充", successForces: "待補充" },
    stratagem: { title: input.stratagemTitle || "待補充", source: input.stratagemTitle || "待補充", interpretation: "詳見完整原稿" },
    ymosLayers: [], actions: [], risks: [], sources: [], tags: input.tags,
  };
}
