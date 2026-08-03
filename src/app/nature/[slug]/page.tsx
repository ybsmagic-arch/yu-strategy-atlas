import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { naturalFromRow, typeLabel } from "@/lib/naturalWisdom";
import { levelLabels, naturalWisdomSchema } from "@/types/naturalWisdom";
import honeybeeJson from "../../../../examples/natural-wisdom.example.json";

const honeybee = naturalWisdomSchema.parse({ ...honeybeeJson, status: "published", publishedAt: new Date().toISOString() });

function Section({ number, title, value }: { number: number; title: string; value: unknown }) {
  if (!value || (Array.isArray(value) && !value.length)) return null;
  return <section className="border-t py-9">
    <div className="grid gap-4 md:grid-cols-[180px_1fr]">
      <div><p className="eyebrow">{String(number).padStart(2, "0")}</p><h2 className="mt-2 text-2xl">{title}</h2></div>
      <div className="sans whitespace-pre-wrap leading-8">
        {Array.isArray(value) ? <ul className="list-disc pl-5">{value.map((item) => <li key={String(item)}>{String(item)}</li>)}</ul>
          : typeof value === "object" ? <dl className="grid gap-3 sm:grid-cols-2">{Object.entries(value as Record<string, unknown>).map(([key, item]) => <div key={key}><dt className="text-[#6d706b]">{key}</dt><dd>{String(item)}</dd></div>)}</dl>
            : String(value)}
      </div>
    </div>
  </section>;
}

export default async function NaturalDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await createClient();
  const { data } = db ? await db.from("natural_wisdom_entries").select("*").eq("slug", slug).maybeSingle() : { data: null };
  const item = data ? naturalFromRow(data) : slug === honeybee.slug ? honeybee : null;
  if (!item) notFound();

  const sections: Array<[string, unknown]> = [
    ["生物分類", item.biologyProfile], ["演化背景", item.evolutionBackground], ["生存策略", item.survivalStrategy],
    ["行為策略", item.behaviorStrategy], ["群體合作", item.groupCooperation], ["決策模式", item.decisionModel],
    ["風險管理", item.riskManagement], ["環境適應", item.environmentAdaptation], ["生態互動", item.ecologicalInteractions],
    ["YMOS 原則", item.ymosPrinciples], ["余氏生命系統學", item.yuLifeSystemInsight], ["余氏中醫對應", item.yuTcmMapping],
    ["教育翻譯", item.educationInsight], ["管理翻譯", item.managementInsight], ["品牌翻譯", item.brandInsight],
    ["企業翻譯", item.businessInsight], ["AI Translation", item.aiInsight], ["一句人生", item.todayInspiration],
    ["一句管理", item.wisdomSentence], ["資料來源", item.sources.map((source) => source.title)],
  ];

  return <article className="mx-auto max-w-5xl px-5 py-12">
    <Link href="/nature/animals" className="sans text-sm">← 返回動物智慧</Link>
    <header className="py-12">
      <p className="eyebrow">#{item.entryNumber} · {typeLabel(item.entryType)}</p>
      <h1 className="mt-4 text-5xl">{item.nameZh}</h1>
      <p className="mt-3 text-2xl text-[#72806b]">{item.subtitle}</p>
      <p className="sans mt-6 leading-8">{item.summary}</p>
      <div className="card sans mt-8 grid gap-4 p-5 text-sm sm:grid-cols-4">
        <div>YMOS：{levelLabels[item.ymosLevel].zh}</div><div>生命角色：{item.lifeRole}</div><div>核心能力：{item.coreAbility}</div>
        <div>五行：{item.primaryElement}{item.secondaryElement ? `／${item.secondaryElement}` : ""}</div>
        <div className="flex flex-wrap gap-2 sm:col-span-4">{item.keywords.map((keyword) => <span className="badge" key={keyword}>{keyword}</span>)}</div>
      </div>
    </header>
    {sections.map(([title, value], index) => <Section key={title} number={index + 1} title={title} value={value} />)}
  </article>;
}
