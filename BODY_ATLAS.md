# 人體生命系統知識庫操作說明

## 資料隔離

人體文章使用 `body_articles`，生理軸使用 `physiological_axes`，器官防重索引使用 `body_organs`。三者不寫入 `articles`、`strategy_cases` 或 `ymos_thoughts`，因此人體內容不會出現在 `/articles`。

`body_articles.content` 保存完整 BodyArticle JSON；常用搜尋欄位另存為實體欄位並建立索引。內容的 `contentLayers` 明確區分 `medicalFact`、`tcmTheory`、`clinicalAssociation`、`yuInterpretation` 與 `yuHypothesis`。

## Migration

1. 先備份 Supabase schema。
2. 在 SQL Editor 執行 `supabase/migrations/202608030002_body_atlas.sql`，或使用既有 Supabase CLI migration 流程。
3. migration 僅新增資料表、索引、RLS、trigger 與 17 筆器官索引，不刪除或改寫既有案例資料。

## 匯入、審核與發布

1. 管理者登入後進入 `/admin/body-atlas`。
2. 貼上 JSON 或上傳 `.json`；可直接使用 `examples/body-article.example.json`。
3. 點擊「預覽並驗證」。前端通過後才會顯示儲存按鈕，伺服器仍會再次驗證。
4. slug、日期、中文名、英文名、aliases 與器官索引會執行重複檢查。既有器官的深入文章必須標記指定專題類型。
5. 新匯入內容固定為 `pending_review`、`manuallyEdited=false`。
6. 從文章審核清單開啟 JSON 編輯／完整文章預覽。人工儲存後 `manuallyEdited=true`。
7. 可退回 `draft`、保持 `pending_review` 或發布為 `published`。

## 新增 Axis

在 `/admin/body-atlas` 填寫 Axis 表單。證據層級必須為 `established`、`widely_researched`、`emerging` 或 `yu_hypothesis`。瀏覽頁 `/body-atlas/axes` 會以繁體中文標籤顯示證據層級。

## 路由

- `/body-atlas` 首頁與今日器官
- `/body-atlas/articles` 搜尋與篩選
- `/body-atlas/articles/[slug]` 固定 17 章文章頁
- `/body-atlas/organs` 器官索引
- `/body-atlas/systems` 人體系統分類
- `/body-atlas/axes` 生理軸資料庫
- `/body-atlas/tcm` 中醫與現代功能網路分層對照
- `/admin/body-atlas` 匯入、Axis 新增與審核
- `/admin/body-atlas/[id]/edit` JSON 編輯與預覽入口

## 安全與限制

- 未信任內容只以 React 純文字輸出，不使用 `dangerouslySetInnerHTML`。
- RLS 允許公開讀取 `published` 人體文章；未發布內容只允許建立者讀寫。管理頁仍使用既有 Supabase 管理者登入。
- 第一版關鍵字搜尋會讀取篩選後的 BodyArticle JSON 再比對，資料量大時應改為 PostgreSQL Full Text Search RPC 與分頁。
- `.json` 上傳在瀏覽器本機讀取後走同一套驗證與匯入流程。
- migration 與範例資料不會自動套用至線上 Supabase，需由管理者人工執行。
