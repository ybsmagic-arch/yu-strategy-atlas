export const YMOS_LAYERS = [
  "觀耳辨證",
  "余氏生命系統學",
  "耳林高手",
  "醫生醫世小方茶",
  "YMOS",
  "理解生命．理解系統．理解世界運行",
] as const;

export type CaseKind = "company" | "leader" | "ip";

export interface Article {
  id: string;
  slug: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  company: { name: string; industry: string; foundingBackground: string; timeline: string[]; firstDividend: string; core: string; flywheel: string; revenue: string[]; fragileRevenue: string; organizationLevel: string; singlePointFailure: string; trustCrisisPath: string; successForces: Record<string, number>; organizationType: string };
  leader: { name: string; regime: string; era: string; dilemma: string; breakthrough: string; institution: string; talentStrategy: string; tradeoff: string; historicalCost: string; sources: string[] };
  ip: { name: string; type: string; origin: string; narrative: string; characters: string; emotionalHook: string; worldview: string; symbols: string; community: string; platformDividend: string; monetization: string; longevity: string; backlashRisk: string; successForces: string };
  stratagem: { title: string; source: string; interpretation: string };
  ymosLayers: Array<{ layer: (typeof YMOS_LAYERS)[number]; insight: string }>;
  actions: string[];
  risks: string[];
  sources: Array<{ label: string; url: string }>;
  tags: string[];
}
