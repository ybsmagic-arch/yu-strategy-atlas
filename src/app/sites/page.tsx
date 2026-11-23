import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { approvedKnowledgeRelations, parseSiteMetadata, SITE_SOURCE_TYPE, siteLifecycleLabels, siteLifecycles } from "@/lib/site-registry";
import { measureTiming } from "@/lib/timing-diagnostics";

type SiteSearchParams = { category?: string; tag?: string; lifecycle?: string; view?: string };
type Row = { id: string; title: string; url: string; description: string; category: string; tags: string[]; notes: string | null; status: string };

const knowledgeLinkDemo = [
  {
    site: "余氏針灸學",
    category: "針灸教學網站",
    description: "由網站戶籍進入 YMOS 的中醫藥、穴位與經絡知識書架；只提供導航，不讀取或複製教室教材。",
    links: [
      { href: "/tcm", label: "中醫藥知識系統", detail: "中醫藥標準知識入口" },
      { href: "/tcm/acupoint", label: "十四經穴", detail: "穴位標準 ID、定位與知識關聯" },
      { href: "/tcm/meridian", label: "十二經絡", detail: "經絡循行、臟腑與所屬穴位" },
    ],
  },
  {
    site: "行走的教室",
    category: "數位教室",
    description: "由獨立教室入口連回 YMOS 研究書架，協助找到跨領域研究；不介入教室登入、會員或課程授權。",
    links: [
      { href: "/research", label: "六大研究知識庫", detail: "六座研究書架總入口" },
      { href: "/research/medical-research", label: "醫療研究", detail: "人體、系統、生理軸與醫療專題" },
      { href: "/research/world-therapies", label: "世界療法收集", detail: "中西醫與各地療法研究入口" },
    ],
  },
] as const;

function RegistryLoading() {
  return <div className="card mt-8 p-12 text-center" role="status"><h2 className="text-2xl">網站戶籍載入中</h2><p className="sans mt-3 text-sm">入口已可使用，正在讀取網站節點與篩選。</p></div>;
}

function KnowledgeLinkDemo() {
  return <section className="mt-10 border-y border-[#b59962]/40 py-8" aria-labelledby="knowledge-link-demo-title">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">CANDIDATE DEMO · 示範資料</p><h2 id="knowledge-link-demo-title" className="mt-2 text-3xl">網站 × 知識書架</h2></div><p className="sans max-w-xl text-sm leading-6 text-[#596258]">以下內容為 Preview 靜態展示，不來自 `reference_links`，不會寫入或更動正式網站戶籍。</p></div>
    <div className="mt-6 grid gap-5 lg:grid-cols-2">{knowledgeLinkDemo.map((item) => <article className="card border-l-4 border-l-[#b59962] p-6" key={item.site}>
      <div className="flex flex-wrap gap-2"><span className="badge">示範資料</span><span className="badge">{item.category}</span></div>
      <h3 className="mt-4 text-2xl">{item.site}</h3>
      <p className="sans mt-3 text-sm leading-7 text-[#596258]">{item.description}</p>
      <div className="sans mt-5 space-y-2">{item.links.map((link) => <Link prefetch={false} href={link.href} className="block border-t border-[#d8c9aa] py-3 first:border-t-0" key={link.href}><span className="font-medium underline decoration-[#b59962] underline-offset-4">{link.label} →</span><span className="mt-1 block text-xs text-[#6d706b]">{link.detail}</span></Link>)}</div>
    </article>)}</div>
  </section>;
}

async function RegistryResults({ params }: { params: SiteSearchParams }) {
  const db = await createClient();
  if (!db) return <div className="card mt-8 p-12 text-center"><h2 className="text-2xl">網站戶籍暫時無法讀取</h2><p className="sans mt-3 text-sm">資料服務尚未設定完成，請稍後再試。</p></div>;

  const { data, error } = await measureTiming("sites_registry_query", async () => await db
    .from("reference_links")
    .select("id,title,url,description,category,tags,notes,status")
    .eq("source_type", SITE_SOURCE_TYPE)
    .eq("status", "active")
    .order("updated_at", { ascending: false }));

  if (error) return <div className="card mt-8 p-12 text-center"><h2 className="text-2xl">網站戶籍讀取失敗</h2><p className="sans mt-3 text-sm">入口仍可使用，請稍後重新整理資料區。</p></div>;

  const incubating = new Set(["idea", "building", "candidate"]);
  const all = (data ?? []) as Row[];
  const rows = all.filter((item) => {
    const meta = parseSiteMetadata(item.notes);
    return (!params.category || item.category === params.category)
      && (!params.tag || item.tags?.includes(params.tag))
      && (!params.lifecycle || meta?.lifecycle === params.lifecycle)
      && (params.view !== "incubator" || !!meta && incubating.has(meta.lifecycle));
  });
  const categories = [...new Set(all.map((item) => item.category))];
  const tags = [...new Set(all.flatMap((item) => item.tags ?? []))];

  return <>
    <nav className="sans mt-8 flex flex-wrap gap-2 text-sm">{categories.map((category) => <Link prefetch={false} key={category} href={`/sites?category=${encodeURIComponent(category)}`} className="badge">{category}</Link>)}</nav>
    <div className="mt-4 flex flex-wrap gap-2">{tags.map((tag) => <Link prefetch={false} key={tag} href={`/sites?tag=${encodeURIComponent(tag)}`} className="badge">#{tag}</Link>)}</div>
    <p className="sans mt-6 text-sm text-[#6d706b]">顯示 {rows.length} 個網站節點</p>
    <div className="mt-6 grid gap-5 md:grid-cols-2">{rows.map((item) => {
      const meta = parseSiteMetadata(item.notes);
      const approvedKnowledge = approvedKnowledgeRelations(meta);
      return <article className="card p-6" key={item.id}><div className="flex flex-wrap gap-2"><span className="badge">{item.category}</span>{meta && <span className="badge">{siteLifecycleLabels[meta.lifecycle]}</span>}</div><h2 className="mt-4 text-2xl"><a href={item.url} target="_blank" rel="noreferrer">{item.title} ↗</a></h2><p className="sans mt-4 text-sm leading-7">{item.description}</p><div className="mt-4 flex flex-wrap gap-2">{item.tags?.map((tag) => <span className="badge" key={tag}>#{tag}</span>)}</div>{meta?.relations.length ? <p className="sans mt-5 text-sm"><b>關聯網站：</b>{meta.relations.join("、")}</p> : null}{approvedKnowledge.length ? <div className="sans mt-5 border-t pt-4 text-sm"><b>知識入口</b><ul className="mt-2 space-y-2">{approvedKnowledge.map((relation) => <li key={`${relation.sourceType}:${relation.knowledgeId}:${relation.route}`}><Link prefetch={false} className="underline" href={relation.route}>{relation.displayName} →</Link></li>)}</ul></div> : null}<p className="sans mt-4 break-all text-xs text-[#6d706b]">{item.url}</p></article>;
    })}</div>
    {!rows.length && <div className="card mt-8 p-12 text-center"><h2 className="text-2xl">沒有符合條件的網站節點</h2><p className="sans mt-3 text-sm">既有知識好站與中醫好站仍保留在原清單。</p></div>}
  </>;
}

export default async function Sites({ searchParams }: { searchParams: Promise<SiteSearchParams> }) {
  const params = await searchParams;
  return <div className="mx-auto max-w-7xl px-5 py-12">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">YU WEBSITE REGISTRY</p><h1 className="mt-3 text-4xl">{params.view === "incubator" ? "網站孵化" : "余氏網站戶籍中心"}</h1><p className="sans mt-4 max-w-3xl leading-7 text-[#596258]">{params.view === "incubator" ? "沿用網站戶籍既有生命週期，聚焦構想中、建置中與 Candidate；不建立新的任務系統。" : "登記獨立網站的入口、定位、知識主題與關聯。各站仍維持自己的內容、會員、授權與運作。"}</p></div><Link prefetch={false} href="/admin/sites" className="sans border px-4 py-2 text-sm">管理網站戶籍</Link></div>
    <nav className="sans mt-8 flex flex-wrap gap-2 text-sm"><Link prefetch={false} href="/sites" className="badge">全部戶籍</Link><Link prefetch={false} href="/sites?view=incubator" className="badge">孵化中</Link>{siteLifecycles.map((lifecycle) => <Link prefetch={false} key={lifecycle} href={`/sites?lifecycle=${lifecycle}`} className="badge">{siteLifecycleLabels[lifecycle]}</Link>)}</nav>
    <KnowledgeLinkDemo />
    <Suspense fallback={<RegistryLoading />}><RegistryResults params={params} /></Suspense>
  </div>;
}
