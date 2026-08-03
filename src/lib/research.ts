import { researchArticleSchema, type ResearchArticle } from "@/types/research";

export function parseResearchJson(text: string) {
  let value: unknown;
  try { value = JSON.parse(text); } catch (error) { throw new Error(`JSON 格式錯誤：${error instanceof Error ? error.message : "無法解析"}`); }
  const result = researchArticleSchema.safeParse(value);
  if (!result.success) throw new Error(result.error.issues.map((issue) => `${issue.path.join(".") || "根目錄"}：${issue.message}`).join("\n"));
  return result.data;
}

export function researchToRow(item: ResearchArticle) {
  return { entry_number:item.entryNumber, library:item.library, article_type:item.articleType, slug:item.slug, research_date:item.researchDate, title:item.title,
    subtitle:item.subtitle??null, summary:item.summary, body_markdown:item.bodyMarkdown, keywords:item.keywords, entities:item.entities, sources:item.sources,
    evidence_limits:item.evidenceLimits??null, content:item.content, status:item.status, manually_edited:item.manuallyEdited, published_at:item.publishedAt??null };
}

export function takeawayToRow(item: ResearchArticle["ymosTakeaway"]) {
  return { core_fact:item.coreFact, core_question:item.coreQuestion??null, takeaway_sentence:item.takeawaySentence, individual_layer:item.individualLayer??null,
    team_layer:item.teamLayer??null, system_layer:item.systemLayer??null, ecosystem_layer:item.ecosystemLayer??null, primary_element:item.primaryElement??null,
    secondary_element:item.secondaryElement??null, life_system_mapping:item.lifeSystemMapping??null, management_insight:item.managementInsight??null,
    education_insight:item.educationInsight??null, brand_insight:item.brandInsight??null, ai_insight:item.aiInsight??null, health_insight:item.healthInsight??null,
    applicable_scenarios:item.applicableScenarios, misuse_warnings:item.misuseWarnings, related_knowledge:item.relatedKnowledge };
}
