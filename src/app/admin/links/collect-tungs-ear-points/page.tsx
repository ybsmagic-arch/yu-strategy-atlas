import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export default async function CollectTungsEarPoints() {
  const { db, user } = await requireAdmin();
  const { error } = await db.from("reference_links").upsert(
    {
      collection: "tcm",
      title: "董氏奇穴九九部位【耳朵】－董氏心氣神針",
      url: "https://www.tungs-acupuncture.com/%E4%B9%9D%E4%B9%9D%E9%83%A8%E4%BD%8D%E3%80%90%E8%80%B3%E6%9C%B5%E3%80%91/",
      publisher: "董氏心氣神針傳承網",
      description:
        "董氏奇穴九九部位的耳部穴位索引，分為耳朵內側與後側，收錄火耳、土耳、水耳、木耳、金耳、耳三穴、神耳穴、降壓穴等穴位的延伸頁面。",
      category: "董氏奇穴與耳部穴位",
      tags: [
        "董氏奇穴",
        "董氏針灸",
        "九九部位",
        "耳朵",
        "耳部穴位",
        "耳三穴",
        "神耳穴",
        "穴位索引",
      ],
      language: "zh-Hant",
      source_type: "針灸傳承與穴位資料網站",
      reliability: "useful",
      ai_use: "reference",
      notes:
        "此頁為董氏奇穴傳承體系中的耳部穴位索引，穴名、定位、理論與一般耳穴國家標準、WHO 標準耳穴命名或其他耳針流派未必相同，建檔時應保留『董氏奇穴』體系標籤，不可自動合併為同一穴位。涉及主治、操作深度、針刺方向、禁忌、不良事件與療效時，應逐穴查閱原始傳承資料、正式教材、專業標準與臨床研究；不得僅憑穴名自行施針。",
      last_accessed: new Date().toISOString().slice(0, 10),
      status: "active",
      created_by: user.id,
    },
    { onConflict: "collection,url" },
  );

  if (error) {
    redirect(`/admin/links?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/links/tcm?collected=tungs-ear-points");
}
