import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "@/app/admin/actions";

const groups=[
 {title:"內容工作",items:[["/inbox","審核與發布"],["/admin/research","研究文章匯入"],["/admin/tcm","中醫資料匯入"],["/admin/articles/new","建立案例文章"]]},
 {title:"網站管理",items:[["/admin/sites","網站戶籍管理"],["/admin/links","好站連結管理"],["/sites?view=incubator","網站孵化檢視"]]},
 {title:"系統與帳號",items:[["/admin/account","修改密碼"],["/search","全站搜尋"],["/topics","主題標籤"]]},
] as const;
export default async function Admin(){await requireAdmin();return <div className="mx-auto max-w-6xl px-5 py-14"><p className="eyebrow">YMOS ADMINISTRATION</p><div className="mt-3 flex flex-wrap items-end justify-between gap-5"><div><h1 className="text-4xl">管理中心</h1><p className="sans mt-3 text-sm text-[#6d706b]">編修、審核與系統工具集中於此；既有權限邊界維持不變。</p></div><form action={signOut}><button className="sans border border-[#34423a]/25 px-4 py-2 text-sm">安全登出</button></form></div><div className="mt-12 grid gap-10 md:grid-cols-3">{groups.map(group=><section key={group.title}><h2 className="border-b border-[#b59962]/60 pb-3 text-xl">{group.title}</h2><div className="mt-2">{group.items.map(([href,label])=><Link prefetch={false} href={href} key={label} className="sans block border-b border-[#34423a]/10 py-4 text-sm">{label} <span className="float-right text-[#72806b]">→</span></Link>)}</div></section>)}</div></div>}
