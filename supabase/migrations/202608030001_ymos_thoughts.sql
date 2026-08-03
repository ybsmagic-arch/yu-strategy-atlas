-- Additive, non-destructive migration for YMOS personal knowledge workbench.
create table if not exists public.ymos_thoughts (
  id uuid primary key default gen_random_uuid(), slug text unique not null,
  thought_date date not null default current_date, title text not null, summary text,
  content text not null, thought_type text not null default 'note', category text,
  primary_element text not null default '未分類', secondary_element text default '無',
  tags text[] not null default '{}', source_type text, source_reference text,
  source_article_id uuid null references public.strategy_cases(id) on delete set null,
  status text not null default 'inbox', maturity_level text not null default 'idea',
  manually_edited boolean not null default false, is_favorite boolean not null default false,
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), published_at timestamptz null,
  constraint ymos_thought_type check (thought_type in ('quote','note','reflection','deduction','framework','case_insight','teaching_note','medical_note','management_note')),
  constraint ymos_status check (status in ('inbox','developing','pending_review','completed','archived','published')),
  constraint ymos_maturity check (maturity_level in ('idea','observation','hypothesis','principle','rule')),
  constraint ymos_primary_element check (primary_element in ('木','火','土','金','水','未分類')),
  constraint ymos_secondary_element check (secondary_element is null or secondary_element in ('木','火','土','金','水','無'))
);
create index if not exists ymos_thoughts_date_idx on public.ymos_thoughts(thought_date desc);
create index if not exists ymos_thoughts_status_idx on public.ymos_thoughts(status, updated_at desc);
create index if not exists ymos_thoughts_tags_idx on public.ymos_thoughts using gin(tags);
create index if not exists ymos_thoughts_source_article_idx on public.ymos_thoughts(source_article_id) where source_article_id is not null;
drop trigger if exists touch_ymos_thoughts on public.ymos_thoughts;
create trigger touch_ymos_thoughts before update on public.ymos_thoughts for each row execute function public.touch_updated_at();
alter table public.ymos_thoughts enable row level security;
drop policy if exists "owner reads thoughts" on public.ymos_thoughts;
drop policy if exists "owner creates thoughts" on public.ymos_thoughts;
drop policy if exists "owner updates thoughts" on public.ymos_thoughts;
drop policy if exists "owner deletes thoughts" on public.ymos_thoughts;
create policy "owner reads thoughts" on public.ymos_thoughts for select to authenticated using (created_by = auth.uid());
create policy "owner creates thoughts" on public.ymos_thoughts for insert to authenticated with check (created_by = auth.uid());
create policy "owner updates thoughts" on public.ymos_thoughts for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy "owner deletes thoughts" on public.ymos_thoughts for delete to authenticated using (created_by = auth.uid());
