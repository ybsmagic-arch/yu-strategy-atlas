import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export default async function CollectYixueZhongzhongCanxilu() {
  const { db, user } = await requireAdmin();
  const { error } = await db.from("reference_links").upsert(
    {
      collection: "tcm",
      title: "《醫學衷中參西錄》－中醫笈成電子全文",
      url: "https://jicheng.tw/tcm/book/%E9%86%AB%E5%AD%B8%E8%A1%B7%E4%B8%AD%E5%8F%83%E8%A5%BF%E9%8C%84/index.html",
      publisher: "中醫笈成／張錫純",
      description:
        "清代醫家張錫純《醫學衷中參西錄》的電子全文，成書資料標示為公元 1909 年；網站底本為河北人民出版社 1977 年第 2 版。內容包含醫方、藥物、醫論與醫案。",
      category: "中醫典籍與古籍全文",
      tags: [
        "醫學衷中參西錄",
        "張錫純",
        "中醫笈成",
        "中西醫匯通",
        "方劑",
        "中藥",
        "醫論",
        "醫案",
        "古籍",
      ],
      language: "zh-Hant",
      source_type: "中醫古籍電子全文",
      reliability: "useful",
      ai_use: "reference",
      notes:
        "書目資訊：作者張錫純；朝代清；年份公元 1909 年；電子版所據底本為河北人民出版社 1977 年第 2 版。適合用於古籍查詢、思想史、方藥與醫案整理。古籍內容屬歷史文獻與傳統醫學經驗，不等同現代臨床實證；涉及疾病診斷、治療、劑量、毒性及交互作用時，須再查現行藥典、臨床指引、原始研究與主管機關資料。引用時應保留篇章、底本與電子頁面資訊，並核對可能的轉錄或標點差異。",
      last_accessed: new Date().toISOString().slice(0, 10),
      status: "active",
      created_by: user.id,
    },
    { onConflict: "collection,url" },
  );

  if (error) {
    redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/links/tcm?collected=yixue-zhongzhong-canxilu");
}
