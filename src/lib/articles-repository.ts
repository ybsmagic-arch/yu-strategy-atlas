import { articles as fallbackArticles, getArticle as getFallbackArticle } from "@/data/articles";
import type { Article } from "./types";
import { createClient } from "./supabase/server";
import { getPublishedStrategyCase, getPublishedStrategyCases, strategyCaseToArticle } from "./repositories/strategyCases";

function validContent(value: unknown): value is Article {
  if (!value || typeof value !== "object") return false;
  const article = value as Partial<Article>;
  return Boolean(article.slug && article.title && article.company && article.leader && article.ip);
}

export async function getPublishedArticles(): Promise<Article[]> {
  const completeCases=(await getPublishedStrategyCases()).map(strategyCaseToArticle);
  const client = await createClient();
  if (!client) return [...completeCases,...fallbackArticles];
  const { data, error } = await client.from("articles").select("content").eq("status", "published").order("publish_date", { ascending: false });
  if (error) return [...completeCases,...fallbackArticles];
  const remote = (data ?? []).map(row => row.content).filter(validContent);
  const legacy=remote.length ? remote : fallbackArticles;
  return [...completeCases,...legacy].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPublishedArticle(slug: string): Promise<Article | undefined> {
  const complete=await getPublishedStrategyCase(slug); if(complete) return strategyCaseToArticle(complete);
  const client = await createClient();
  if (client) {
    const { data } = await client.from("articles").select("content").eq("slug", slug).eq("status", "published").maybeSingle();
    if (validContent(data?.content)) return data.content;
  }
  return getFallbackArticle(slug);
}
