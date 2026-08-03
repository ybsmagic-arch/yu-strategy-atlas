import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {fromBodyRow} from "@/lib/bodyAtlas";
import type {BodyArticle} from "@/types/bodyArticle";

export default async function BodyArticles({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const p=await searchParams;const db=await createClient();let rows:BodyArticle[]=[];
 if(db){let query=db.from("body_articles").select("*").order("publish_date",{ascending:false});
  if(p.system)query=query.eq("primary_system",p.system);if(p.element)query=query.eq("primary_element",p.element);if(p.axis)query=query.contains("axes",[p.axis]);
  if(p.status)query=query.eq("status",p.status);else query=query.eq("status","published");if(p.date)query=query.eq("publish_date",p.date);if(p.day)query=query.eq("day_number",Number(p.day));
  const {data}=await query;rows=(data??[]).map(x=>fromBodyRow(x as never));if(p.q){const q=p.q.toLowerCase();rows=rows.filter(x=>JSON.stringify(x).toLowerCase().includes(q))}
 }
 return <div className="mx-auto max-w-7xl px-5 py-10"><div className="flex justify-between"><div><p className="eyebrow">BODY ARTICLES</p><h1 className="mt-2 text-4xl">所有器官文章</h1></div><Link href="/admin/body-atlas" className="sans text-sm">管理與匯入</Link></div>
 <form className="card sans mt-8 grid gap-3 p-4 text-sm sm:grid-cols-3 lg:grid-cols-6"><input name="q" defaultValue={p.q} className="field !mt-0" placeholder="器官、疾病、證型、神經、標籤…"/><input name="system" defaultValue={p.system} className="field !mt-0" placeholder="人體系統"/><select name="element" defaultValue={p.element??""} className="field !mt-0"><option value="">全部五行</option>{["木","火","土","金","水"].map(x=><option key={x}>{x}</option>)}</select><input name="axis" defaultValue={p.axis} className="field !mt-0" placeholder="Axis"/><select name="status" defaultValue={p.status??""} className="field !mt-0"><option value="">已發布</option><option value="pending_review">待審核</option><option value="draft">草稿</option></select><input type="date" name="date" defaultValue={p.date} className="field !mt-0"/><input type="number" name="day" defaultValue={p.day} className="field !mt-0" placeholder="篇次"/><button className="bg-[#34423a] px-4 py-2 text-white">搜尋篩選</button></form>
 <div className="mt-8 grid gap-4 md:grid-cols-2">{rows.map(x=><Link href={`/body-atlas/articles/${x.slug}`} className="card p-6" key={x.id}><p className="eyebrow">DAY {x.dayNumber} · {x.publishDate}</p><h2 className="mt-3 text-2xl">{x.organNameZh} <small className="text-base text-[#72806b]">{x.organNameEn}</small></h2><p className="sans mt-3 text-sm leading-6 text-[#596258]">{x.summary}</p><div className="mt-4 flex flex-wrap gap-2"><span className="badge">{x.primarySystem}</span><span className="badge">{x.primaryElement}</span><span className="badge">{x.status}</span></div></Link>)}</div>{!rows.length&&<div className="card mt-8 p-12 text-center"><h2 className="text-2xl">沒有符合條件的文章</h2><p className="sans mt-3 text-sm text-[#6d706b]">可清除篩選或由管理後台匯入內容。</p></div>}</div>
}
