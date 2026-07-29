import { articles as fallbackArticles, getArticle as getFallbackArticle } from "@/data/articles";
import type { Article } from "./types";
import { createClient } from "./supabase/server";

function validContent(value: unknown): value is Article {
  if (!value || typeof value !== "object") return false;
  const article = value as Partial<Article>;
  return Boolean(article.slug && article.title && article.company && article.leader && article.ip);
}

export async function getPublishedArticles(): Promise<Article[]> {
  const client = await createClient();
  if (!client) return fallbackArticles;
  const { data, error } = await client.from("articles").select("content").eq("status", "published").order("publish_date", { ascending: false });
  if (error) return fallbackArticles;
  const remote = (data ?? []).map(row => row.content).filter(validContent);
  return remote.length ? remote : fallbackArticles;
}

export async function getPublishedArticle(slug: string): Promise<Article | undefined> {
  const client = await createClient();
  if (client) {
    const { data } = await client.from("articles").select("content").eq("slug", slug).eq("status", "published").maybeSingle();
    if (validContent(data?.content)) return data.content;
  }
  return getFallbackArticle(slug);
}
