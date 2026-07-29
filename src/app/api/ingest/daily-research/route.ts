import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { normalizeCaseName } from "@/lib/duplicate-check";
import { isValidIngestToken } from "@/lib/ingest-auth";
import { buildArticleContent, parseResearchMarkdown } from "@/lib/markdown-parser";

export const runtime = "nodejs";
type Payload = { markdown?: string; date?: string; title?: string; excerpt?: string; companyName?: string; leaderName?: string; ipName?: string; stratagemTitle?: string; tags?: string[] };
const slugify = (value: string) => value.normalize("NFKC").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "");

export async function POST(request: Request) {
  if (!isValidIngestToken(request.headers.get("authorization"), process.env.DAILY_INGEST_SECRET)) return NextResponse.json({ error: "未授權" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return NextResponse.json({ error: "伺服器尚未完成排程設定" }, { status: 503 });
  let payload: Payload;
  try { payload = await request.json() as Payload; } catch { return NextResponse.json({ error: "JSON 格式錯誤" }, { status: 400 }); }
  const markdown = payload.markdown?.trim() ?? "";
  const parsed = parseResearchMarkdown(markdown);
  const date = payload.date?.trim() ?? new Date().toISOString().slice(0, 10);
  const title = payload.title?.trim() || parsed.title;
  const excerpt = payload.excerpt?.trim() || parsed.excerpt;
  const companyName = payload.companyName?.trim() || parsed.companyName;
  const leaderName = payload.leaderName?.trim() || parsed.leaderName;
  const ipName = payload.ipName?.trim() || parsed.ipName;
  const stratagemTitle = payload.stratagemTitle?.trim() || parsed.stratagemTitle || "待補充";
  const tags = payload.tags?.length ? payload.tags : parsed.tags;
  if (!markdown || !title || !excerpt || !companyName || !leaderName || !ipName) return NextResponse.json({ error: "缺少 Markdown、標題、摘要或三類案例名稱" }, { status: 422 });
  const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const entity = async (table: "companies" | "leaders" | "ips", name: string) => {
    const normalized_name = normalizeCaseName(name);
    const extra = table === "leaders" ? { regime: "待補充" } : {};
    const conflict = table === "leaders" ? "normalized_name,regime" : "normalized_name";
    const { data, error } = await db.from(table).upsert({ name, normalized_name, ...extra }, { onConflict: conflict }).select("id").single();
    if (error) throw error;
    return data.id as string;
  };
  try {
    const slug = slugify(`${date}-${title}`);
    const [companyId, leaderId, ipId] = await Promise.all([entity("companies", companyName), entity("leaders", leaderName), entity("ips", ipName)]);
    const { data: article, error } = await db.from("articles").insert({ slug, publish_date: date, title, excerpt, body_markdown: markdown, status: "draft", tags }).select("id").single();
    if (error) throw error;
    const id = article.id as string;
    const links = await Promise.all([db.from("article_companies").insert({ article_id: id, company_id: companyId }), db.from("article_leaders").insert({ article_id: id, leader_id: leaderId }), db.from("article_ips").insert({ article_id: id, ip_id: ipId })]);
    const linkError = links.find(result => result.error)?.error;
    if (linkError) throw linkError;
    const content = buildArticleContent({ id, slug, date, title, excerpt, markdown, companyName, leaderName, ipName, stratagemTitle, tags });
    const { error: updateError } = await db.from("articles").update({ content }).eq("id", id);
    if (updateError) throw updateError;
    return NextResponse.json({ ok: true, id, slug, status: "draft" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "建立草稿失敗" }, { status: 409 });
  }
}
