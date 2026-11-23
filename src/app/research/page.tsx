import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { libraryMeta, researchLibraries, type ResearchLibrary } from "@/types/research";
import { measureTiming } from "@/lib/timing-diagnostics";

type CountResult = { counts: Map<string, number> | null };

async function loadPublishedCounts(): Promise<CountResult> {
  const db = await createClient();
  if (!db) return { counts: null };
  const { data, error } = await measureTiming("research_counts_query", async () =>
    await db.from("research_articles").select("library").eq("status", "published")
  );
  if (error) return { counts: null };
  const counts = new Map<string, number>();
  for (const row of data ?? []) counts.set(row.library, (counts.get(row.library) ?? 0) + 1);
  return { counts };
}

async function PublishedCount({ library, result }: { library: ResearchLibrary; result: Promise<CountResult> }) {
  const { counts } = await result;
  if (!counts) return <p className="sans mt-5 text-xs text-[#8a5d4a]" role="status">計數暫時無法取得</p>;
  return <p className="sans mt-5 text-xs text-[#6d706b]">已發布 {counts.get(library) ?? 0} 篇</p>;
}

export default function ResearchHome() {
  const counts = loadPublishedCounts();
  return <div className="mx-auto max-w-7xl px-5 py-12">
    <p className="eyebrow">YMOS RESEARCH LIBRARIES</p>
    <h1 className="mt-3 text-4xl sm:text-5xl">六大研究知識庫</h1>
    <p className="sans mt-5 max-w-3xl leading-8 text-[#596258]">收集商業、人體、自然、療法、醫案與人文作品，再由「給 YMOS 取經」提煉跨領域智慧。</p>
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{researchLibraries.map(key => {
      const meta = libraryMeta[key];
      return <Link prefetch={false} href={`/research/${key}`} className="card p-7" key={key}>
        <p className="eyebrow">LIBRARY {meta.number}</p>
        <h2 className="mt-3 text-2xl">{meta.title}</h2>
        <p className="sans mt-3 text-sm leading-7 text-[#596258]">{meta.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">{meta.types.map(x => <span className="badge" key={x.value}>{x.label}</span>)}</div>
        <Suspense fallback={<p className="sans mt-5 text-xs text-[#6d706b]" role="status">計數載入中…</p>}>
          <PublishedCount library={key} result={counts}/>
        </Suspense>
      </Link>;
    })}</div>
    <Link prefetch={false} href="/ymos-takeaways" className="card mt-8 block border-l-4 border-l-[#b59962] p-8">
      <p className="eyebrow">CROSS KNOWLEDGE</p>
      <h2 className="mt-2 text-3xl">給 YMOS 取經的總整理</h2>
      <p className="sans mt-3 text-sm">跨越六大研究庫，整理 YMOS 四層、五行與生命、管理、教育、品牌、AI、健康智慧。</p>
    </Link>
  </div>;
}
