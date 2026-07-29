# 余氏案例智庫｜YU Strategy Atlas

以企業、歷史政權／領導者、文化 IP、兵法與 YMOS 六層架構，整理每日《余氏商業案例研究》的繁體中文響應式網站。

## 已完成範圍

- Next.js App Router、TypeScript、Tailwind CSS 4 響應式前台
- 首頁、每日研究列表、完整文章詳情
- 企業、政權／領導者、IP、兵法、YMOS 六層索引
- 管理後台與新增文章基礎路由（可擴充 CRUD／Markdown parser）
- Supabase Auth server client、PostgreSQL schema、RLS、圖片 bucket
- 企業／領導者／IP 前一日及過去 30 天避重：TypeScript 預檢與 PostgreSQL 發布保護
- 兩篇完整範例研究與 Supabase seed
- Vitest 基本測試、ESLint、TypeScript 與 production build scripts

## 目錄

```text
src/
  app/                 頁面與路由
    articles/[slug]/   文章詳情
    [collection]/      五種資料索引
    admin/             管理後台骨架
  components/          共用介面元件
  data/                離線範例資料
  lib/                 型別、Supabase、避重邏輯
supabase/
  migrations/          初始 schema、RLS、SQL 函式
  seed.sql             範例資料
```

## 本機啟動

需求：Node.js 20.9+、pnpm 9+（npm 亦可）。

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

開啟 `http://localhost:3000`。未設定 Supabase 時，前台仍會載入 `src/data/articles.ts` 的範例資料，後台顯示展示模式。

## Supabase 設定

1. 在 Supabase 建立專案，從 Project Settings → API 取得 URL、anon key 與 service role key。
2. 安裝 Supabase CLI，登入並連結專案：

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase db seed
```

3. 複製 `.env.example` 為 `.env.local` 並填入：

```dotenv
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_SERVICE_ROLE_KEY` 只能在伺服器使用，禁止加上 `NEXT_PUBLIC_` 或提交 Git。

4. 在 Authentication 設定允許的登入方式。建立首位使用者後，在 SQL Editor 將其加入管理者：

```sql
insert into public.profiles (id, display_name, role)
values ('AUTH_USER_UUID', '管理者', 'admin');
```

### 避重發布流程

編輯器可先呼叫 `checkCaseDuplicates` 即時顯示衝突。正式發布時，資料庫的 deferred constraint trigger 會呼叫 `check_article_case_duplicates(article_id)`；只要同類企業、領導者或 IP 在發布日前 1–29 天出現，就拒絕交易。前一日衝突會回傳 `previous_day`，其餘回傳 `within_30_days`。

建議交易順序：建立草稿 → 寫入三類關聯 → 將 status 更新為 `published` → commit。案例剛好在 30 天前出現可再次使用。

## 品質檢查

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## GitHub

```bash
git init
git add .
git commit -m "feat: initialize YU Strategy Atlas"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/yu-strategy-atlas.git
git push -u origin main
```

## Vercel 部署

1. 將 GitHub repository 匯入 Vercel。
2. Framework Preset 選 Next.js，Build Command 保持 `pnpm build`。
3. 在 Project Settings → Environment Variables 加入三個 Supabase 變數（service role 僅供 server）。
4. 在 Supabase Authentication → URL Configuration 加入正式網域與 `https://YOUR_DOMAIN/**` redirect URL。
5. 部署後檢查首頁、任一文章頁及 `/admin`。

## 下一階段建議

- 將範例 repository 改為 Supabase query，加入快取與 preview mode
- 完成管理後台登入、文章 CRUD、Markdown 欄位 parser 與封面上傳
- 自動標籤、全文搜尋、篩選、三案例比較
- 增加 Playwright E2E、SQL/pgtap 測試與 CI workflow
- 加入內容版本紀錄、預覽、排程發布與審核流程
