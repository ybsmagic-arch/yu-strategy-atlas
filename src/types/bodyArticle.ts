import { z } from "zod";

export const bodyElements=["木","火","土","金","水"] as const;
export const bodyStatuses=["draft","pending_review","published"] as const;
export const axisEvidenceLevels=["established","widely_researched","emerging","yu_hypothesis"] as const;
const required=z.string().trim().min(1,"不可空白");
const strings=z.array(required).default([]);

export const bodyArticleSchema=z.object({
 id:z.string().uuid().optional(),slug:z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,"slug 只能使用小寫英文、數字與連字號"),
 dayNumber:z.number().int().positive("篇次必須為正整數"),publishDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/,"日期格式必須為 YYYY-MM-DD"),title:required,subtitle:z.string().optional(),
 organNameZh:required,organNameEn:required,summary:required,corePositioning:required,primarySystem:required,relatedSystems:strings,
 primaryElement:z.enum(bodyElements),relatedElements:z.array(z.enum(bodyElements)).default([]),elementReasoning:z.string().optional(),axes:strings,
 westernMedicine:z.object({anatomy:required,functions:required,commonDiseases:required,warningSigns:z.string().optional(),healthMaintenance:required}),
 traditionalChineseMedicine:z.object({organSystemExplanation:required,coreFunctions:required,commonPatterns:required,maintenance:required,classicalReferences:strings.optional()}),
 integration:z.object({commonGround:required,complementaryViews:required,evidenceBoundary:required}),
 yuPerspective:z.object({systemPositioning:required,functionalNetwork:required,fiveElementInterpretation:required,axesInterpretation:required,keyInsight:required}),
 auricularObservation:z.object({observationAreas:strings,observationSigns:strings,notes:required}),tongueObservation:z.object({signs:strings,possiblePatterns:strings,notes:required}),visualObservation:z.object({signs:strings,notes:required}),
 neuralRegulation:z.object({nerves:strings,centralStructures:strings.optional(),autonomicMechanism:required,regulationSuggestions:strings}),dailyApplication:z.object({questions:strings,suggestions:strings}),
 relatedOrgans:strings,relatedArticles:strings.optional(),tags:strings,sources:z.array(z.object({title:required,url:z.string().url("來源網址格式錯誤").optional(),sourceType:z.string().optional()})).optional(),
 contentLayers:z.object({medicalFact:strings,tcmTheory:strings,clinicalAssociation:strings,yuInterpretation:strings,yuHypothesis:strings}),
 status:z.enum(bodyStatuses).default("pending_review"),manuallyEdited:z.boolean().default(false),createdAt:z.string().optional(),updatedAt:z.string().optional(),
});
export type BodyArticle=z.infer<typeof bodyArticleSchema>;

export const physiologicalAxisSchema=z.object({id:z.string().uuid().optional(),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),nameZh:required,nameEn:required,organs:strings,systems:strings,communicationRoutes:strings,coreFunctions:strings,relatedElements:strings,yuInterpretation:required,evidenceLevel:z.enum(axisEvidenceLevels),relatedArticleIds:z.array(z.string().uuid()).default([])});
export type PhysiologicalAxis=z.infer<typeof physiologicalAxisSchema>;
export const evidenceLabels={established:"已建立",widely_researched:"廣泛研究",emerging:"新興研究",yu_hypothesis:"余氏假設"} as const;

export function bodyArticleForInsert(value:unknown){const parsed=bodyArticleSchema.parse(value);return {...parsed,status:"pending_review" as const,manuallyEdited:false};}
