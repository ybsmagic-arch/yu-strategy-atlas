import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export default async function CollectBaiduAuricularDiagnosis() {
  const { db, user } = await requireAdmin();
  const { error } = await db.from("reference_links").upsert(
    {
      collection: "tcm",
      title: "《耳穴診斷治療學》PPT 課件－百度文庫",
      url: "https://wenku.baidu.com/view/ee3b9de6f021dd36a32d7375a417866fb84ac029.html",
      publisher: "百度文庫／上傳者待查",
      description:
        "以耳穴診斷與治療為主題的簡體中文 PPT 課件頁面，可作為耳穴、耳診、穴位定位與教學架構的資料線索。",
      category: "耳穴與耳診",
      tags: [
        "耳穴",
        "耳診",
        "耳穴治療",
        "診斷",
        "穴位",
        "教學課件",
        "PPT",
        "百度文庫",
      ],
      language: "zh-Hans",
      source_type: "使用者上傳教學文件",
      reliability: "unreviewed",
      ai_use: "discovery",
      notes:
        "百度文庫頁面標題顯示為《耳穴診斷治療學》PPT 課件；目前公開頁面未可靠取得原作者、授課機構、出版年份、參考文獻與完整版本資訊。平台上傳文件不代表已經同儕審查或取得原作者授權，僅宜保存連結與作為主題探索線索，不直接複製整份文件。涉及耳穴定位、診斷準確性、適應症、禁忌、不良事件及療效時，應回查正式教材、國家或專業標準、原始研究與臨床指引。",
      last_accessed: new Date().toISOString().slice(0, 10),
      status: "active",
      created_by: user.id,
    },
    { onConflict: "collection,url" },
  );

  if (error) {
    redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/links/tcm?collected=baidu-auricular-diagnosis");
}
