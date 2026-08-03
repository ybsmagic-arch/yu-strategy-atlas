import type { NaturalWisdomEntry } from "@/types/naturalWisdom";
import { naturalWisdomSchema } from "@/types/naturalWisdom";

const mapping: Record<string, string> = {
  entryNumber: "entry_number", entryType: "entry_type", parentEntryId: "parent_entry_id", nameZh: "name_zh", nameEn: "name_en",
  scientificName: "scientific_name", ymosLevel: "ymos_level", primaryElement: "primary_element", secondaryElement: "secondary_element",
  lifeRole: "life_role", coreAbility: "core_ability", biologyProfile: "biology_profile", evolutionBackground: "evolution_background",
  survivalStrategy: "survival_strategy", behaviorStrategy: "behavior_strategy", groupCooperation: "group_cooperation", decisionModel: "decision_model",
  riskManagement: "risk_management", environmentAdaptation: "environment_adaptation", ecologicalInteractions: "ecological_interactions",
  herbalName: "herbal_name", medicinalPart: "medicinal_part", natureFlavor: "nature_flavor", meridianEntry: "meridian_entry",
  traditionalFunctions: "traditional_functions", pairingLogic: "pairing_logic", processingMethods: "processing_methods", classicalHistory: "classical_history",
  modernResearch: "modern_research", risksAndContraindications: "risks_and_contraindications", evidenceLimits: "evidence_limits",
  ymosPrinciples: "ymos_principles", yuLifeSystemInsight: "yu_life_system_insight", yuTcmMapping: "yu_tcm_mapping",
  educationInsight: "education_insight", managementInsight: "management_insight", brandInsight: "brand_insight", businessInsight: "business_insight",
  aiInsight: "ai_insight", todayInspiration: "today_inspiration", wisdomSentence: "wisdom_sentence", coverImageUrl: "cover_image_url",
  manuallyEdited: "manually_edited", publishedAt: "published_at", createdAt: "created_at", updatedAt: "updated_at",
};

export function naturalToRow(item: NaturalWisdomEntry) {
  const row: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(item)) row[mapping[key] ?? key] = value === undefined ? null : value;
  delete row.id;
  delete row.created_at;
  delete row.updated_at;
  return row;
}

export function naturalFromRow(row: Record<string, unknown>): NaturalWisdomEntry {
  const reverse = Object.fromEntries(Object.entries(mapping).map(([camel, snake]) => [snake, camel]));
  const item: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) item[reverse[key] ?? key] = value;
  return naturalWisdomSchema.parse(item);
}

export function parseNaturalJson(text: string) {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch (error) {
    throw new Error(`JSON 格式錯誤：${error instanceof Error ? error.message : "無法解析"}`);
  }
  const result = naturalWisdomSchema.safeParse(raw);
  if (!result.success) throw new Error(result.error.issues.map((issue) => `${issue.path.join(".") || "根目錄"}：${issue.message}`).join("\n"));
  return result.data;
}

export const typeLabel = (type: string) => ({ animal: "動物", plant: "植物", herb: "中藥", fungus: "真菌", microorganism: "微生物" }[type] ?? type);
