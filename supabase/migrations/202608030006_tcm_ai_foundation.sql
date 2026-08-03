-- YMOS TCM AI Knowledge Foundation. Structured for RAG, graph and training exports.
create table if not exists public.tcm_entities(
 id uuid primary key default gen_random_uuid(),
 entity_type text not null check(entity_type in('herb','formula','meridian','acupoint','ear-point','tung-point','pattern','treatment','classic','physician','medical-case')),
 canonical_code text not null unique,
 name_zh text not null,
 name_original text,
 name_en text,
 pinyin text,
 summary text not null,
 content jsonb not null default '{}',
 tags jsonb not null default '[]',
 evidence_limits text,
 status text not null default 'pending_review' check(status in('draft','pending_review','published','rejected','archived')),
 manually_edited boolean not null default false,
 published_at timestamptz,
 created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table if not exists public.tcm_aliases(
 id uuid primary key default gen_random_uuid(),entity_id uuid not null references public.tcm_entities(id) on delete cascade,
 alias text not null,language text not null default 'zh-Hant',alias_type text not null default 'alternate',unique(entity_id,alias)
);
create table if not exists public.tcm_claims(
 id uuid primary key default gen_random_uuid(),entity_id uuid not null references public.tcm_entities(id) on delete cascade,
 predicate text not null,value text not null,knowledge_layer text not null check(knowledge_layer in('classic','traditional','standard','modern-research','clinical-experience','yu-interpretation','ai-inference')),
 source_title text,source_url text,source_locator text,evidence_level text not null default 'unreviewed',review_status text not null default 'pending_review' check(review_status in('pending_review','verified','rejected')),
 created_at timestamptz not null default now()
);
create table if not exists public.tcm_relationships(
 id uuid primary key default gen_random_uuid(),source_entity_id uuid not null references public.tcm_entities(id) on delete cascade,
 predicate text not null,target_code text not null,target_entity_id uuid references public.tcm_entities(id) on delete set null,
 note text,source_title text,evidence_level text not null default 'unreviewed',unique(source_entity_id,predicate,target_code)
);
create index if not exists tcm_entity_type_idx on public.tcm_entities(entity_type,status);
create index if not exists tcm_entity_name_idx on public.tcm_entities(name_zh);
create index if not exists tcm_claim_entity_idx on public.tcm_claims(entity_id,knowledge_layer,review_status);
create index if not exists tcm_relation_source_idx on public.tcm_relationships(source_entity_id,predicate);
create index if not exists tcm_relation_target_idx on public.tcm_relationships(target_code);
create trigger touch_tcm_entities before update on public.tcm_entities for each row execute function public.touch_updated_at();
alter table public.tcm_entities enable row level security;alter table public.tcm_aliases enable row level security;alter table public.tcm_claims enable row level security;alter table public.tcm_relationships enable row level security;
create policy "public reads published tcm entities" on public.tcm_entities for select using(status='published' or created_by=auth.uid());
create policy "owners manage tcm entities" on public.tcm_entities for all to authenticated using(created_by=auth.uid()) with check(created_by=auth.uid());
create policy "public reads aliases" on public.tcm_aliases for select using(exists(select 1 from public.tcm_entities e where e.id=entity_id and (e.status='published' or e.created_by=auth.uid())));
create policy "owners manage aliases" on public.tcm_aliases for all to authenticated using(exists(select 1 from public.tcm_entities e where e.id=entity_id and e.created_by=auth.uid())) with check(exists(select 1 from public.tcm_entities e where e.id=entity_id and e.created_by=auth.uid()));
create policy "public reads claims" on public.tcm_claims for select using(exists(select 1 from public.tcm_entities e where e.id=entity_id and (e.status='published' or e.created_by=auth.uid())));
create policy "owners manage claims" on public.tcm_claims for all to authenticated using(exists(select 1 from public.tcm_entities e where e.id=entity_id and e.created_by=auth.uid())) with check(exists(select 1 from public.tcm_entities e where e.id=entity_id and e.created_by=auth.uid()));
create policy "public reads tcm relations" on public.tcm_relationships for select using(exists(select 1 from public.tcm_entities e where e.id=source_entity_id and (e.status='published' or e.created_by=auth.uid())));
create policy "owners manage tcm relations" on public.tcm_relationships for all to authenticated using(exists(select 1 from public.tcm_entities e where e.id=source_entity_id and e.created_by=auth.uid())) with check(exists(select 1 from public.tcm_entities e where e.id=source_entity_id and e.created_by=auth.uid()));
