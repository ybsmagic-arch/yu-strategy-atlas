import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { normalizeCaseName } from "@/lib/duplicate-check";
import type { Article } from "@/lib/types";
import type { StrategyCase } from "@/types/strategyCase";

type StoredCase = { id:string; slug:string; case_date:string; title:string; subtitle:string; summary:string; central_theme:string; tags:string[]; status:StrategyCase["status"]; content:StrategyCase; manually_edited:boolean; created_at:string; updated_at:string };
export type DuplicateWarning = { kind:"date"|"slug"|"company"|"leader"|"ip"; name:string; caseDate?:string; slug?:string };

const fromStored = (row: StoredCase): StrategyCase => ({ ...row.content, id:row.id, slug:row.slug, caseDate:row.case_date, title:row.title, subtitle:row.subtitle, summary:row.summary, centralTheme:row.central_theme, tags:row.tags, status:row.status, manuallyEdited:row.manually_edited, createdAt:row.created_at, updatedAt:row.updated_at });

export async function getPublishedStrategyCases(): Promise<StrategyCase[]> {
  const db = await createClient(); if (!db) return [];
  const { data, error } = await db.from("strategy_cases").select("*").eq("status","published").order("case_date",{ascending:false});
  return error ? [] : (data as StoredCase[]).map(fromStored);
}
export async function getPublishedStrategyCase(slug:string): Promise<StrategyCase|undefined> {
  const db = await createClient(); if (!db) return undefined;
  const { data, error } = await db.from("strategy_cases").select("*").eq("slug",slug).eq("status","published").maybeSingle();
  return error || !data ? undefined : fromStored(data as StoredCase);
}

export function strategyCaseToArticle(item: StrategyCase): Article {
  return { id:item.id ?? item.slug ?? item.title, slug:item.slug ?? "", publishedAt:item.caseDate, title:item.title, excerpt:item.summary, tags:item.tags,
    company:{ name:item.company.name, industry:item.company.industry, foundingBackground:item.company.foundingBackground, timeline:item.company.timeline, firstDividend:item.company.firstWaveDividend, core:item.company.foundingCore, flywheel:item.company.businessFlywheel, revenue:item.company.revenueSources, fragileRevenue:item.company.vulnerableRevenue, organizationLevel:item.company.organizationalMaturity, singlePointFailure:item.company.singlePointOfFailure, trustCrisisPath:item.company.crisisPath, successForces:{}, organizationType:item.company.organizationType },
    leader:{ name:item.leader.name, regime:item.leader.regime, era:`${item.leader.era}｜${item.leader.historicalBackground}`, dilemma:item.leader.coreDilemma, breakthrough:item.leader.breakthroughMethod, institution:item.leader.institutionalDesign, talentStrategy:item.leader.talentStrategy, tradeoff:item.leader.strategicTradeoff, historicalCost:item.leader.historicalCost, sources:item.leader.references },
    ip:{ name:item.ip.name, type:item.ip.type, origin:item.ip.origin, narrative:item.ip.coreNarrative, characters:item.ip.characterDesign, emotionalHook:item.ip.emotionalHook, worldview:item.ip.worldBuilding, symbols:item.ip.symbolSystem, community:item.ip.communityMechanism, platformDividend:item.ip.platformDividend, monetization:item.ip.monetization, longevity:item.ip.longevityMechanism, backlashRisk:item.ip.backlashRisk, successForces:"" },
    stratagem:{ title:item.strategy.quotation, source:item.strategy.source, interpretation:`${item.strategy.interpretation}\n${item.strategy.sharedLogic}` },
    ymosLayers:[{layer:"觀耳辨證",insight:item.ymos.observationEntry},{layer:"余氏生命系統學",insight:item.ymos.coreMethod},{layer:"耳林高手",insight:item.ymos.educationProduct},{layer:"醫生醫世小方茶",insight:item.ymos.lifestyleProduct},{layer:"YMOS",insight:item.ymos.operatingSystem},{layer:"理解生命．理解系統．理解世界運行",insight:item.ymos.brandSpirit}],
    actions:item.actions.actionItems, risks:item.actions.riskWarnings, sources:item.sources.map(x=>({label:x.title,url:x.url})) };
}

export async function findStrategyCaseDuplicates(db:SupabaseClient, item:StrategyCase, slug:string):Promise<DuplicateWarning[]> {
  const warnings:DuplicateWarning[]=[];
  const { data:direct }=await db.from("strategy_cases").select("slug,case_date").or(`slug.eq.${slug},case_date.eq.${item.caseDate}`);
  for(const row of direct??[]) { if(row.slug===slug) warnings.push({kind:"slug",name:slug,slug:row.slug,caseDate:row.case_date}); if(row.case_date===item.caseDate) warnings.push({kind:"date",name:item.caseDate,slug:row.slug,caseDate:row.case_date}); }
  const start=new Date(`${item.caseDate}T00:00:00Z`); start.setUTCDate(start.getUTCDate()-30);
  const candidates=[{kind:"company" as const,name:item.company.name},{kind:"leader" as const,name:item.leader.name},{kind:"ip" as const,name:item.ip.name}];
  const { data:entities }=await db.from("case_entities").select("entity_type,name,strategy_cases!inner(case_date,slug)").in("entity_type",["company","leader","ip"]).in("normalized_name",candidates.map(x=>normalizeCaseName(x.name))).gte("strategy_cases.case_date",start.toISOString().slice(0,10)).lt("strategy_cases.case_date",item.caseDate);
  for(const entity of entities??[]) { const parent=Array.isArray(entity.strategy_cases)?entity.strategy_cases[0]:entity.strategy_cases; warnings.push({kind:entity.entity_type as "company"|"leader"|"ip",name:entity.name,caseDate:parent?.case_date,slug:parent?.slug}); }
  return warnings;
}

export async function insertStrategyCase(db:SupabaseClient, item:StrategyCase, slug:string) {
  const content={...item,slug,status:"pending_review" as const,manuallyEdited:false};
  const { data:row,error }=await db.from("strategy_cases").insert({slug,case_date:item.caseDate,title:item.title,subtitle:item.subtitle,summary:item.summary,central_theme:item.centralTheme,tags:item.tags,status:"pending_review",content,manually_edited:false}).select("id,slug").single();
  if(error) throw error;
  const entities=[{type:"company",name:item.company.name,metadata:{industry:item.company.industry}},{type:"leader",name:item.leader.name,metadata:{regime:item.leader.regime}},{type:"regime",name:item.leader.regime,metadata:{}},{type:"ip",name:item.ip.name,metadata:{type:item.ip.type}},{type:"strategy",name:item.strategy.source,metadata:{quotation:item.strategy.quotation}},...item.tags.map(name=>({type:"tag",name,metadata:{}}))];
  const {error:entityError}=await db.from("case_entities").insert(entities.map(x=>({case_id:row.id,entity_type:x.type,name:x.name,normalized_name:normalizeCaseName(x.name),metadata:x.metadata})));
  if(entityError) throw entityError;
  const {error:sourceError}=await db.from("case_sources").insert(item.sources.map((x,i)=>({case_id:row.id,title:x.title,url:x.url,source_type:x.sourceType,note:x.note,position:i+1})));
  if(sourceError) throw sourceError;
  return row as {id:string;slug:string};
}
