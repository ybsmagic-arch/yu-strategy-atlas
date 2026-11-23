import Link from "next/link";
import { createSiteRegistryEntry, updateSiteRegistryEntry } from "@/app/link-actions";
import { KnowledgeRelationsEditor } from "@/components/knowledge-relations-editor";
import { requireAdmin } from "@/lib/auth";
import { knowledgeApprovalLabels, parseSiteMetadata, SITE_SOURCE_TYPE, siteLifecycleLabels, siteLifecycles } from "@/lib/site-registry";

const field="field";
type Row={id:string;title:string;url:string;description:string;category:string;tags:string[];notes:string|null;status:string;updated_at:string};

function SiteForm({row}:{row?:Row}){
  const meta=parseSiteMetadata(row?.notes)??{lifecycle:"idea" as const,relations:[],note:"",knowledgeRelationsVersion:1 as const,knowledgeRelations:[]};
  const action=row?updateSiteRegistryEntry:createSiteRegistryEntry;
  return <form action={action} className="card sans space-y-4 p-6 text-sm">
    <div className="flex items-center justify-between"><h2 className="font-serif text-2xl">{row?"編輯網站戶籍":"登記網站節點"}</h2>{row&&<Link href="/admin/sites" className="text-xs underline">取消編輯</Link>}</div>
    {row&&<input type="hidden" name="id" value={row.id}/>}<label className="block">網站名稱<input name="title" required maxLength={160} defaultValue={row?.title} className={field}/></label>
    <label className="block">正式入口（HTTPS）<input name="url" type="url" pattern="https://.*" required defaultValue={row?.url} placeholder="https://..." className={field}/></label>
    <div className="grid gap-4 sm:grid-cols-2"><label>網站分類<select name="category" defaultValue={row?.category??"知識網站"} className={field}><option>教室</option><option>知識網站</option><option>專題網站</option></select></label><label>生命週期<select name="lifecycle" defaultValue={meta.lifecycle} className={field}>{siteLifecycles.map(x=><option value={x} key={x}>{siteLifecycleLabels[x]}</option>)}</select></label></div>
    <label className="block">網站定位與摘要<textarea name="description" required maxLength={3000} rows={4} defaultValue={row?.description} className={field}/></label>
    <label className="block">知識標籤<input name="tags" maxLength={1000} defaultValue={row?.tags?.join("、")} placeholder="針灸、耳穴、經絡" className={field}/></label>
    <label className="block">關聯網站（逗號或換行分隔）<textarea name="relations" maxLength={2000} rows={3} defaultValue={meta.relations.join("、")} placeholder="余氏針灸學、93 穴育苗園" className={field}/></label>
    <label className="block">補充資訊<textarea name="note" maxLength={2000} rows={3} defaultValue={meta.note} className={field}/></label>
    <KnowledgeRelationsEditor initialRelations={meta.knowledgeRelations}/>
    <p className="text-xs text-[#6d706b]">連結狀態維持既有語意，不在此處修改；生命週期獨立儲存在版本化 notes metadata。</p>
    <button className="bg-[#34423a] px-5 py-3 text-white">{row?"更新網站戶籍":"保存網站戶籍"}</button>
  </form>;
}

export default async function SitesAdmin({searchParams}:{searchParams:Promise<{error?:string;saved?:string;updated?:string;edit?:string}>}){
  const {db}=await requireAdmin();const p=await searchParams;
  const {data}=await db.from("reference_links").select("id,title,url,description,category,tags,notes,status,updated_at").eq("source_type",SITE_SOURCE_TYPE).order("updated_at",{ascending:false});
  const rows=(data??[]) as Row[];const editing=rows.find(x=>x.id===p.edit);
  return <div className="mx-auto max-w-7xl px-5 py-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">YU WEBSITE REGISTRY</p><h1 className="mt-2 text-4xl">網站戶籍中心</h1><p className="sans mt-3 text-sm text-[#596258]">只登記網站身分、入口、主題與關聯；不代理登入、會員、教材或授權。</p></div><Link href="/sites" className="sans border px-4 py-2 text-sm">查看網站清單</Link></div>
    {p.error&&<p className="sans mt-5 whitespace-pre-wrap border border-red-700/30 p-4 text-red-900">{p.error}</p>}{(p.saved||p.updated)&&<p className="sans mt-5 bg-[#dce0d4] p-4">網站戶籍已{p.updated?"更新":"保存"}。</p>}
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.25fr]"><SiteForm row={editing}/><section className="card overflow-x-auto"><table className="work-table"><thead><tr><th>分類／生命週期</th><th>網站</th><th>知識關聯</th><th>連結狀態</th><th>操作</th></tr></thead><tbody>{rows.map(x=>{const meta=parseSiteMetadata(x.notes);return <tr key={x.id}><td>{x.category}<br/><small>{meta?siteLifecycleLabels[meta.lifecycle]:"metadata 格式錯誤"}</small></td><td><a href={x.url} target="_blank" rel="noreferrer">{x.title} ↗</a><br/><small>{x.tags?.join("、")||"無標籤"}</small>{meta?.relations.length?<p className="mt-2 text-xs">關聯：{meta.relations.join(" ↔ ")}</p>:null}</td><td>{meta?.knowledgeRelations.length ? <ul className="space-y-1 text-xs">{meta.knowledgeRelations.map(relation=><li key={`${relation.sourceType}:${relation.knowledgeId}:${relation.route}`}>{relation.displayName} · {knowledgeApprovalLabels[relation.approvalStatus]}</li>)}</ul> : <small>尚無關聯</small>}</td><td>{x.status}</td><td><Link href={`/admin/sites?edit=${x.id}`} className="border px-2 py-1 text-xs">編輯</Link></td></tr>})}</tbody></table>{!rows.length&&<p className="sans p-10 text-center">尚無網站戶籍；既有好站資料不會出現在此清單。</p>}</section></div>
  </div>;
}

