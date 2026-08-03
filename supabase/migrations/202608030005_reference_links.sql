-- Shared curated web source registry with two independent views.
create table if not exists public.reference_links(
 id uuid primary key default gen_random_uuid(),
 collection text not null check(collection in('knowledge','tcm')),
 title text not null,
 url text not null,
 publisher text,
 description text not null,
 category text not null,
 tags jsonb not null default '[]',
 language text not null default 'zh-Hant',
 source_type text,
 reliability text not null default 'unreviewed' check(reliability in('primary','authoritative','useful','unreviewed','caution')),
 ai_use text not null default 'reference' check(ai_use in('reference','rag','fact-check','discovery','do-not-train')),
 notes text,
 last_accessed date not null default current_date,
 status text not null default 'active' check(status in('active','broken','archived')),
 created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(collection,url)
);
create index if not exists reference_links_collection_idx on public.reference_links(collection,status,category);
create index if not exists reference_links_updated_idx on public.reference_links(updated_at desc);
create trigger touch_reference_links before update on public.reference_links for each row execute function public.touch_updated_at();
alter table public.reference_links enable row level security;
create policy "public reads active reference links" on public.reference_links for select using(status='active' or created_by=auth.uid());
create policy "owners manage reference links" on public.reference_links for all to authenticated using(created_by=auth.uid()) with check(created_by=auth.uid());
