import { z } from "zod";

export const thoughtTypes = ["quote", "note", "reflection", "deduction", "framework", "case_insight", "teaching_note", "medical_note", "management_note"] as const;
export const thoughtStatuses = ["inbox", "developing", "pending_review", "completed", "archived", "published"] as const;
export const maturityLevels = ["idea", "observation", "hypothesis", "principle", "rule"] as const;
export const primaryElements = ["木", "火", "土", "金", "水", "未分類"] as const;
export const secondaryElements = ["木", "火", "土", "金", "水", "無"] as const;

export const thoughtSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(1).optional(),
  thought_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式必須為 YYYY-MM-DD"),
  title: z.string().trim().min(1, "標題為必填"),
  summary: z.string().trim().nullable().optional(),
  content: z.string().trim().min(1, "完整內容為必填"),
  thought_type: z.enum(thoughtTypes),
  category: z.string().trim().nullable().optional(),
  primary_element: z.enum(primaryElements),
  secondary_element: z.enum(secondaryElements).nullable().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
  source_type: z.string().trim().nullable().optional(),
  source_reference: z.string().trim().nullable().optional(),
  source_article_id: z.string().uuid().nullable().optional(),
  status: z.enum(thoughtStatuses),
  maturity_level: z.enum(maturityLevels),
  manually_edited: z.boolean().default(false),
  is_favorite: z.boolean().default(false),
  created_at: z.string().optional(), updated_at: z.string().optional(), published_at: z.string().nullable().optional(),
});

export type Thought = z.infer<typeof thoughtSchema>;
export const splitTags = (value: string) => [...new Set(value.split(/[,，、\n]/).map(x => x.trim()).filter(Boolean))];
export const slugifyThought = (title: string) => {
  const base = title.normalize("NFKC").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "");
  return `${base || "thought"}-${Date.now().toString(36)}`;
};

export const labels = {
  thoughtType: { quote:"核心思想", note:"一般筆記", reflection:"反思", deduction:"推導", framework:"模型／架構", case_insight:"案例啟發", teaching_note:"教學筆記", medical_note:"醫學筆記", management_note:"管理筆記" },
  status: { inbox:"待整理", developing:"發展中", pending_review:"待審核", completed:"已完成", archived:"已封存", published:"已發布" },
  maturity: { idea:"靈感", observation:"觀察", hypothesis:"假設", principle:"原則", rule:"規則" },
} as const;
