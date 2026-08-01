"use client";

import { useMemo, useState } from "react";
import { StrategyCaseDetail } from "@/components/strategy-case-detail";
import { parseStrategyCaseText } from "@/lib/parseStrategyCaseText";
import { strategyCaseSchema } from "@/types/strategyCase";

type Result = { error?: string; issues?: Array<{ path: string; message: string }>; warnings?: Array<{ kind: string; name: string; caseDate?: string }>; previewUrl?: string };

export function ImportCaseClient() {
  const [mode, setMode] = useState<"json" | "text">("json");
  const [raw, setRaw] = useState("");
  const [plainText, setPlainText] = useState("");
  const [secret, setSecret] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const validation = useMemo(() => {
    if (!raw.trim()) return null;
    try { return strategyCaseSchema.safeParse(JSON.parse(raw)); }
    catch { return { success: false as const, error: { issues: [{ path: [], message: "JSON 語法錯誤" }] } }; }
  }, [raw]);
  const parsed = validation?.success ? validation.data : null;

  function parseText() {
    if (!plainText.trim()) return;
    const item = parseStrategyCaseText(plainText);
    setRaw(JSON.stringify(item, null, 2));
    setMode("json");
    setResult(null);
  }

  async function submit(force = false) {
    if (!parsed) return;
    setBusy(true); setResult(null);
    try {
      const response = await fetch("/api/import/strategy-case", { method: "POST", headers: { "content-type": "application/json", "x-import-secret": secret }, body: JSON.stringify({ data: parsed, force }) });
      const body = await response.json() as Result;
      setResult(body);
      if (response.ok && body.previewUrl) location.href = body.previewUrl;
    } catch { setResult({ error: "連線失敗，請稍後再試。" }); }
    finally { setBusy(false); }
  }

  return <div className="max-w-6xl mx-auto px-5 py-16">
    <p className="eyebrow">PRIVATE IMPORT</p><h1 className="text-4xl mt-3">完整每日案例匯入</h1>
    <p className="sans text-sm text-[#6d706b] mt-4">企業、領導者、IP、兵法與 YMOS 是同一篇研究的五個鏡頭。</p>
    <div className="flex gap-2 mt-8"><button onClick={() => setMode("json")} className={`sans px-4 py-2 border ${mode === "json" ? "bg-[#34423a] text-white" : ""}`}>模式 A・完整 JSON</button><button onClick={() => setMode("text")} className={`sans px-4 py-2 border ${mode === "text" ? "bg-[#34423a] text-white" : ""}`}>模式 B・純文字</button></div>
    {mode === "text" ? <div className="mt-8 p-8 border border-[#34423a]/20">
      <h2 className="text-2xl">貼上完整純文字文章</h2>
      <p className="sans text-[#6d706b] mt-3">系統會先拆解文章並產生草稿。解析後請檢查所有「待人工確認」欄位，再匯入。</p>
      <textarea value={plainText} onChange={(event) => setPlainText(event.target.value)} rows={18} className="w-full mt-6 p-4 bg-white/60 border" placeholder="在這裡貼上今日完整文章" />
      <button disabled={!plainText.trim()} onClick={parseText} className="mt-5 sans px-6 py-3 bg-[#34423a] text-white disabled:opacity-40">解析文章並產生草稿</button>
    </div> : <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-6">
      <div><label className="sans text-sm">完整 StrategyCase JSON<textarea value={raw} onChange={(event) => setRaw(event.target.value)} rows={28} spellCheck={false} className="block w-full mt-2 p-4 bg-white/60 border border-[#34423a]/20 font-mono text-xs" /></label></div>
      <aside className="space-y-5"><label className="sans text-sm">IMPORT_SECRET<input type="password" value={secret} onChange={(event) => setSecret(event.target.value)} className="block w-full mt-2 p-3 bg-white/60 border" /></label>
        <div className="p-4 border border-[#34423a]/20 sans text-sm">{!validation ? <p>貼上 JSON 後即時檢查。</p> : validation.success ? <p className="text-green-800">格式與欄位驗證通過。請檢查預覽及「待人工確認」內容。</p> : <ul className="text-red-800 space-y-2">{validation.error.issues.map((issue, index) => <li key={index}><b>{issue.path.join(".") || "JSON"}</b>：{issue.message}</li>)}</ul>}</div>
        <button disabled={!parsed || !secret || busy} onClick={() => submit(false)} className="w-full sans px-5 py-3 bg-[#34423a] text-white disabled:opacity-40">{busy ? "匯入中…" : "確認後匯入"}</button>
        {result?.error && <div className="p-4 border border-red-800/30 sans text-sm"><p>{result.error}</p>{result.issues?.map((item) => <p key={item.path}>{item.path}：{item.message}</p>)}{result.warnings?.length ? <><ul className="mt-3">{result.warnings.map((item, index) => <li key={index}>{item.kind}：{item.name} {item.caseDate}</li>)}</ul><button onClick={() => submit(true)} className="mt-4 underline">確認風險並強制建立新案例</button></> : null}</div>}
      </aside>
    </div>}
    {parsed && <div className="mt-16 border-t-2 border-[#b59962]"><p className="eyebrow mt-8">LIVE PREVIEW</p><StrategyCaseDetail item={parsed} preview /></div>}
  </div>;
}
