import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export default async function CollectSmallcollation() {
  const { db, user } = await requireAdmin();
  const { error } = await db.from("reference_links").upsert(
    {
      collection: "knowledge",
      title: "小小整理網站 Smallcollation－基礎醫學與人體系統",
      url: "https://smallcollation.blogspot.com/",
      publisher: "Smallcollation／Blogger",
      description:
        "跨領域資料整理站；醫學部分依人體系統編排，涵蓋生物化學、神經、循環、消化、內分泌、外皮、免疫、骨骼、肌肉、呼吸、生殖、泌尿、疾病、藥理、病理與實驗方法。另收錄語言、法律、會計、地理及科學筆記。",
      category: "基礎醫學與人體系統",
      tags: [
        "Smallcollation",
        "基礎醫學",
        "人體系統",
        "解剖生理",
        "病理學",
        "藥理學",
        "生物化學",
        "跨領域筆記",
      ],
      language: "zh-Hant",
      source_type: "個人跨領域資料整理站",
      reliability: "useful",
      ai_use: "discovery",
      notes:
        "適合作為基礎概念、分類架構、雙語術語與延伸主題的探索入口。網站為個人整理資料，文章年代、原始來源、作者專業資格及審查方式可能不一；引用個別內容前應核對文章日期與參考文獻。涉及疾病診斷、治療、藥物劑量、安全性或最新醫學結論時，必須回查現行教科書、臨床指引、藥品仿單、原始研究及主管機關資料。網址中的 #gsc.tab=0 僅為搜尋介面狀態，收錄時使用穩定首頁網址。",
      last_accessed: new Date().toISOString().slice(0, 10),
      status: "active",
      created_by: user.id,
    },
    { onConflict: "collection,url" },
  );

  if (error) {
    redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/links/knowledge?collected=smallcollation");
}
