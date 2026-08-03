# YMOS 個人知識工作台

## 架構與相容性

- 既有 `strategy_cases`、`articles`、`/articles` 與 StrategyCase JSON 結構保持不變。
- 每日思想獨立儲存在 `ymos_thoughts`，可選擇以 `source_article_id` 關聯 `strategy_cases.id`。
- 新工作台頁面皆會在伺服器端檢查 Supabase session；RLS 另以 `created_by = auth.uid()` 強制所有權。
- migration 是新增式操作，不刪除或改寫現有資料。

## 路由

- `/` 工作台；`/articles` 策略案例；`/thoughts` 每日思想
- `/thoughts/[slug]` 思想詳細頁
- `/admin/thoughts/new`、`/admin/thoughts/[id]/edit` 完整編輯
- `/admin/thoughts/import` JSON 匯入
- `/topics` 主題標籤；`/inbox` 待整理；`/search` 全站搜尋
- `/api/thoughts/export` 匯出全部或篩選結果；加 `?id=<uuid>` 匯出單筆

## 啟動、測試與部署

1. 複製 `.env.example` 為 `.env.local`，設定既有 `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`；沒有新增環境變數。
2. 先在 Supabase SQL Editor 備份現有 schema，再執行 `supabase/migrations/202608030001_ymos_thoughts.sql`。此 migration 不包含破壞性資料變更。
3. 執行 `pnpm install`、`pnpm dev`；檢查 `pnpm typecheck && pnpm test && pnpm build`。
4. 登入後可在 `/admin/thoughts/import` 匯入 `src/data/thoughts.example.json` 的三筆測試資料。
5. 將變更推送至 Vercel 連接的 Git branch；確認環境變數後部署。migration 必須先於新版本流量執行。

## JSON 格式

接受單一物件或物件陣列。必要欄位為 `thought_date`、`title`、`content`、`thought_type`、`primary_element`、`tags`、`status`、`maturity_level`；允許值由 `src/types/thought.ts` 定義。匯入錯誤會顯示資料筆數、欄位路徑與原因。

## 已知限制與後續

- 第一階段搜尋使用 PostgREST `ilike`，標籤陣列與 StrategyCase JSON 深層欄位仍可再以 PostgreSQL RPC/全文索引加強。
- 批次刪除與單筆刪除應在視覺驗收後再加自訂確認對話框；目前介面已有明確破壞性標示。
- 快速記錄成功後進入待整理頁；完整的 modal 鍵盤 focus trap 可後續補強。
- 可後續加入分頁、資料庫全文搜尋、稽核記錄與軟刪除；本階段未加入 AI、向量搜尋或知識圖譜。
