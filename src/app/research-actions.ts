"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { parseResearchJson, researchToRow, takeawayToRow } from "@/lib/research";
import { researchStatuses } from "@/types/research";

const value = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
export async function importResearchArticle(form: FormData) {
  const { db, user } = await requireAdmin();
  try {
    const item = parseResearchJson(value(form,"json"));
    const normalized = { ...item, status:"pending_review" as const, manuallyEdited:false, publishedAt:null };
    const { data, error } = await db.from("research_articles").insert({...researchToRow(normalized),created_by:user.id}).select("id,slug,library").single();
    if (error) throw error;
    const { error: takeawayError } = await db.from("ymos_takeaways").insert({...takeawayToRow(item.ymosTakeaway),source_article_id:data.id,status:"pending_review",created_by:user.id});
    if (takeawayError) throw takeawayError;
    revalidatePath("/research"); revalidatePath("/ymos-takeaways"); revalidatePath("/admin/research");
    redirect(`/admin/research?imported=${encodeURIComponent(data.slug)}`);
  } catch (error) { redirect(`/admin/research?error=${encodeURIComponent(error instanceof Error?error.message:"匯入失敗")}`); }
}
export async function updateResearchStatus(form: FormData) {
  const { db } = await requireAdmin(); const id=value(form,"id"), requested=value(form,"status");
  if (!researchStatuses.includes(requested as never)) redirect("/admin/research?error=invalid-status");
  const published=requested==="published"?new Date().toISOString():null;
  const {error}=await db.from("research_articles").update({status:requested,published_at:published,manually_edited:true}).eq("id",id);
  if(error)redirect(`/admin/research?error=${encodeURIComponent(error.message)}`);
  await db.from("ymos_takeaways").update({status:requested}).eq("source_article_id",id);
  revalidatePath("/research");revalidatePath("/ymos-takeaways");revalidatePath("/admin/research");redirect("/admin/research?updated=1");
}
