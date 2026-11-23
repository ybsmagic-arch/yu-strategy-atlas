import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function Dashboard() {
  const user=await getCurrentUser();if(!user)redirect("/admin/login");
  const entrances=[
    {href:"/sites",number:"壹",title:"網站戶籍",text:"登記與管理余氏知識網站的身分、入口與關聯。"},
    {href:"/sites?view=incubator",number:"貳",title:"網站孵化",text:"沿用既有生命週期，看見構想、建置與 Candidate。"},
    {href:"/research",number:"參",title:"知識系統",text:"六大研究庫、中醫藥、好站與跨領域取經。"},
    {href:"/admin",number:"肆",title:"管理中心",text:"審核、發布、匯入、連結與帳號安全。"},
  ];
  return <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20"><section className="max-w-3xl"><p className="eyebrow">YMOS QUIET STUDY</p><h1 className="mt-5 text-5xl leading-tight sm:text-7xl">御書房</h1><p className="mt-6 text-2xl leading-relaxed text-[#596258]">藏萬卷於內，<br className="sm:hidden"/>留一室清明於外。</p><div className="rule mt-10 max-w-md"/><p className="sans mt-8 max-w-2xl text-sm leading-8 text-[#6d706b]">余氏總知識網站管理中心。入口保持安靜，完整知識、網站節點與專業工具仍在書架深處，各自獨立運作。</p></section><section className="mt-16 border-t border-[#34423a]/15" aria-label="主要工作入口">{entrances.map(x=><Link prefetch={false} href={x.href} key={x.title} className="quiet-row group grid gap-2 border-b border-[#34423a]/15 py-7 sm:grid-cols-[4rem_13rem_1fr_auto] sm:items-center"><span className="text-sm text-[#b59962]">{x.number}</span><h2 className="text-2xl">{x.title}</h2><p className="sans text-sm leading-7 text-[#6d706b]">{x.text}</p><span aria-hidden="true" className="text-[#72806b] transition-transform group-hover:translate-x-1">→</span></Link>)}</section></div>;
}
