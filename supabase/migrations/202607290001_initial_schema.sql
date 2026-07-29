-- YU Strategy Atlas initial schema (PostgreSQL / Supabase)
create extension if not exists pg_trgm;
create extension if not exists unaccent;

create type public.article_status as enum ('draft','published','archived');
create type public.case_kind as enum ('company','leader','ip');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);

create table public.companies (
  id uuid primary key default gen_random_uuid(), name text not null unique, normalized_name text not null unique,
  industry text, founding_background text, timeline jsonb not null default '[]', first_dividend text,
  entrepreneurial_core text, business_flywheel text, revenue_sources jsonb not null default '[]', fragile_revenue text,
  organization_level text, single_point_failure text, trust_crisis_path text,
  success_forces jsonb not null default '{}', organization_type text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.leaders (
  id uuid primary key default gen_random_uuid(), name text not null, normalized_name text not null,
  regime text not null default '', era_context text, core_dilemma text, breakthrough_method text,
  institution_design text, talent_strategy text, strategic_tradeoff text, historical_cost text,
  literature_sources jsonb not null default '[]', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(normalized_name, regime)
);

create table public.ips (
  id uuid primary key default gen_random_uuid(), name text not null unique, normalized_name text not null unique,
  ip_type text, origin text, core_narrative text, character_design text, emotional_hook text, worldview text,
  symbol_system text, community_mechanism text, platform_dividend text, monetization text,
  longevity_mechanism text, backlash_risk text, success_force_mix text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.stratagems (
  id uuid primary key default gen_random_uuid(), title text not null unique, source text not null,
  interpretation text, keywords text[] not null default '{}', created_at timestamptz not null default now()
);

create table public.ymos_layers (
  id smallint primary key check (id between 1 and 6), name text not null unique, description text
);

create table public.articles (
  id uuid primary key default gen_random_uuid(), slug text not null unique, publish_date date not null,
  title text not null, excerpt text not null, body_markdown text, cover_path text,
  status public.article_status not null default 'draft', strategy_actions jsonb not null default '[]',
  risks jsonb not null default '[]', sources jsonb not null default '[]', tags text[] not null default '{}',
  search_document tsvector generated always as (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(excerpt,'') || ' ' || coalesce(body_markdown,''))) stored,
  author_id uuid references public.profiles(id), published_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index articles_search_idx on public.articles using gin(search_document);
create index articles_publish_date_idx on public.articles(publish_date desc) where status='published';

create table public.article_companies (article_id uuid references public.articles on delete cascade, company_id uuid references public.companies, position smallint not null default 1, primary key(article_id,company_id));
create table public.article_leaders (article_id uuid references public.articles on delete cascade, leader_id uuid references public.leaders, position smallint not null default 1, primary key(article_id,leader_id));
create table public.article_ips (article_id uuid references public.articles on delete cascade, ip_id uuid references public.ips, position smallint not null default 1, primary key(article_id,ip_id));
create table public.article_stratagems (article_id uuid references public.articles on delete cascade, stratagem_id uuid references public.stratagems, note text, primary key(article_id,stratagem_id));
create table public.article_ymos_layers (article_id uuid references public.articles on delete cascade, layer_id smallint references public.ymos_layers, insight text not null, primary key(article_id,layer_id));

insert into public.ymos_layers(id,name) values
 (1,'觀耳辨證'),(2,'余氏生命系統學'),(3,'耳林高手'),(4,'醫生醫世小方茶'),(5,'YMOS'),(6,'理解生命．理解系統．理解世界運行');

create or replace function public.normalize_case_name(value text) returns text language sql immutable as $$
  select lower(regexp_replace(unaccent(normalize(trim(value), NFKC)), '[[:space:]·・|｜—–_-]+', '', 'g'));
$$;

create or replace function public.check_article_case_duplicates(target_article uuid)
returns table(kind public.case_kind, case_name text, conflicting_article uuid, conflicting_date date, reason text)
language sql stable security definer set search_path=public as $$
  with target as (select publish_date from articles where id=target_article),
  target_cases as (
    select 'company'::case_kind kind, c.id case_id, c.name case_name from article_companies x join companies c on c.id=x.company_id where x.article_id=target_article
    union all select 'leader'::case_kind,l.id,l.name from article_leaders x join leaders l on l.id=x.leader_id where x.article_id=target_article
    union all select 'ip'::case_kind,i.id,i.name from article_ips x join ips i on i.id=x.ip_id where x.article_id=target_article
  ), history as (
    select 'company'::case_kind kind,x.company_id case_id,x.article_id from article_companies x
    union all select 'leader'::case_kind,x.leader_id,x.article_id from article_leaders x
    union all select 'ip'::case_kind,x.ip_id,x.article_id from article_ips x
  )
  select tc.kind,tc.case_name,a.id,a.publish_date,
    case when a.publish_date=t.publish_date-1 then 'previous_day' else 'within_30_days' end
  from target_cases tc join history h using(kind,case_id) join articles a on a.id=h.article_id cross join target t
  where a.id<>target_article and a.status='published' and a.publish_date between t.publish_date-29 and t.publish_date-1;
$$;

create or replace function public.enforce_case_deduplication() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.status='published' and exists(select 1 from check_article_case_duplicates(new.id)) then
    raise exception '發布失敗：企業、領導者或 IP 與前一日／過去 30 天案例重複';
  end if;
  if new.status='published' and old.status is distinct from 'published' then new.published_at=coalesce(new.published_at,now()); end if;
  return new;
end $$;
create constraint trigger articles_prevent_duplicates after insert or update of status on public.articles deferrable initially deferred for each row execute function public.enforce_case_deduplication();

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now();return new;end $$;
create trigger touch_articles before update on public.articles for each row execute function public.touch_updated_at();
create trigger touch_companies before update on public.companies for each row execute function public.touch_updated_at();
create trigger touch_leaders before update on public.leaders for each row execute function public.touch_updated_at();
create trigger touch_ips before update on public.ips for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security; alter table public.articles enable row level security;
alter table public.companies enable row level security; alter table public.leaders enable row level security; alter table public.ips enable row level security;
alter table public.stratagems enable row level security; alter table public.ymos_layers enable row level security;
alter table public.article_companies enable row level security; alter table public.article_leaders enable row level security; alter table public.article_ips enable row level security;
alter table public.article_stratagems enable row level security; alter table public.article_ymos_layers enable row level security;

create policy "public read published articles" on public.articles for select using(status='published' or author_id=auth.uid());
create policy "public read companies" on public.companies for select using(true); create policy "public read leaders" on public.leaders for select using(true);
create policy "public read ips" on public.ips for select using(true); create policy "public read stratagems" on public.stratagems for select using(true);
create policy "public read ymos" on public.ymos_layers for select using(true);
create policy "public read article companies" on public.article_companies for select using(true); create policy "public read article leaders" on public.article_leaders for select using(true);
create policy "public read article ips" on public.article_ips for select using(true); create policy "public read article stratagems" on public.article_stratagems for select using(true);
create policy "public read article ymos" on public.article_ymos_layers for select using(true);
create policy "editors manage articles" on public.articles for all to authenticated using(exists(select 1 from profiles where id=auth.uid())) with check(exists(select 1 from profiles where id=auth.uid()));

insert into storage.buckets(id,name,public) values('article-covers','article-covers',true) on conflict(id) do nothing;
create policy "public read covers" on storage.objects for select using(bucket_id='article-covers');
create policy "editors upload covers" on storage.objects for insert to authenticated with check(bucket_id='article-covers' and exists(select 1 from public.profiles where id=auth.uid()));
