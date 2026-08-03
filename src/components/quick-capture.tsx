"use client";
import { useState } from "react";
import { quickCreateThought } from "@/app/thought-actions";

export function QuickCapture(){const [open,setOpen]=useState(false);return <>
  <button onClick={()=>setOpen(true)} className="sans rounded bg-[#34423a] px-4 py-2 text-sm text-white">快速記錄</button>
  {open&&<div role="dialog" aria-modal="true" className="fixed inset-0 z-[80] grid place-items-center bg-black/35 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><form action={quickCreateThought} className="w-full max-w-xl rounded bg-[#f7f4ed] p-6 shadow-2xl"><div className="flex justify-between"><h2 className="text-2xl">快速記錄一個想法</h2><button type="button" onClick={()=>setOpen(false)} aria-label="關閉">✕</button></div><div className="mt-6 space-y-4 sans text-sm"><label className="block">標題<input required name="title" autoFocus className="field"/></label><label className="block">內容<textarea required name="content" rows={6} className="field"/></label><label className="block">標籤<input name="tags" className="field" placeholder="五行、管理、AI"/></label></div><p className="sans mt-4 text-xs text-[#6d706b]">自動設為：一般筆記／待整理／靈感／未分類</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={()=>setOpen(false)} className="sans px-4 py-2 border">取消</button><button className="sans bg-[#34423a] px-5 py-2 text-white">儲存</button></div></form></div>}
  </>}
