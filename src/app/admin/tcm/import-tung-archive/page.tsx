import {redirect} from "next/navigation";
import {requireAdmin} from "@/lib/auth";
import {tungArchiveItems} from "@/data/tung-archive";

export default async function ImportTungArchive(){
  const {db,user}=await requireAdmin();
  const rows=tungArchiveItems.map(item=>({
    entity_type:item.entityType,
    canonical_code:item.code,
    name_zh:item.name,
    name_original:item.name,
    summary:`「董式」本機資料集中的${item.category}參考資料。已完成檔案辨識與基本分類，現階段只建立書目索引，內容尚待人工校讀與醫療專業審核。`,
    content:{
      資料集:"董式.zip",
      分類:item.category,
      檔案格式:item.format,
      頁數:item.pages??null,
      系列:item.series??null,
      整理備註:item.notes,
      原始檔案狀態:"保留於使用者本機；未上傳、未公開全文",
      著作權狀態:"待確認",
      文字擷取狀態:item.format==="PDF"?"已盤點；掃描頁仍可能需要 OCR":"舊版 Office 格式；已做初步字串辨識，待人工校讀"
    },
    tags:["董氏針灸",item.category,item.format,"本機資料集","待審核"],
    evidence_limits:"此筆為來源目錄與書目索引，不代表內容正確或已取得公開授權。穴位、診斷、處方、療效與醫案敘述均須回查原始出版資料、辨明版本與作者，並由合格中醫師或相關專業人員審核；不得直接作為診斷、治療或自行施針依據。",
    status:"pending_review",
    manually_edited:false,
    published_at:null,
    created_by:user.id
  }));
  const {error}=await db.from("tcm_entities").upsert(rows,{onConflict:"canonical_code"});
  if(error)redirect(`/admin/tcm?error=${encodeURIComponent(error.message)}`);
  redirect(`/admin/tcm?imported=${tungArchiveItems.length}-tung-archive-items`);
}

