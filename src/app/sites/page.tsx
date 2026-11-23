import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { parseSiteMetadata, SITE_SOURCE_TYPE, siteLifecycleLabels, siteLifecycles } from "@/lib/site-registry";

type Row={id:string;title:string;url:string;description:string;category:string;tags:string[];notes:string|null;status:string};
export default async function Sites({searchParams}:{searchParams:Promise<{category?:string;tag?:string;lifecycle?:string;view?:string}>}){
  const db=await createClient();const p=await searchParams;
  const {data}=db?await db.from("reference_links").select("id,title,url,description,category,tags,notes,status").eq("source_type",SITE_SOURCE_TYPE).eq("status","active").order("updated_at",{ascending:false}):{data:[]};
  const incubating=new Set(["idea","building","candidate"]);const all=(data??[]) as Row[];const rows=all.filter(x=>{const meta=parseSiteMetadata(x.notes);return (!p.category||x.category===p.category)&&(!p.tag||x.tags?.includes(p.tag))&&(!p.lifecycle||meta?.lifecycle===p.lifecycle)&&(p.view!=="incubator"||!!meta&&incubating.has(meta.lifecycle))});
  const categories=[...new Set(all.map(x=>x.category))];const tags=[...new Set(all.flatMap(x=>x.tags??[]))];
  return <div className="mx-auto max-w-7xl px-5 py-12"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">YU WEBSITE REGISTRY</p><h1 className="mt-3 text-4xl">{p.view==="incubator"?"網站孵化":"余氏網站戶籍中心"}</h1><p className="sans mt-4 max-w-3xl leading-7 text-[#596258]">{p.view==="incubator"?"沿用網站戶籍既有生命週期，聚焦構想中、建置中與 Candidate；不建立新的任務系統。":"登記獨立網站的入口、定位、知識主題與關聯。各站仍維持自己的內容、會員、授權與運作。"}</p></div><Link href="/admin/sites" className="sans border px-4 py-2 text-sm">管理網站戶籍</Link></div>
    <nav className="sans mt-8 flex flex-wrap gap-2 text-sm"><Link href="/sites" className="badge">全部戶籍</Link><Link href="/sites?view=incubator" className="badge">孵化中</Link>{categories.map(x=><Link key={x} href={`/sites?category=${encodeURIComponent(x)}`} className="badge">{x}</Link>)}{siteLifecycles.map(x=><Link key={x} href={`/sites?lifecycle=${x}`} className="badge">{siteLifecycleLabels[x]}</Link>)}</nav>
    <div className="mt-4 flex flex-wrap gap-2">{tags.map(x=><Link key={x} href={`/sites?tag=${encodeURIComponent(x)}`} className="badge">#{x}</Link>)}</div>
    <p className="sans mt-6 text-sm text-[#6d706b]">顯示 {rows.length} 個網站節點</p><div className="mt-6 grid gap-5 md:grid-cols-2">{rows.map(x=>{const meta=parseSiteMetadata(x.notes);return <article className="card p-6" key={x.id}><div className="flex flex-wrap gap-2"><span className="badge">{x.category}</span>{meta&&<span className="badge">{siteLifecycleLabels[meta.lifecycle]}</span>}</div><h2 className="mt-4 text-2xl"><a href={x.url} target="_blank" rel="noreferrer">{x.title} ↗</a></h2><p className="sans mt-4 text-sm leading-7">{x.description}</p><div className="mt-4 flex flex-wrap gap-2">{x.tags?.map(tag=><span className="badge" key={tag}>#{tag}</span>)}</div>{meta?.relations.length?<p className="sans mt-5 text-sm"><b>關聯網站：</b>{meta.relations.join("、")}</p>:null}<p className="sans mt-4 break-all text-xs text-[#6d706b]">{x.url}</p></article>})}</div>
    {!rows.length&&<div className="card mt-8 p-12 text-center"><h2 className="text-2xl">沒有符合條件的網站節點</h2><p className="sans mt-3 text-sm">既有知識好站與中醫好站仍保留在原清單。</p></div>}
  </div>;
}
