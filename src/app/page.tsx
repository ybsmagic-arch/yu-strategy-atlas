import Link from "next/link";
import { ArrowRight, Building2, Crown, Sparkles } from "lucide-react";
import { articles } from "@/data/articles";
import { ArticleCard } from "@/components/article-card";

export default function Home() { const today=articles[0]; return <>
  <section className="max-w-7xl mx-auto px-5 pt-16 sm:pt-24 pb-16 grid lg:grid-cols-[1.15fr_.85fr] gap-12 items-end">
    <div><p className="eyebrow mb-7">DAILY CASE STUDY · 每日一案</p><h1 className="text-4xl sm:text-6xl xl:text-7xl leading-[1.22] tracking-[.02em]">從案例裡，<br/><span className="text-[#72806b]">看見系統的形狀。</span></h1><p className="sans text-[#6d706b] max-w-xl mt-8 leading-8">以企業、歷史政權與文化 IP 為三面鏡，結合兵法與 YMOS 六層架構，為每一天留下可行動的策略判讀。</p></div>
    <div className="relative border-l border-[#b59962]/60 pl-7 sm:pl-10 pb-2"><p className="eyebrow">今日案例 · {today.publishedAt}</p><h2 className="text-2xl sm:text-3xl leading-relaxed mt-4">{today.title}</h2><Link href={`/articles/${today.slug}`} className="sans mt-6 inline-flex items-center gap-3 text-sm text-[#60705b]">閱讀完整研究 <ArrowRight size={16}/></Link></div>
  </section>
  <div className="rule max-w-7xl mx-auto"/>
  <section className="max-w-7xl mx-auto px-5 py-20"><div className="flex justify-between items-end mb-10"><div><p className="eyebrow">THREE LENSES</p><h2 className="text-3xl mt-3">三大案例入口</h2></div></div><div className="grid md:grid-cols-3 gap-4">
    {[[Building2,"企業案例","看商業飛輪、收入結構與組織韌性","/companies"],[Crown,"政權／領導者","看困局、用人、制度與歷史代價","/leaders"],[Sparkles,"IP 案例","看敘事、社群、變現與長紅機制","/ips"]].map(([Icon,title,desc,href])=>{const I=Icon as typeof Building2;return <Link href={href as string} key={title as string} className="card min-h-64 p-8 flex flex-col justify-between"><I className="text-[#9b7d46]"/><div><h3 className="text-2xl">{title as string}</h3><p className="sans mt-3 text-sm text-[#6d706b]">{desc as string}</p></div></Link>})}
  </div></section>
  <section className="bg-[#34423a] text-[#f5f1e8]"><div className="max-w-7xl mx-auto px-5 py-20 grid lg:grid-cols-[1fr_2fr] gap-12"><div><p className="eyebrow !text-[#c6b180]">LATEST RESEARCH</p><h2 className="text-3xl mt-3">最新研究</h2><p className="sans text-sm text-[#c7ccc5] mt-5 leading-7">每日完整研究，讓不同時代的成功與代價彼此映照。</p><Link href="/articles" className="sans inline-flex mt-8 gap-2 items-center text-sm">查看全部 <ArrowRight size={15}/></Link></div><div className="grid md:grid-cols-2 gap-5">{articles.map(a=><ArticleCard key={a.id} article={a}/>)}</div></div></section>
  <section className="max-w-7xl mx-auto px-5 py-20"><p className="eyebrow text-center">THIS MONTH</p><h2 className="text-3xl text-center mt-3">本月案例脈絡</h2><div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-12">{[["31","完整研究"],["28","企業與組織"],["24","政權與人物"],["6","YMOS 六層"]].map(([n,l])=><div key={l} className="text-center py-8 border-y border-[#34423a]/15"><b className="text-4xl font-normal text-[#72806b]">{n}</b><p className="sans text-xs mt-3 text-[#6d706b] tracking-wider">{l}</p></div>)}</div></section>
  </> }
