import { z } from "zod";

export const researchLibraries = ["business-leadership", "medical-research", "earth-nature", "world-therapies", "medical-cases", "humanities"] as const;
export type ResearchLibrary = typeof researchLibraries[number];
export const researchStatuses = ["draft", "pending_review", "published", "rejected", "archived"] as const;

export const libraryMeta: Record<ResearchLibrary, { number: string; title: string; description: string; types: { value: string; label: string }[]; legacy?: { href: string; label: string }[] }> = {
  "business-leadership": { number: "一", title: "商業與領導", description: "企業、領導人、個案與時事的策略研究。", types: [{value:"company",label:"企業"},{value:"leader",label:"領導人"},{value:"case-analysis",label:"個案分析"},{value:"current-affairs",label:"時事分析"}] },
  "medical-research": { number: "二", title: "醫療研究", description: "人體器官、系統、神經、生理軸與中西醫對照。", types: [{value:"organ",label:"人體器官"},{value:"body-system",label:"人體系統"},{value:"axis",label:"生理軸"},{value:"medical-topic",label:"醫療專題"}] },
  "earth-nature": { number: "三", title: "天地與動植物研究", description: "動物、植物、礦物與自然環境的運行智慧。", types: [{value:"animal",label:"動物"},{value:"plant",label:"植物"},{value:"mineral",label:"礦物"},{value:"environment",label:"天地環境"}] },
  "world-therapies": { number: "四", title: "世界療法收集", description: "世界各地醫療、養生與身心療法的來源、方法及證據。", types: [{value:"tcm",label:"中醫"},{value:"western",label:"西醫"},{value:"ayurveda",label:"阿育吠陀"},{value:"traditional",label:"傳統療法"},{value:"mind-body",label:"身心療法"}] },
  "medical-cases": { number: "五", title: "醫案整理", description: "匿名醫案、診斷辨證、治療過程、結果與限制。", types: [{value:"clinical-case",label:"臨床醫案"},{value:"tcm-case",label:"中醫醫案"},{value:"integrative-case",label:"整合醫療醫案"}] },
  humanities: { number: "六", title: "人文思想與作品導讀", description: "名人名言、書籍與電影的背景、思想和作品導讀。", types: [{value:"quotation",label:"名人名言"},{value:"book",label:"書籍介紹與導讀"},{value:"film",label:"電影介紹與導讀"}] },
};

const optionalText = z.string().nullable().optional();
const sourceSchema = z.object({ title: z.string().min(1), url: z.string().url().nullable().optional(), sourceType: optionalText });
export const ymosTakeawaySchema = z.object({
  coreFact: z.string().min(1), coreQuestion: optionalText, takeawaySentence: z.string().min(1), individualLayer: optionalText,
  teamLayer: optionalText, systemLayer: optionalText, ecosystemLayer: optionalText, primaryElement: optionalText, secondaryElement: optionalText,
  lifeSystemMapping: optionalText, managementInsight: optionalText, educationInsight: optionalText, brandInsight: optionalText,
  aiInsight: optionalText, healthInsight: optionalText, applicableScenarios: z.array(z.string()).default([]), misuseWarnings: z.array(z.string()).default([]), relatedKnowledge: z.array(z.string()).default([]),
});
export const researchArticleSchema = z.object({
  entryNumber: z.number().int().positive(), library: z.enum(researchLibraries), articleType: z.string().min(1), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  researchDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), title: z.string().min(1), subtitle: optionalText, summary: z.string().min(1), bodyMarkdown: z.string().min(1),
  keywords: z.array(z.string()).default([]), entities: z.array(z.object({type:z.string(),name:z.string()})).default([]), sources: z.array(sourceSchema).default([]),
  evidenceLimits: optionalText, content: z.record(z.unknown()).default({}), status: z.enum(researchStatuses).default("pending_review"), manuallyEdited: z.boolean().default(false),
  publishedAt: z.string().nullable().optional(), ymosTakeaway: ymosTakeawaySchema,
});
export type ResearchArticle = z.infer<typeof researchArticleSchema>;
