import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export default async function CollectJimmyCenter() {
  const { db, user } = await requireAdmin();
  const { error } = await db.from("reference_links").upsert(
    {
      collection: "knowledge",
      title: "催眠師教學札記－療愈心理學",
      url: "https://jimmycenter.com/",
      publisher: "Jimmy Center",
      description:
        "收錄催眠教學、心理學、療愈成長、課程筆記與相關個案內容的個人知識網站。",
      category: "心理學與催眠",
      tags: [
        "催眠",
        "心理學",
        "療愈成長",
        "教學筆記",
        "個案分享",
        "玄學",
      ],
      language: "zh-Hant",
      source_type: "個人專業與教學網站",
      reliability: "unreviewed",
      ai_use: "discovery",
      notes:
        "網站同時包含催眠、心理學、療愈、量子力學、玄學與真人經驗等不同證據層級的內容，適合用於主題探索與資料線索。涉及醫療、心理治療、科學機制或療效的主張，須逐篇辨識作者、來源與日期，並以專業指南、原始研究及主管機關資料交叉查核；不得直接作為診斷或治療依據。",
      last_accessed: new Date().toISOString().slice(0, 10),
      status: "active",
      created_by: user.id,
    },
    { onConflict: "collection,url" },
  );

  if (error) {
    redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/links/knowledge?collected=jimmy-center");
}
