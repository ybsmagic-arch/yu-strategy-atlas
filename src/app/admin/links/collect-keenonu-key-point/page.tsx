import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export default async function CollectKeenonuKeyPoint() {
  const { db, user } = await requireAdmin();
  const { error } = await db.from("reference_links").upsert(
    {
      collection: "knowledge",
      title: "劉俊厚開關點療法－臨床案例資料頁",
      url: "http://www.keenonu.net/zz558-5.htm",
      publisher: "劉俊厚開關點療法／keenonu.net",
      description:
        "舊式 Big5 編碼網頁，介紹開關點療法，並展示腦部手術、中風、癱瘓與復健等案例及影像資料。",
      category: "世界療法與醫案資料",
      tags: [
        "開關點療法",
        "劉俊厚",
        "中風",
        "癱瘓",
        "復健",
        "臨床案例",
        "Big5",
        "舊網站",
      ],
      language: "zh-Hant",
      source_type: "療法倡議與個案網站",
      reliability: "caution",
      ai_use: "discovery",
      notes:
        "原頁使用 Big5 編碼且伺服器未在 HTTP 標頭標明字元集，部分現代瀏覽器可能顯示亂碼；頁面內宣告 charset=big5。網站內容主要是療法介紹、個案敘述、照片與影片，個案改善及作者自述不等於受控臨床證據。不得直接用於疾病診斷、治療建議或療效結論；研究時須另查療法定義、作者資格、病歷完整性、追蹤方式、不良事件、對照資料及同儕審查文獻。頁面最後修改時間顯示為 2014-04-22，資訊可能已過時。",
      last_accessed: new Date().toISOString().slice(0, 10),
      status: "active",
      created_by: user.id,
    },
    { onConflict: "collection,url" },
  );

  if (error) {
    redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/links/knowledge?collected=keenonu-key-point");
}
