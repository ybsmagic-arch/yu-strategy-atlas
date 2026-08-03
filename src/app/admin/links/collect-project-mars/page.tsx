import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export default async function CollectProjectMars() {
  const { db, user } = await requireAdmin();
  const { error } = await db.from("reference_links").upsert(
    {
      collection: "knowledge",
      title: "火星誠靈實驗室－催眠、芳療與能量療癒",
      url: "https://projectmars-spa.com/",
      publisher: "火星計畫股份有限公司／火星誠靈實驗室",
      description:
        "介紹催眠療癒、精油芳療、能量療癒、靈氣、水晶礦石及身心靈成長的服務與知識文章；網站公告實體服務已於 2025 年 3 月 31 日暫停。",
      category: "世界療法與身心靈",
      tags: [
        "催眠",
        "精油芳療",
        "能量療癒",
        "靈氣",
        "水晶礦石",
        "身心靈",
        "另類療法",
      ],
      language: "zh-Hant",
      source_type: "商業服務與知識網站",
      reliability: "caution",
      ai_use: "discovery",
      notes:
        "適合研究民間身心靈服務的分類、敘事與實務案例。網站內容混合商業服務、客戶回饋、催眠、芳療及缺乏充分實證的能量與靈性主張；客戶見證不等於臨床證據。不得直接作為醫療、心理治療或療效依據，相關主張須以專業指引、系統性回顧、原始研究及主管機關資訊交叉查核。網站已公告實體服務於 2025-03-31 暫停。",
      last_accessed: new Date().toISOString().slice(0, 10),
      status: "active",
      created_by: user.id,
    },
    { onConflict: "collection,url" },
  );

  if (error) {
    redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/links/knowledge?collected=project-mars");
}
