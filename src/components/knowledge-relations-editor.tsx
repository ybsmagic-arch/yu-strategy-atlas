"use client";

import { useState } from "react";
import {
  knowledgeApprovalLabels,
  knowledgeApprovalStatuses,
  knowledgeRelationLabels,
  knowledgeRelationTypes,
  knowledgeSourceLabels,
  knowledgeSourceTypes,
  type KnowledgeRelation,
} from "@/lib/site-registry";

const field = "field";
const emptyRelation: KnowledgeRelation = {
  sourceType: "strategy_article",
  knowledgeId: "",
  route: "",
  relationType: "related_reading",
  displayName: "",
  approvalStatus: "pending",
};

export function KnowledgeRelationsEditor({ initialRelations }: { initialRelations: KnowledgeRelation[] }) {
  const [relations, setRelations] = useState(initialRelations);
  const update = (index: number, patch: Partial<KnowledgeRelation>) => setRelations((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));

  return <fieldset className="space-y-4 border-t pt-5">
    <legend className="font-serif text-xl">知識書架關聯</legend>
    <p className="text-xs leading-6 text-[#6d706b]">只接受 YMOS 既有內部路由；同一知識 ID 與路由不可重複。只有「已核准」會顯示在公開網站戶籍。</p>
    <input type="hidden" name="knowledgeRelations" value={JSON.stringify(relations)}/>
    {relations.map((relation, index) => <div className="space-y-3 border p-4" key={`${relation.sourceType}-${relation.knowledgeId}-${index}`}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label>知識來源<select className={field} value={relation.sourceType} onChange={(event) => update(index, { sourceType: event.target.value as KnowledgeRelation["sourceType"] })}>{knowledgeSourceTypes.map((value) => <option value={value} key={value}>{knowledgeSourceLabels[value]}</option>)}</select></label>
        <label>關聯類型<select className={field} value={relation.relationType} onChange={(event) => update(index, { relationType: event.target.value as KnowledgeRelation["relationType"] })}>{knowledgeRelationTypes.map((value) => <option value={value} key={value}>{knowledgeRelationLabels[value]}</option>)}</select></label>
        <label>既有知識 ID<input className={field} maxLength={160} required value={relation.knowledgeId} onChange={(event) => update(index, { knowledgeId: event.target.value })} placeholder="例如 a005"/></label>
        <label>穩定內部路由<input className={field} maxLength={500} required value={relation.route} onChange={(event) => update(index, { route: event.target.value })} placeholder="/articles/ikea-standardization-and-imagination"/></label>
        <label>顯示名稱<input className={field} maxLength={200} required value={relation.displayName} onChange={(event) => update(index, { displayName: event.target.value })}/></label>
        <label>Owner 狀態<select className={field} value={relation.approvalStatus} onChange={(event) => update(index, { approvalStatus: event.target.value as KnowledgeRelation["approvalStatus"] })}>{knowledgeApprovalStatuses.map((value) => <option value={value} key={value}>{knowledgeApprovalLabels[value]}</option>)}</select></label>
      </div>
      <button type="button" className="text-xs underline" onClick={() => setRelations((current) => current.filter((_, itemIndex) => itemIndex !== index))}>移除此關聯</button>
    </div>)}
    <button type="button" className="border px-4 py-2 text-sm" onClick={() => setRelations((current) => [...current, { ...emptyRelation }])}>＋ 增加待確認關聯</button>
  </fieldset>;
}
