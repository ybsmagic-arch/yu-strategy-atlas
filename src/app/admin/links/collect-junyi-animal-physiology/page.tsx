import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export default async function CollectJunyiAnimalPhysiology() {
  const { db, user } = await requireAdmin();
  const { error } = await db.from("reference_links").upsert(
    {
      collection: "knowledge",
      title: "動物生理學－均一教育平台",
      url: "https://www.junyiacademy.org/topics/junyi-animal-physiology",
      publisher: "均一教育平台",
      description:
        "高中生物的動物生理學課程，涵蓋循環、消化、呼吸與排泄、防禦、生殖、神經協調及內分泌系統，並包含人體器官與生理功能的基礎教材。",
      category: "生物學與人體生理",
      tags: [
        "動物生理學",
        "高中生物",
        "人體器官",
        "循環系統",
        "消化系統",
        "呼吸系統",
        "免疫系統",
        "神經系統",
        "內分泌系統",
      ],
      language: "zh-Hant",
      source_type: "教育平台課程",
      reliability: "useful",
      ai_use: "reference",
      notes:
        "適合作為動物與人體生理的基礎概念、課程架構及教學導覽來源。內容定位為高中教育教材；若涉及疾病診斷、治療、安全劑量或最新醫學結論，仍須引用現行醫學教科書、臨床指引、原始研究與主管機關資料。",
      last_accessed: new Date().toISOString().slice(0, 10),
      status: "active",
      created_by: user.id,
    },
    { onConflict: "collection,url" },
  );

  if (error) {
    redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/links/knowledge?collected=junyi-animal-physiology");
}
