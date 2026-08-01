import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { isValidIngestToken } from "@/lib/ingest-auth";
import { findStrategyCaseDuplicates, insertStrategyCase } from "@/lib/repositories/strategyCases";
import { slugifyStrategyCase, strategyCaseSchema } from "@/types/strategyCase";

export const runtime="nodejs";
export async function POST(request:Request){
  const auth=request.headers.get("authorization") ?? (request.headers.get("x-import-secret")?`Bearer ${request.headers.get("x-import-secret")}`:null);
  if(!isValidIngestToken(auth,process.env.IMPORT_SECRET)) return NextResponse.json({error:"匯入密鑰錯誤"},{status:401});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key) return NextResponse.json({error:"伺服器資料庫設定不完整"},{status:503});
  let body:unknown; try{body=await request.json();}catch{return NextResponse.json({error:"JSON 格式錯誤"},{status:400});}
  const envelope=body && typeof body==="object" ? body as {data?:unknown;force?:boolean} : {};
  const parsed=strategyCaseSchema.safeParse(envelope.data??body);
  if(!parsed.success) return NextResponse.json({error:"欄位驗證失敗",issues:parsed.error.issues.map(x=>({path:x.path.join("."),message:x.message}))},{status:422});
  const item=parsed.data; let slug=item.slug||slugifyStrategyCase(`${item.caseDate}-${item.title}`);
  if(!slug) return NextResponse.json({error:"無法產生 slug，請提供英文 slug"},{status:422});
  const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const warnings=await findStrategyCaseDuplicates(db,item,slug);
  if(warnings.length&&!envelope.force) return NextResponse.json({error:"發現重複項目，請確認是否強制建立",warnings},{status:409});
  if(envelope.force&&warnings.some(x=>x.kind==="slug")) slug=`${slug}-${Date.now().toString(36)}`;
  try{const row=await insertStrategyCase(db,item,slug);return NextResponse.json({ok:true,id:row.id,slug:row.slug,status:"pending_review",warnings,previewUrl:`/admin/strategy-cases/${row.slug}`},{status:201});}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"匯入失敗，未覆蓋既有內容"},{status:409});}
}
