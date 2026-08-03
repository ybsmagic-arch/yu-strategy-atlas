"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { buildArticleContent, parseResearchMarkdown } from "@/lib/markdown-parser";
import { normalizeCaseName } from "@/lib/duplicate-check";

const required = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export async function signIn(form: FormData) {
  const client = await createClient();
  if (!client) redirect("/admin/login?error=config");
  const { error } = await client.auth.signInWithPassword({ email: required(form, "email"), password: required(form, "password") });
  if (error) {
    const message = error.message.toLowerCase();
    const friendly = message.includes("email not confirmed") ? "電子郵件尚未確認，請先在 Supabase 確認使用者" :
      message.includes("invalid api key") || message.includes("api key") ? "Supabase Publishable key 設定不正確或不完整" :
      message.includes("invalid login credentials") ? "登入資料不符；請確認使用者 Email、密碼與確認狀態" :
      `Supabase 登入失敗：${error.message}`;
    redirect(`/admin/login?error=${encodeURIComponent(friendly)}`);
  }
  redirect("/admin");
}

export async function signOut() {
  const client = await createClient();
  await client?.auth.signOut();
  redirect("/");
}

export async function changePassword(form: FormData) {
  const client = await createClient();
  if (!client) redirect("/admin/login?error=config");

  const { data: auth } = await client.auth.getUser();
  if (!auth.user) redirect("/admin/login");

  const password = required(form, "password");
  const confirmation = required(form, "password_confirmation");

  if (password.length < 10) {
    redirect(`/admin/account?error=${encodeURIComponent("新密碼至少需要 10 個字元")}`);
  }
  if (password !== confirmation) {
    redirect(`/admin/account?error=${encodeURIComponent("兩次輸入的新密碼不一致")}`);
  }

  const { error } = await client.auth.updateUser({ password });
  if (error) {
    redirect(`/admin/account?error=${encodeURIComponent(`修改失敗：${error.message}`)}`);
  }

  await client.auth.signOut();
  redirect("/admin/login?password=changed");
}

export async function createArticle(form: FormData) {
  const client = await createClient();
  if (!client) redirect("/admin/articles/new?error=config");
  const { data: auth } = await client.auth.getUser();
  if (!auth.user) redirect("/admin/login");

  const markdown = required(form, "markdown");
  const parsed = parseResearchMarkdown(markdown);
  const date = required(form, "date");
  const title = required(form, "title") || parsed.title;
  const excerpt = required(form, "excerpt") || parsed.excerpt;
  const companyName = required(form, "company_name") || parsed.companyName;
  const leaderName = required(form, "leader_name") || parsed.leaderName;
  const ipName = required(form, "ip_name") || parsed.ipName;
  const stratagemTitle = required(form, "stratagem_title") || parsed.stratagemTitle || "待補充";
  const status = required(form, "status") === "published" ? "published" : "draft";
  const slug = required(form, "slug") || `${date}-${title}`.normalize("NFKC").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "");
  const tags = required(form, "tags").split(/[、,，|｜]/).map(x => x.trim()).filter(Boolean);

  if (!date || !title || !excerpt || !companyName || !leaderName || !ipName || !markdown) {
    redirect(`/admin/articles/new?error=${encodeURIComponent("日期、標題、摘要、三個案例名稱與 Markdown 原稿都是必填")}`);
  }

  const insertEntity = async (table: "companies" | "leaders" | "ips", name: string) => {
    const normalized_name = normalizeCaseName(name);
    const extra = table === "leaders" ? { regime: "待補充" } : {};
    const { data, error } = await client.from(table).upsert({ name, normalized_name, ...extra }, { onConflict: table === "leaders" ? "normalized_name,regime" : "normalized_name" }).select("id").single();
    if (error) throw new Error(error.message);
    return data.id as string;
  };

  try {
    const [companyId, leaderId, ipId] = await Promise.all([
      insertEntity("companies", companyName), insertEntity("leaders", leaderName), insertEntity("ips", ipName),
    ]);
    const { data: row, error } = await client.from("articles").insert({ slug, publish_date: date, title, excerpt, body_markdown: markdown, status: "draft", tags, author_id: auth.user.id }).select("id").single();
    if (error) throw new Error(error.message);
    const articleId = row.id as string;
    const relations = await Promise.all([
      client.from("article_companies").insert({ article_id: articleId, company_id: companyId }),
      client.from("article_leaders").insert({ article_id: articleId, leader_id: leaderId }),
      client.from("article_ips").insert({ article_id: articleId, ip_id: ipId }),
    ]);
    const relationError = relations.find(x => x.error)?.error;
    if (relationError) throw new Error(relationError.message);
    const content = buildArticleContent({ id: articleId, slug, date, title, excerpt, markdown, companyName, leaderName, ipName, stratagemTitle, tags });
    const { error: updateError } = await client.from("articles").update({ content, status }).eq("id", articleId);
    if (updateError) throw new Error(updateError.message);
  } catch (error) {
    redirect(`/admin/articles/new?error=${encodeURIComponent(error instanceof Error ? error.message : "儲存失敗")}`);
  }
  revalidatePath("/"); revalidatePath("/articles"); revalidatePath("/admin");
  redirect(`/admin?created=${status}`);
}

export async function updateStrategyCaseStatus(form:FormData){
  const client=await createClient();if(!client)redirect("/admin/login");
  const {data:auth}=await client.auth.getUser();if(!auth.user)redirect("/admin/login");
  const id=required(form,"id"),slug=required(form,"slug"),requested=required(form,"status");
  const status=requested==="published"?"published":requested==="verified"?"verified":"pending_review";
  const {error}=await client.from("strategy_cases").update({status}).eq("id",id);
  if(error)redirect(`/admin/strategy-cases/${slug}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");revalidatePath("/articles");revalidatePath(`/articles/${slug}`);revalidatePath("/admin");
  redirect(`/admin/strategy-cases/${slug}?updated=${status}`);
}
