"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { slugifyThought, splitTags, thoughtSchema } from "@/types/thought";
import { validateThoughtJson } from "@/lib/thoughts";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const optional = (value: string) => value || null;

function fromForm(form: FormData) {
  return thoughtSchema.omit({ id:true, created_at:true, updated_at:true, published_at:true }).parse({
    slug: text(form,"slug") || slugifyThought(text(form,"title")), thought_date: text(form,"thought_date"),
    title: text(form,"title"), summary: optional(text(form,"summary")), content: text(form,"content"),
    thought_type: text(form,"thought_type") || "note", category: optional(text(form,"category")),
    primary_element: text(form,"primary_element") || "未分類", secondary_element: text(form,"secondary_element") || "無",
    tags: splitTags(text(form,"tags")), source_type: optional(text(form,"source_type")), source_reference: optional(text(form,"source_reference")),
    source_article_id: optional(text(form,"source_article_id")), status: text(form,"status") || "inbox",
    maturity_level: text(form,"maturity_level") || "idea", manually_edited: form.get("manually_edited") === "on", is_favorite: form.get("is_favorite") === "on",
  });
}

export async function saveThought(form: FormData) {
  const { db, user } = await requireAdmin();
  try {
    const row = fromForm(form); const id = text(form,"id");
    const payload = { ...row, created_by:user.id, published_at: row.status === "published" ? new Date().toISOString() : null };
    const result = id ? await db.from("ymos_thoughts").update(payload).eq("id", id).select("slug").single() : await db.from("ymos_thoughts").insert(payload).select("slug").single();
    if (result.error) throw result.error;
    revalidatePath("/"); revalidatePath("/thoughts"); revalidatePath("/inbox"); revalidatePath("/topics");
    redirect(`/thoughts/${result.data.slug}`);
  } catch (error) {
    const id = text(form,"id"); const message = error instanceof Error ? error.message : "儲存失敗";
    redirect(`${id ? `/admin/thoughts/${id}/edit` : "/admin/thoughts/new"}?error=${encodeURIComponent(message)}`);
  }
}

export async function quickCreateThought(form: FormData) {
  const { db, user } = await requireAdmin(); const title=text(form,"title"), content=text(form,"content");
  if (!title || !content) redirect(`/?quickError=${encodeURIComponent("標題與內容為必填")}`);
  const { error } = await db.from("ymos_thoughts").insert({ slug:slugifyThought(title), thought_date:new Date().toISOString().slice(0,10), title, content,
    thought_type:"note", status:"inbox", maturity_level:"idea", primary_element:"未分類", secondary_element:"無", tags:splitTags(text(form,"tags")), manually_edited:false, created_by:user.id });
  if (error) redirect(`/?quickError=${encodeURIComponent(error.message)}`);
  revalidatePath("/"); revalidatePath("/inbox"); redirect("/inbox?created=1");
}

export async function deleteThought(form: FormData) {
  const { db } = await requireAdmin(); await db.from("ymos_thoughts").delete().eq("id", text(form,"id"));
  revalidatePath("/thoughts"); redirect("/thoughts?deleted=1");
}

export async function bulkThoughts(form: FormData) {
  const { db } = await requireAdmin(); const ids=form.getAll("ids").map(String); if (!ids.length) redirect("/thoughts");
  const action=text(form,"bulk_action"), value=text(form,"bulk_value");
  if (action === "delete") await db.from("ymos_thoughts").delete().in("id",ids);
  else if (action === "archive") await db.from("ymos_thoughts").update({status:"archived"}).in("id",ids);
  else if (action === "status" && value) await db.from("ymos_thoughts").update({status:value}).in("id",ids);
  else if ((action === "add_tag" || action === "remove_tag") && value) {
    const {data}=await db.from("ymos_thoughts").select("id,tags").in("id",ids);
    await Promise.all((data??[]).map(row=>db.from("ymos_thoughts").update({tags:action==="add_tag"?[...new Set([...(row.tags??[]),value])]:(row.tags??[]).filter((x:string)=>x!==value)}).eq("id",row.id)));
  }
  revalidatePath("/thoughts"); revalidatePath("/inbox"); redirect("/thoughts?updated=1");
}

export async function importThoughts(form: FormData) {
  const { db, user } = await requireAdmin();
  try {
    const parsed=JSON.parse(text(form,"json")); const checks=validateThoughtJson(parsed); const bad=checks.filter(x=>"errors" in x);
    if (bad.length) throw new Error(bad.map(x=>`第 ${x.index+1} 筆：${x.errors?.join("；")}`).join("\n"));
    const rows=checks.map(x=>({ ...x.data!, slug:slugifyThought(x.data!.title), created_by:user.id }));
    const {error}=await db.from("ymos_thoughts").insert(rows); if(error)throw error;
    revalidatePath("/thoughts"); redirect(`/thoughts?imported=${rows.length}`);
  } catch(error) { redirect(`/admin/thoughts/import?error=${encodeURIComponent(error instanceof Error?error.message:"JSON 匯入失敗")}`); }
}
