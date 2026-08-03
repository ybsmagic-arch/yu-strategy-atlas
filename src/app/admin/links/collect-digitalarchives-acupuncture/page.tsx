import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export default async function CollectDigitalArchivesAcupuncture() {
  const { db, user } = await requireAdmin();
  const { error } = await db.from("reference_links").upsert(
    {
      collection: "tcm",
      title: "再探針灸大成－國家數位典藏成果資源",
      url: "https://digitalarchives.tw/site_detail.jsp?id=2108",
      publisher: "台灣首府大學資訊與多媒體設計學系／數位典藏與數位學習國家型科技計畫",
      description:
        "整合董氏針灸、傳統十四經絡與當代微針系統的數位典藏計畫，包含 3D 虛擬實境銅人、穴道系統、整合性處方、特殊配穴、針灸名家、臨床與古典文獻及中醫人工智慧等單元。",
      category: "針灸數位典藏與研究計畫",
      tags: [
        "再探針灸大成",
        "董氏針灸",
        "十四經絡",
        "微針系統",
        "3D銅人",
        "穴位",
        "針灸文獻",
        "數位典藏",
        "中醫人工智慧",
      ],
      language: "zh-Hant",
      source_type: "國家型數位典藏計畫成果紀錄",
      reliability: "authoritative",
      ai_use: "reference",
      notes:
        "典藏頁記錄的網站名稱為『再探針灸大成』，作者為台灣首府大學資訊與多媒體設計學系，主題為醫學，用途為學術研究。原始網址為 http://acupun.site/，可能已無法使用；國家數位典藏另保存 2013-11-05 的庫存網站紀錄。計畫執行範圍約為 2005 至 2011 年，適合研究針灸數位化歷史、分類與資料架構；醫療內容可能已過時，實際穴位、操作、主治與臨床結論仍須核對現行標準與研究。庫存網站標示採 CC BY-NC-ND 2.5 TW 授權，引用與再利用須遵守授權條件，不可任意改作或用於商業用途。",
      last_accessed: new Date().toISOString().slice(0, 10),
      status: "active",
      created_by: user.id,
    },
    { onConflict: "collection,url" },
  );

  if (error) {
    redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/links/tcm?collected=digitalarchives-acupuncture");
}
