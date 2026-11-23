import { z } from "zod";

export const SITE_SOURCE_TYPE = "yu-site";
export const SITE_REGISTRY_HEADER = "YMOS_SITE_REGISTRY_V1";
export const siteLifecycles = ["idea", "building", "candidate", "production", "archived"] as const;
export type SiteLifecycle = (typeof siteLifecycles)[number];

export const siteLifecycleLabels: Record<SiteLifecycle, string> = {
  idea: "構想中",
  building: "建置中",
  candidate: "Candidate",
  production: "Production",
  archived: "封存",
};

const metadataSchema = z.object({
  lifecycle: z.enum(siteLifecycles),
  relations: z.array(z.string().trim().min(1).max(100)).max(30),
  note: z.string().trim().max(2000).default(""),
}).strict();

export type SiteMetadata = z.infer<typeof metadataSchema>;

export function parseList(value: string) {
  return [...new Set(value.split(/[、,，\n]/).map((item) => item.trim()).filter(Boolean))];
}

export function serializeSiteMetadata(input: SiteMetadata) {
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

export const siteFormSchema = z.object({
  title: z.string().trim().min(1).max(160),
  url: z.string().trim().url().refine((value) => /^https:\/\//i.test(value), "網站入口必須使用 HTTPS"),
  description: z.string().trim().min(1).max(3000),
  category: z.enum(["教室", "知識網站", "專題網站"]),
  tags: z.string().max(1000).default(""),
  lifecycle: z.enum(siteLifecycles),
  relations: z.string().max(2000).default(""),
  note: z.string().max(2000).default(""),
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
    notes: serializeSiteMetadata({ lifecycle: x.lifecycle, relations: parseList(x.relations), note: x.note.trim() }),
  };
}

