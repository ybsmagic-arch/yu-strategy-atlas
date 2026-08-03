# YMOS 自然智慧百科

## Migration

先備份 Supabase schema，再執行 `supabase/migrations/202608030003_natural_wisdom.sql`。此 migration 僅新增 `natural_wisdom_entries` 與 `natural_daily_issues`，不修改既有案例、思想或生命系統表。

## JSON 匯入

管理者登入後前往 `/admin/nature`，貼上符合 `src/types/naturalWisdom.ts` 的單筆 JSON。可直接使用 `examples/natural-wisdom.example.json` 測試。匯入時會檢查 Zod schema、slug 與同名主角；同主角進階篇必須設定 `parentEntryId`。新資料固定進入 `pending_review`。

`entryNumber` 由 `(entry_type, entry_number)` 唯一限制，動物與植物／中藥可各自從 1 開始。

## 路由

- `/nature` 自然智慧總覽
- `/nature/animals` 動物智慧
- `/nature/plants` 植物／中藥智慧
- `/nature/levels/individual`、`team`、`system`、`ecosystem`
- `/nature/[slug]` 詳細頁
- `/nature/issues`、`/nature/issues/[date]` 日刊閱讀基礎頁
- `/admin/nature` JSON 匯入、篩選與狀態管理

## 第一階段限制

- 附件未包含目前已正式刊出的動物／植物目錄原始資料，因此 migration 不虛構或自動發布任何條目。請將正式資料轉成 schema 後由後台匯入及審核。
- 第一階段未實作每日日刊的後台編輯表單、條目刪除、完整 JSON 編輯頁與封面媒體上傳；資料表及前台日刊路由已準備完成。
- 關鍵字搜尋在已發布資料載入後比對；資料量增加時應改為 PostgreSQL Full Text Search 與分頁。

## 環境變數

沒有新增環境變數，沿用 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
