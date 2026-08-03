-- Additive unified research layer. Existing strategy, body and nature tables remain unchanged.
create table if not exists public.research_articles(
 id uuid primary key default gen_random_uuid(),
 entry_number integer not null check(entry_number>0),
 library text not null check(library in('business-leadership','medical-research','earth-nature','world-therapies','medical-cases','humanities')),
 article_type text not null,
 slug text not null unique,
 research_date date not null,
 title text not null,
 subtitle text,
 summary text not null,
 body_markdown text not null,
 keywords jsonb not null default '[]',
 entities jsonb not null default '[]',
 sources jsonb not null default '[]',
 evidence_limits text,
 content jsonb not null default '{}',
 status text not null default 'pending_review' check(status in('draft','pending_review','published','rejected','archived')),
 manually_edited boolean not null default false,
 published_at timestamptz,
 created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(library,entry_number)
);

create table if not exists public.ymos_takeaways(
 id uuid primary key default gen_random_uuid(),
 source_article_id uuid not null unique references public.research_articles(id) on delete cascade,
 core_fact text not null,
 core_question text,
 takeaway_sentence text not null,
 individual_layer text,
 team_layer text,
 system_layer text,
 ecosystem_layer text,
 primary_element text,
 secondary_element text,
 life_system_mapping text,
 management_insight text,
 education_insight text,
 brand_insight text,
 ai_insight text,
 health_insight text,
 applicable_scenarios jsonb not null default '[]',
 misuse_warnings jsonb not null default '[]',
 related_knowledge jsonb not null default '[]',
 status text not null default 'pending_review' check(status in('draft','pending_review','published','rejected','archived')),
 created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create index if not exists research_library_type_idx on public.research_articles(library,article_type,status);
create index if not exists research_date_idx on public.research_articles(research_date desc,status);
create index if not exists research_status_idx on public.research_articles(status);
create index if not exists ymos_takeaway_status_idx on public.ymos_takeaways(status,updated_at desc);

create trigger touch_research_articles before update on public.research_articles for each row execute function public.touch_updated_at();
create trigger touch_ymos_takeaways before update on public.ymos_takeaways for each row execute function public.touch_updated_at();

alter table public.research_articles enable row level security;
alter table public.ymos_takeaways enable row level security;
create policy "public reads published research" on public.research_articles for select using(status='published' or created_by=auth.uid());
create policy "owners manage research" on public.research_articles for all to authenticated using(created_by=auth.uid()) with check(created_by=auth.uid());
create policy "public reads published takeaways" on public.ymos_takeaways for select using(status='published' or created_by=auth.uid());
create policy "owners manage takeaways" on public.ymos_takeaways for all to authenticated using(created_by=auth.uid()) with check(created_by=auth.uid());
