import { z } from "zod";

export const SITE_SOURCE_TYPE = "yu-site";
export const SITE_REGISTRY_HEADER = "YMOS_SITE_REGISTRY_V1";
export const siteLifecycles = ["idea", "building", "candidate", "production", "archived"] as const;
export type SiteLifecycle = (typeof siteLifecycles)[number];

export const knowledgeSourceTypes = ["strategy_article", "research_library", "tcm", "ymos_takeaway", "topic", "reference_link", "body_atlas", "nature", "thought"] as const;
export const knowledgeRelationTypes = ["brand_case_reference", "topic_resource", "knowledge_source", "related_reading"] as const;
export const knowledgeApprovalStatuses = ["pending", "approved", "deferred"] as const;

export const knowledgeSourceLabels: Record<(typeof knowledgeSourceTypes)[number], string> = {
  strategy_article: "策略案例",
  research_library: "研究知識庫",
  tcm: "中醫藥系統",
  ymos_takeaway: "YMOS 取經",
  topic: "主題標籤",
  reference_link: "好站資源",
  body_atlas: "人體知識系統",
  nature: "自然智慧",
  thought: "思想筆記",
};

export const knowledgeRelationLabels: Record<(typeof knowledgeRelationTypes)[number], string> = {
  brand_case_reference: "品牌案例引用",
  topic_resource: "主題資源",
  knowledge_source: "知識來源",
  related_reading: "延伸閱讀",
};

export const knowledgeApprovalLabels: Record<(typeof knowledgeApprovalStatuses)[number], string> = {
  pending: "待確認",
  approved: "已核准",
  deferred: "暫緩",
};

export const siteLifecycleLabels: Record<SiteLifecycle, string> = {
  idea: "構想中",
  building: "建置中",
  candidate: "Candidate",
  production: "Production",
  archived: "封存",
};

const routePrefixes: Record<(typeof knowledgeSourceTypes)[number], readonly string[]> = {
  strategy_article: ["/articles/"],
  research_library: ["/research/"],
  tcm: ["/tcm/"],
  ymos_takeaway: ["/ymos-takeaways"],
  topic: ["/topics"],
  reference_link: ["/links/knowledge", "/links/tcm"],
  body_atlas: ["/body-atlas/"],
  nature: ["/nature/"],
  thought: ["/thoughts/"],
};

export const knowledgeRelationSchema = z.object({
  sourceType: z.enum(knowledgeSourceTypes),
  knowledgeId: z.string().trim().min(1).max(160),
  route: z.string().trim().min(1).max(500).refine((value) => value.startsWith("/") && !value.startsWith("//") && !value.includes("://"), "知識路由必須是 YMOS 內部路由"),
  relationType: z.enum(knowledgeRelationTypes),
  displayName: z.string().trim().min(1).max(200),
  approvalStatus: z.enum(knowledgeApprovalStatuses),
}).strict().superRefine((value, context) => {
  const matchesSource = routePrefixes[value.sourceType].some((prefix) => prefix.endsWith("/") ? value.route.startsWith(prefix) : value.route === prefix || value.route.startsWith(`${prefix}?`) || value.route.startsWith(`${prefix}/`));
  if (!matchesSource) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["route"], message: "知識路由與來源類型不相符" });
  }
});

export type KnowledgeRelation = z.infer<typeof knowledgeRelationSchema>;

function uniqueKnowledgeRelations(relations: KnowledgeRelation[], context: z.RefinementCtx) {
  const seen = new Set<string>();
  relations.forEach((relation, index) => {
    const key = `${relation.sourceType}\u0000${relation.knowledgeId}\u0000${relation.route}`;
    if (seen.has(key)) context.addIssue({ code: z.ZodIssueCode.custom, path: [index], message: "同一網站不可重複登記相同知識關聯" });
    seen.add(key);
  });
}

const metadataSchema = z.object({
  lifecycle: z.enum(siteLifecycles),
  relations: z.array(z.string().trim().min(1).max(100)).max(30),
  note: z.string().trim().max(2000).default(""),
  knowledgeRelationsVersion: z.literal(1).default(1),
  knowledgeRelations: z.array(knowledgeRelationSchema).max(100).default([]).superRefine(uniqueKnowledgeRelations),
}).strict();

export type SiteMetadata = z.infer<typeof metadataSchema>;
type SiteMetadataInput = z.input<typeof metadataSchema>;

export function parseList(value: string) {
  return [...new Set(value.split(/[、,，\n]/).map((item) => item.trim()).filter(Boolean))];
}

export function serializeSiteMetadata(input: SiteMetadataInput) {
  const value = metadataSchema.parse(input);
  return `${SITE_REGISTRY_HEADER}\n${JSON.stringify(value)}`;
}

export function parseSiteMetadata(notes: string | null | undefined): SiteMetadata | null {
  if (!notes?.startsWith(`${SITE_REGISTRY_HEADER}\n`)) return null;
  try {
    return metadataSchema.parse(JSON.parse(notes.slice(SITE_REGISTRY_HEADER.length + 1)));
  } catch {
    return null;
  }
}

export function approvedKnowledgeRelations(metadata: SiteMetadata | null) {
  return metadata?.knowledgeRelations.filter((relation) => relation.approvalStatus === "approved") ?? [];
}

export const siteFormSchema = z.object({
  title: z.string().trim().min(1).max(160),
  url: z.string().trim().url().refine((value) => /^https:\/\//i.test(value), "網站入口必須使用 HTTPS"),
  description: z.string().trim().min(1).max(3000),
  category: z.enum(["教室", "知識網站", "專題網站"]),
  tags: z.string().max(1000).default(""),
  lifecycle: z.enum(siteLifecycles),
  relations: z.string().max(2000).default(""),
  note: z.string().max(2000).default(""),
  knowledgeRelations: z.string().max(50000).default("[]").transform((value, context) => {
    try {
      const parsed = z.array(knowledgeRelationSchema).max(100).superRefine(uniqueKnowledgeRelations).safeParse(JSON.parse(value));
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => context.addIssue({ code: z.ZodIssueCode.custom, message: issue.message, path: issue.path }));
        return z.NEVER;
      }
      return parsed.data;
    } catch {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "知識關聯格式無效" });
      return z.NEVER;
    }
  }),
});

export function siteFormToRecord(input: unknown) {
  const x = siteFormSchema.parse(input);
  return {
    collection: "knowledge" as const,
    title: x.title,
    url: x.url,
    description: x.description,
    category: x.category,
    tags: parseList(x.tags),
    language: "zh-Hant",
    source_type: SITE_SOURCE_TYPE,
    reliability: "primary" as const,
    ai_use: "reference" as const,
    notes: serializeSiteMetadata({ lifecycle: x.lifecycle, relations: parseList(x.relations), note: x.note.trim(), knowledgeRelationsVersion: 1, knowledgeRelations: x.knowledgeRelations }),
  };
}

