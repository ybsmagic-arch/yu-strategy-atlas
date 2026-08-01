import { z } from "zod";

export const strategyCaseStatuses = ["draft", "pending_review", "verified", "published", "archived"] as const;
export type StrategyCaseStatus = (typeof strategyCaseStatuses)[number];

const text = z.string().trim().min(1, "不可留空");
const sourceSchema = z.object({ title: text, url: z.string().trim().url("必須是有效網址"), sourceType: text, note: z.string().trim() });

export const strategyCaseSchema = z.object({
  id: z.string().uuid().optional(), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "只能使用小寫英文、數字及連字號").optional(),
  caseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "格式必須為 YYYY-MM-DD"), title: text, subtitle: text,
  summary: text, centralTheme: text, tags: z.array(text).min(1), status: z.enum(strategyCaseStatuses).default("pending_review"),
  createdAt: z.string().datetime().optional(), updatedAt: z.string().datetime().optional(), manuallyEdited: z.boolean().default(false),
  company: z.object({ name: text, englishName: z.string(), industry: text, foundingBackground: text, timeline: z.array(text).min(1), firstWaveDividend: text, foundingCore: text, businessFlywheel: text, revenueSources: z.array(text).min(1), vulnerableRevenue: text, organizationalMaturity: text, singlePointOfFailure: text, crisisPath: text, organizationType: text }),
  leader: z.object({ name: text, regime: text, era: text, historicalBackground: text, coreDilemma: text, breakthroughMethod: text, institutionalDesign: text, talentStrategy: text, strategicTradeoff: text, historicalCost: text, references: z.array(text) }),
  ip: z.object({ name: text, englishName: z.string(), type: text, origin: text, coreNarrative: text, characterDesign: text, emotionalHook: text, worldBuilding: text, symbolSystem: text, communityMechanism: text, platformDividend: text, monetization: text, longevityMechanism: text, backlashRisk: text }),
  strategy: z.object({ quotation: text, source: text, interpretation: text, sharedLogic: text }),
  ymos: z.object({ observationEntry: text, coreMethod: text, educationProduct: text, lifestyleProduct: text, operatingSystem: text, brandSpirit: text }),
  actions: z.object({ strategicConclusion: text, actionItems: z.array(text).min(1), riskWarnings: z.array(text).min(1), teacherInsight: text }),
  sources: z.array(sourceSchema).min(1),
});

export type StrategyCase = z.infer<typeof strategyCaseSchema>;
export type StrategyCaseSource = z.infer<typeof sourceSchema>;

export const slugifyStrategyCase = (value: string) => value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
