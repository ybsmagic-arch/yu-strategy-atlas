/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { NaturalWisdomEntry } from "@/types/naturalWisdom";
import { levelLabels } from "@/types/naturalWisdom";
import { typeLabel } from "@/lib/naturalWisdom";

export function NaturalCard({ item }: { item: NaturalWisdomEntry }) {
  return <Link href={`/nature/${item.slug}`} className="card overflow-hidden">
    <div className="aspect-[16/7] bg-[#e5e0d5]">
      {item.coverImageUrl ? <img src={item.coverImageUrl} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-4xl text-[#9b7d46]">{item.nameZh.slice(0, 1)}</div>}
    </div>
    <div className="p-6">
      <p className="eyebrow">#{item.entryNumber} · {typeLabel(item.entryType)} · {levelLabels[item.ymosLevel].zh}</p>
      <h2 className="mt-3 text-2xl">{item.nameZh}</h2>
      <p className="mt-1 text-[#72806b]">{item.subtitle}</p>
      <div className="sans mt-4 grid gap-2 text-sm">
        <p>生命角色：{item.lifeRole || "尚未設定"}</p>
        <p>核心能力：{item.coreAbility}</p>
        <p>五行：{item.primaryElement || "尚未設定"}{item.secondaryElement ? `／${item.secondaryElement}` : ""}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">{item.keywords.slice(0, 5).map((keyword) => <span className="badge" key={keyword}>{keyword}</span>)}</div>
      <p className="sans mt-4 text-sm leading-6 text-[#596258]">{item.summary}</p>
    </div>
  </Link>;
}
