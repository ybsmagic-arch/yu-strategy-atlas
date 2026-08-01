-- Complete StrategyCase canonical storage. Existing articles remain untouched.
create type public.strategy_case_status as enum ('draft','pending_review','verified','published','archived');
create type public.case_entity_type as enum ('company','leader','regime','ip','strategy','tag');

create table public.strategy_cases (
  id uuid primary key default gen_random_uuid(), slug text not null unique, case_date date not null,
  title text not null, subtitle text not null, summary text not null, central_theme text not null,
  tags text[] not null default '{}', status public.strategy_case_status not null default 'pending_review',
  content jsonb not null, manually_edited boolean not null default false,
  created_by uuid references public.profiles(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint strategy_cases_content_object check (jsonb_typeof(content)='object')
);
create index strategy_cases_date_idx on public.strategy_cases(case_date desc);
create index strategy_cases_status_idx on public.strategy_cases(status,case_date desc);
create index strategy_cases_tags_idx on public.strategy_cases using gin(tags);

create table public.case_entities (
  id uuid primary key default gen_random_uuid(), case_id uuid not null references public.strategy_cases(id) on delete cascade,
  entity_type public.case_entity_type not null, name text not null, normalized_name text not null, metadata jsonb not null default '{}',
  unique(case_id,entity_type,normalized_name)
);
create index case_entities_lookup_idx on public.case_entities(entity_type,normalized_name);

create table public.case_sources (
  id uuid primary key default gen_random_uuid(), case_id uuid not null references public.strategy_cases(id) on delete cascade,
  title text not null, url text not null, source_type text not null, note text not null default '', position smallint not null default 1
);
create index case_sources_case_idx on public.case_sources(case_id,position);

create trigger touch_strategy_cases before update on public.strategy_cases for each row execute function public.touch_updated_at();
alter table public.strategy_cases enable row level security;
alter table public.case_entities enable row level security;
alter table public.case_sources enable row level security;
create policy "public read published strategy cases" on public.strategy_cases for select using(status='published' or created_by=auth.uid());
create policy "public read strategy entities" on public.case_entities for select using(exists(select 1 from public.strategy_cases c where c.id=case_id and c.status='published'));
create policy "public read strategy sources" on public.case_sources for select using(exists(select 1 from public.strategy_cases c where c.id=case_id and c.status='published'));
create policy "editors manage strategy cases" on public.strategy_cases for all to authenticated using(exists(select 1 from public.profiles where id=auth.uid())) with check(exists(select 1 from public.profiles where id=auth.uid()));
create policy "editors manage strategy entities" on public.case_entities for all to authenticated using(exists(select 1 from public.profiles where id=auth.uid())) with check(exists(select 1 from public.profiles where id=auth.uid()));
create policy "editors manage strategy sources" on public.case_sources for all to authenticated using(exists(select 1 from public.profiles where id=auth.uid())) with check(exists(select 1 from public.profiles where id=auth.uid()));
