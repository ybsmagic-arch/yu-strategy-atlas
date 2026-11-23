import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { parseSiteMetadata, SITE_SOURCE_TYPE, siteLifecycleLabels, siteLifecycles } from "@/lib/site-registry";
import { measureTiming } from "@/lib/timing-diagnostics";

type SiteSearchParams = { category?: string; tag?: string; lifecycle?: string; view?: string };
type Row = { id: string; title: string; url: string; description: string; category: string; tags: string[]; notes: string | null; status: string };

function RegistryLoading() {
  return <div className="card mt-8 p-12 text-center" role="status"><h2 className="text-2xl">網站戶籍載入中</h2><p className="sans mt-3 text-sm">入口已可使用，正在讀取網站節點與篩選。</p></div>;
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
      return <article className="card p-6" key={item.id}><div className="flex flex-wrap gap-2"><span className="badge">{item.category}</span>{meta && <span className="badge">{siteLifecycleLabels[meta.lifecycle]}</span>}</div><h2 className="mt-4 text-2xl"><a href={item.url} target="_blank" rel="noreferrer">{item.title} ↗</a></h2><p className="sans mt-4 text-sm leading-7">{item.description}</p><div className="mt-4 flex flex-wrap gap-2">{item.tags?.map((tag) => <span className="badge" key={tag}>#{tag}</span>)}</div>{meta?.relations.length ? <p className="sans mt-5 text-sm"><b>關聯網站：</b>{meta.relations.join("、")}</p> : null}<p className="sans mt-4 break-all text-xs text-[#6d706b]">{item.url}</p></article>;
    })}</div>
    {!rows.length && <div className="card mt-8 p-12 text-center"><h2 className="text-2xl">沒有符合條件的網站節點</h2><p className="sans mt-3 text-sm">既有知識好站與中醫好站仍保留在原清單。</p></div>}
  </>;
}

export default async function Sites({ searchParams }: { searchParams: Promise<SiteSearchParams> }) {
  const params = await searchParams;
  return <div className="mx-auto max-w-7xl px-5 py-12">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">YU WEBSITE REGISTRY</p><h1 className="mt-3 text-4xl">{params.view === "incubator" ? "網站孵化" : "余氏網站戶籍中心"}</h1><p className="sans mt-4 max-w-3xl leading-7 text-[#596258]">{params.view === "incubator" ? "沿用網站戶籍既有生命週期，聚焦構想中、建置中與 Candidate；不建立新的任務系統。" : "登記獨立網站的入口、定位、知識主題與關聯。各站仍維持自己的內容、會員、授權與運作。"}</p></div><Link prefetch={false} href="/admin/sites" className="sans border px-4 py-2 text-sm">管理網站戶籍</Link></div>
    <nav className="sans mt-8 flex flex-wrap gap-2 text-sm"><Link prefetch={false} href="/sites" className="badge">全部戶籍</Link><Link prefetch={false} href="/sites?view=incubator" className="badge">孵化中</Link>{siteLifecycles.map((lifecycle) => <Link prefetch={false} key={lifecycle} href={`/sites?lifecycle=${lifecycle}`} className="badge">{siteLifecycleLabels[lifecycle]}</Link>)}</nav>
    <Suspense fallback={<RegistryLoading />}><RegistryResults params={params} /></Suspense>
  </div>;
}
