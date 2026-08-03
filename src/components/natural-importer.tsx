"use client";
import {useState} from "react";
import example from "../../examples/natural-wisdom.example.json";
import {naturalWisdomSchema} from "@/types/naturalWisdom";
import {importNaturalEntry} from "@/app/nature-actions";

export function NaturalImporter(){
 const [text,setText]=useState("");const [errors,setErrors]=useState<string[]>([]);const [preview,setPreview]=useState<{nameZh:string;subtitle:string;coreAbility:string}|null>(null);
 function setJson(value:string){setText(value);setPreview(null);setErrors([])}
 function validate(){try{const result=naturalWisdomSchema.safeParse(JSON.parse(text));if(!result.success){setErrors(result.error.issues.map(x=>`${x.path.join(".")}：${x.message}`));setPreview(null)}else{setErrors([]);setPreview(result.data)}}catch(e){setErrors([`JSON 格式錯誤：${e instanceof Error?e.message:"無法解析"}`]);setPreview(null)}}
 return <div className="card p-6"><h2 className="text-2xl">自然智慧 JSON 匯入</h2><p className="sans mt-2 text-sm text-[#6d706b]">可直接貼上 JSON、上傳檔案，或先載入內建蜜蜂範例測試。</p><textarea className="field mt-5 font-mono text-xs" rows={18} value={text} onChange={e=>setJson(e.target.value)}/><label className="sans mt-4 block text-sm">上傳 .json<input className="field" type="file" accept="application/json,.json" onChange={async e=>{const file=e.target.files?.[0];if(file)setJson(await file.text())}}/></label><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={()=>setJson(JSON.stringify(example,null,2))} className="sans border px-4 py-2">載入內建蜜蜂範例</button><button type="button" onClick={validate} className="sans border px-4 py-2">驗證與預覽</button></div>{errors.length>0&&<ul className="sans mt-4 border border-red-700/30 p-4 text-sm text-red-900">{errors.map(x=><li key={x}>{x}</li>)}</ul>}{preview&&<div className="mt-5 border-l-2 border-[#b59962] pl-5"><p className="eyebrow">預覽通過</p><h3 className="mt-2 text-xl">{preview.nameZh} · {preview.subtitle}</h3><p className="sans mt-2 text-sm">核心能力：{preview.coreAbility}</p><form action={importNaturalEntry} className="mt-4"><input type="hidden" name="json" value={text}/><button className="sans bg-[#34423a] px-5 py-3 text-white">匯入為待審核</button></form></div>}</div>
}
