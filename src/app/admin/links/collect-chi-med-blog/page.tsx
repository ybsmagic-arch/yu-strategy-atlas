import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export default async function CollectChiMedBlog() {
  const { db, user } = await requireAdmin();
  const { error } = await db.from("reference_links").upsert(
    {
      collection: "tcm",
      title: "中醫西說－中西醫理論與經典討論",
      url: "https://chi-med.blogspot.com/",
      publisher: "dr Who YH Apple／Blogger",
      description:
        "以中西醫比較、經典詮釋、醫學理論辨析與學術爭論為主的個人部落格，包含對《黃帝內經》及近現代中醫論述的評論。",
      category: "中西醫比較與醫論",
      tags: [
        "中醫西說",
        "中西醫比較",
        "黃帝內經",
        "醫學理論",
        "經典詮釋",
        "學術評論",
        "Blogger",
      ],
      language: "zh-Hant",
      source_type: "個人醫學評論部落格",
      reliability: "unreviewed",
      ai_use: "discovery",
      notes:
        "網站作者署名為 dr Who YH Apple；目前未由網站首頁資料確認其真實身分、專業資格、任職機構及文章審查機制。內容具有個人立場與批判性觀點，適合作為論點探索、思想史與中西醫爭議整理的線索，不宜當作醫療共識或臨床證據。引用時須逐篇保留文章標題、日期與作者署名，並回查古籍原文、現代教科書、原始研究、系統性回顧與臨床指引。",
      last_accessed: new Date().toISOString().slice(0, 10),
      status: "active",
      created_by: user.id,
    },
    { onConflict: "collection,url" },
  );

  if (error) {
    redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/links/tcm?collected=chi-med-blog");
}
