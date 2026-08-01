import Link from "next/link";
import { FileJson2,FilePlus2 } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function AdminPage({searchParams}:{searchParams:Promise<{created?:string}>}){
 const db=await createClient();if(!db)redirect("/admin/login?error=config");const {data:auth}=await db.auth.getUser();if(!auth.user)redirect("/admin/login");
 const [{data:legacy},{data:complete}]=await Promise.all([db.from("articles").select("id,title,publish_date,status,slug").order("publish_date",{ascending:false}),db.from("strategy_cases").select("id,title,case_date,status,slug").order("case_date",{ascending:false})]);
 const {created}=await searchParams;
 return <div className="max-w-6xl mx-auto px-5 py-16"><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5"><div><p className="eyebrow">EDITORIAL DESK</p><h1 className="text-4xl mt-3">管理後台</h1><p className="sans text-sm text-[#6d706b] mt-4">已登入：{auth.user.email}</p></div><div className="flex flex-wrap gap-3"><form action={signOut}><button className="sans px-4 py-3 border border-[#34423a]/30 text-sm">登出</button></form><Link href="/admin/articles/new" className="sans px-5 py-3 border border-[#34423a]/30 text-sm inline-flex items-center gap-2"><FilePlus2 size={16}/>舊版 Markdown</Link><Link href="/admin/import-case" className="sans px-5 py-3 bg-[#34423a] !text-white text-sm inline-flex items-center gap-2"><FileJson2 size={16}/>完整案例匯入</Link></div></div>
 {created&&<p className="sans mt-8 p-4 bg-[#dce0d4]">文章已{created==="published"?"發布":"儲存為草稿"}。</p>}
 <h2 className="text-2xl mt-12">完整 StrategyCase</h2><div className="mt-5 border border-[#34423a]/15"><div className="grid grid-cols-[110px_1fr_110px] p-4 sans text-xs text-[#6d706b] border-b"><span>日期</span><span>標題</span><span>狀態</span></div>{complete?.length?complete.map(row=><Link href={`/admin/strategy-cases/${row.slug}`} key={row.id} className="grid grid-cols-[110px_1fr_110px] p-4 border-b last:border-0"><span className="sans text-xs">{row.case_date}</span><span>{row.title}</span><span className="sans text-xs">{row.status}</span></Link>):<p className="sans text-sm text-center p-10 text-[#6d706b]">尚無完整案例，請使用 JSON 匯入。</p>}</div>
 <h2 className="text-2xl mt-12">既有文章</h2><div className="mt-5 border border-[#34423a]/15"><div className="grid grid-cols-[110px_1fr_90px] p-4 sans text-xs text-[#6d706b] border-b"><span>日期</span><span>標題</span><span>狀態</span></div>{legacy?.length?legacy.map(row=><div key={row.id} className="grid grid-cols-[110px_1fr_90px] p-4 border-b last:border-0"><span className="sans text-xs">{row.publish_date}</span><span>{row.title}</span><span className="sans text-xs">{row.status}</span></div>):<p className="sans text-sm text-center p-10 text-[#6d706b]">尚無既有文章。</p>}</div></div>;
}
