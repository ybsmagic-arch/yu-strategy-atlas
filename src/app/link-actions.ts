"use server";
import {revalidatePath} from "next/cache";import {redirect} from "next/navigation";import {z} from "zod";import {requireAdmin} from "@/lib/auth";import {SITE_SOURCE_TYPE,siteFormSchema,siteFormToRecord} from "@/lib/site-registry";
const schema=z.object({collection:z.enum(["knowledge","tcm"]),title:z.string().min(1),url:z.string().url(),publisher:z.string().optional(),description:z.string().min(1),category:z.string().min(1),tags:z.string().optional(),language:z.string().min(1),source_type:z.string().optional(),reliability:z.enum(["primary","authoritative","useful","unreviewed","caution"]),ai_use:z.enum(["reference","rag","fact-check","discovery","do-not-train"]),notes:z.string().optional()});
const val=(f:FormData,k:string)=>String(f.get(k)??"").trim();
export async function createReferenceLink(form:FormData){const {db,user}=await requireAdmin();const result=schema.safeParse(Object.fromEntries([...form.entries()].map(([k,v])=>[k,String(v)])));if(!result.success)redirect(`/admin/links?error=${encodeURIComponent(result.error.issues.map(x=>`${x.path.join(".")}：${x.message}`).join("\n"))}`);const x=result.data;const {error}=await db.from("reference_links").insert({...x,publisher:x.publisher||null,source_type:x.source_type||null,notes:x.notes||null,tags:(x.tags??"").split(/[、,，]/).map(t=>t.trim()).filter(Boolean),created_by:user.id});if(error)redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);revalidatePath("/links/knowledge");revalidatePath("/links/tcm");redirect(`/admin/links?saved=${x.collection}`)}
export async function updateReferenceStatus(form:FormData){const {db}=await requireAdmin();const status=val(form,"status");if(!["active","broken","archived"].includes(status))redirect("/admin/links?error=invalid-status");const {error}=await db.from("reference_links").update({status}).eq("id",val(form,"id"));if(error)redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);revalidatePath("/links/knowledge");revalidatePath("/links/tcm");redirect("/admin/links?updated=1")}

function sitePayload(form:FormData){
  const parsed=siteFormSchema.safeParse(Object.fromEntries([...form.entries()].map(([k,v])=>[k,String(v)])));
  if(!parsed.success) return {error:parsed.error.issues.map(x=>`${x.path.join(".")}：${x.message}`).join("\n")} as const;
  return {data:siteFormToRecord(parsed.data)} as const;
}

export async function createSiteRegistryEntry(form:FormData){
  const {db,user}=await requireAdmin();const result=sitePayload(form);if("error" in result)redirect(`/admin/sites?error=${encodeURIComponent(result.error??"invalid-site-data")}`);
  const {error}=await db.from("reference_links").insert({...result.data,created_by:user.id});
  if(error)redirect(`/admin/sites?error=${encodeURIComponent(error.message)}`);revalidatePath("/sites");redirect("/admin/sites?saved=1");
}

export async function updateSiteRegistryEntry(form:FormData){
  const {db}=await requireAdmin();const id=z.string().uuid().safeParse(val(form,"id"));if(!id.success)redirect("/admin/sites?error=invalid-id");
  const result=sitePayload(form);if("error" in result)redirect(`/admin/sites?error=${encodeURIComponent(result.error??"invalid-site-data")}`);
  const {error}=await db.from("reference_links").update(result.data).eq("id",id.data).eq("source_type",SITE_SOURCE_TYPE);
  if(error)redirect(`/admin/sites?error=${encodeURIComponent(error.message)}`);revalidatePath("/sites");redirect("/admin/sites?updated=1");
}
