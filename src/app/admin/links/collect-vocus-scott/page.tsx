import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export default async function CollectVocusScott() {
  const { db, user } = await requireAdmin();
  const { error } = await db.from("reference_links").upsert(
    {
      collection: "knowledge",
      title: "Scott－方格子 vocus 作者頁",
      url: "https://vocus.cc/user/@scott",
      publisher: "Scott／方格子 vocus",
      description:
        "方格子 vocus 創作者 Scott 的作者首頁，用於追蹤其公開文章與後續知識整理。",
      category: "待分類創作者",
      tags: ["Scott", "方格子", "vocus", "創作者", "文章專欄", "待分類"],
      language: "zh-Hant",
      source_type: "個人作者專欄",
      reliability: "unreviewed",
      ai_use: "discovery",
      notes:
        "方格子限制公開頁面擷取，目前無法可靠確認作者背景、專業資格與主要文章領域，因此暫列待分類。使用個別文章時，應另行記錄文章標題、作者署名、發布日期、引用來源與證據層級；涉及醫療、投資或其他高風險主張時須交叉查核。",
      last_accessed: new Date().toISOString().slice(0, 10),
      status: "active",
      created_by: user.id,
    },
    { onConflict: "collection,url" },
  );

  if (error) {
    redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/links/knowledge?collected=vocus-scott");
}
