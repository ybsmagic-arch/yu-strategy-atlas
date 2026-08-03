import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export default async function CollectTheSeventhSense() {
  const { db, user } = await requireAdmin();
  const { error } = await db.from("reference_links").upsert(
    {
      collection: "knowledge",
      title: "《第七感》：掌中大腦模型與神經整合",
      url: "https://www.thenewslens.com/article/112402",
      publisher: "The News Lens 關鍵評論網／時報出版",
      description:
        "《第七感》精選書摘，以握拳形成的掌中大腦模型，介紹腦幹、邊緣區域、皮質層，以及垂直整合與左右腦整合的基本概念。",
      category: "書籍導讀與腦科學",
      tags: [
        "第七感",
        "丹尼爾席格",
        "腦科學",
        "神經整合",
        "掌中大腦",
        "身心覺察",
        "書籍導讀",
      ],
      language: "zh-Hant",
      source_type: "媒體精選書摘",
      reliability: "useful",
      ai_use: "discovery",
      notes:
        "本文為媒體刊載的書籍節錄，適合用於概念探索與導讀。掌中大腦及三位一體大腦屬簡化教學模型；若用於醫療、神經解剖或臨床主張，應另以現行教科書、原始研究與專業資料交叉查核。",
      last_accessed: new Date().toISOString().slice(0, 10),
      status: "active",
      created_by: user.id,
    },
    { onConflict: "collection,url" },
  );

  if (error) {
    redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/links/knowledge?collected=the-seventh-sense");
}
