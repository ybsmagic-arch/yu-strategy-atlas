import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { libraryMeta, researchLibraries, type ResearchLibrary } from "@/types/research";

export default async function Dashboard() {
  const db=await createClient(); if(!db)redirect("/admin/login?error=config"); const {data:auth}=await db.auth.getUser(); if(!auth.user)redirect("/admin/login");
  const [{data:rows},{count:pending},{count:published},{count:drafts},{data:recent}]=await Promise.all([
    db.from("research_articles").select("library,status"),
    db.from("research_articles").select("id",{count:"exact",head:true}).eq("status","pending_review"),
    db.from("research_articles").select("id",{count:"exact",head:true}).eq("status","published"),
    db.from("research_articles").select("id",{count:"exact",head:true}).eq("status","draft"),
    db.from("research_articles").select("id,slug,title,library,article_type,research_date,status,updated_at").order("updated_at",{ascending:false}).limit(8),
  ]);
  const counts=new Map<string,number>();for(const row of rows??[])counts.set(row.library,(counts.get(row.library)??0)+1);
  return <div className="mx-auto max-w-7xl px-5 py-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">YMOS KNOWLEDGE OS</p><h1 className="mt-2 text-4xl">知識工作台</h1><p className="sans mt-3 text-sm text-[#6d706b]">六大研究庫收集世界，YMOS 取經總整理解讀世界。</p></div><div className="sans flex gap-3 text-sm"><Link href="/admin/research" className="bg-[#34423a] px-5 py-3 text-white">匯入新文章</Link><Link href="/ymos-takeaways" className="border px-5 py-3">YMOS 取經</Link></div></div>
  <section className="mt-9 grid grid-cols-3 gap-3"><div className="card p-5"><p className="sans text-xs text-[#6d706b]">待審核</p><b className="mt-2 block text-3xl font-normal">{pending??0}</b></div><div className="card p-5"><p className="sans text-xs text-[#6d706b]">已發布</p><b className="mt-2 block text-3xl font-normal">{published??0}</b></div><div className="card p-5"><p className="sans text-xs text-[#6d706b]">草稿</p><b className="mt-2 block text-3xl font-normal">{drafts??0}</b></div></section>
  <section className="mt-10"><div className="flex justify-between"><h2 className="text-3xl">六大研究知識庫</h2><Link href="/research" className="sans text-sm">總覽 →</Link></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{researchLibraries.map(key=><Link href={`/research/${key}`} className="card p-6" key={key}><div className="flex justify-between"><p className="eyebrow">LIBRARY {libraryMeta[key].number}</p><span className="badge">{counts.get(key)??0} 篇</span></div><h3 className="mt-3 text-2xl">{libraryMeta[key].title}</h3><p className="sans mt-3 text-sm leading-6 text-[#596258]">{libraryMeta[key].description}</p></Link>)}</div></section>
  <section className="card mt-8 border-l-4 border-l-[#72806b] p-7"><p className="eyebrow">PARALLEL AI DATA SYSTEM</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-3xl">中醫藥 AI 知識基礎系統</h2><p className="sans mt-3 max-w-3xl text-sm leading-7">中藥、方劑、十二經絡、十四經穴、耳穴、董氏奇穴、病證、古籍、名醫與醫案的標準化 AI 資料。</p></div><Link href="/tcm" className="sans border px-5 py-3 text-sm">進入系統 →</Link></div></section>
  <section className="mt-10"><div className="flex justify-between"><h2 className="text-2xl">最近文章</h2><Link href="/inbox" className="sans text-sm">審核工作台 →</Link></div><div className="card mt-4 overflow-x-auto"><table className="work-table"><thead><tr><th>日期</th><th>知識庫</th><th>文章</th><th>狀態</th></tr></thead><tbody>{recent?.map(x=><tr key={x.id}><td>{x.research_date}</td><td>{libraryMeta[x.library as ResearchLibrary]?.title}</td><td><Link href={`/research/${x.library}/${x.slug}`}>{x.title}</Link></td><td>{x.status}</td></tr>)}</tbody></table>{!recent?.length&&<p className="sans p-10 text-center">尚無統一研究文章，請從「匯入新文章」開始。</p>}</div></section></div>;
}
