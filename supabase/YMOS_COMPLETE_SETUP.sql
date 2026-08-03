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



-- Fixed General Herbs teaching taxonomy: catalog > chapter > subcategory > canonical herb.
create table if not exists public.tcm_herb_categories(
 code text primary key,parent_code text references public.tcm_herb_categories(code) on delete cascade,
 level integer not null check(level in(1,2)),chapter_number integer not null,display_order integer not null,
 name_zh text not null,unique(parent_code,name_zh)
);
create table if not exists public.tcm_herb_catalog_items(
 id uuid primary key default gen_random_uuid(),category_code text not null references public.tcm_herb_categories(code) on delete cascade,
 herb_code text not null unique,name_zh text not null,display_order integer not null,
 entity_id uuid unique references public.tcm_entities(id) on delete set null
);
alter table public.tcm_herb_categories enable row level security;alter table public.tcm_herb_catalog_items enable row level security;
create policy "public reads herb categories" on public.tcm_herb_categories for select using(true);
create policy "authenticated manage herb categories" on public.tcm_herb_categories for all to authenticated using(true) with check(true);
create policy "public reads herb catalog items" on public.tcm_herb_catalog_items for select using(true);
create policy "authenticated manage herb catalog items" on public.tcm_herb_catalog_items for all to authenticated using(true) with check(true);

insert into public.tcm_herb_categories(code,parent_code,level,chapter_number,display_order,name_zh) values
('HERB-CAT-01',null,1,1,1,'解表藥'),('HERB-CAT-02',null,1,2,2,'清熱藥'),('HERB-CAT-03',null,1,3,3,'瀉下藥'),('HERB-CAT-04',null,1,4,4,'祛風濕藥'),('HERB-CAT-05',null,1,5,5,'化濕藥'),('HERB-CAT-06',null,1,6,6,'利水滲濕藥'),('HERB-CAT-07',null,1,7,7,'溫裏藥'),('HERB-CAT-08',null,1,8,8,'理氣藥'),('HERB-CAT-09',null,1,9,9,'消食藥'),('HERB-CAT-10',null,1,10,10,'驅蟲藥'),('HERB-CAT-11',null,1,11,11,'止血藥'),('HERB-CAT-12',null,1,12,12,'活血化瘀藥'),('HERB-CAT-13',null,1,13,13,'化痰止咳平喘藥'),('HERB-CAT-14',null,1,14,14,'安神藥'),('HERB-CAT-15',null,1,15,15,'平肝息風藥'),('HERB-CAT-16',null,1,16,16,'開竅藥'),('HERB-CAT-17',null,1,17,17,'補虛藥'),('HERB-CAT-18',null,1,18,18,'收澀藥'),('HERB-CAT-19',null,1,19,19,'涌吐藥'),('HERB-CAT-20',null,1,20,20,'攻毒殺蟲止癢藥'),('HERB-CAT-21',null,1,21,21,'拔毒化腐生肌藥')
on conflict(code) do update set name_zh=excluded.name_zh,display_order=excluded.display_order;
insert into public.tcm_herb_categories(code,parent_code,level,chapter_number,display_order,name_zh) values
('HERB-CAT-01-01','HERB-CAT-01',2,1,1,'辛溫解表藥'),('HERB-CAT-01-02','HERB-CAT-01',2,1,2,'辛涼解表藥'),
('HERB-CAT-02-01','HERB-CAT-02',2,2,1,'清熱瀉火藥'),('HERB-CAT-02-02','HERB-CAT-02',2,2,2,'清熱燥濕藥'),('HERB-CAT-02-03','HERB-CAT-02',2,2,3,'清熱解毒藥'),('HERB-CAT-02-04','HERB-CAT-02',2,2,4,'清熱涼血藥'),('HERB-CAT-02-05','HERB-CAT-02',2,2,5,'清虛熱藥'),
('HERB-CAT-03-01','HERB-CAT-03',2,3,1,'攻下藥'),('HERB-CAT-03-02','HERB-CAT-03',2,3,2,'潤下藥'),('HERB-CAT-03-03','HERB-CAT-03',2,3,3,'峻下逐水藥'),
('HERB-CAT-04-01','HERB-CAT-04',2,4,1,'祛風寒濕藥'),('HERB-CAT-04-02','HERB-CAT-04',2,4,2,'祛風濕熱藥'),('HERB-CAT-04-03','HERB-CAT-04',2,4,3,'祛風濕、強筋骨藥'),
('HERB-CAT-06-01','HERB-CAT-06',2,6,1,'利水消腫藥'),('HERB-CAT-06-02','HERB-CAT-06',2,6,2,'利尿通淋藥'),('HERB-CAT-06-03','HERB-CAT-06',2,6,3,'利濕退黃藥'),
('HERB-CAT-11-01','HERB-CAT-11',2,11,1,'涼血止血藥'),('HERB-CAT-11-02','HERB-CAT-11',2,11,2,'化瘀止血藥'),('HERB-CAT-11-03','HERB-CAT-11',2,11,3,'收斂止血藥'),('HERB-CAT-11-04','HERB-CAT-11',2,11,4,'溫經止血藥'),
('HERB-CAT-12-01','HERB-CAT-12',2,12,1,'活血止痛藥'),('HERB-CAT-12-02','HERB-CAT-12',2,12,2,'活血調經藥'),('HERB-CAT-12-03','HERB-CAT-12',2,12,3,'活血療傷藥'),('HERB-CAT-12-04','HERB-CAT-12',2,12,4,'破血消癥藥'),
('HERB-CAT-13-01','HERB-CAT-13',2,13,1,'溫化寒痰藥'),('HERB-CAT-13-02','HERB-CAT-13',2,13,2,'清化熱痰藥'),('HERB-CAT-13-03','HERB-CAT-13',2,13,3,'止咳平喘藥'),
('HERB-CAT-14-01','HERB-CAT-14',2,14,1,'重鎮安神藥'),('HERB-CAT-14-02','HERB-CAT-14',2,14,2,'養心安神藥'),
('HERB-CAT-15-01','HERB-CAT-15',2,15,1,'平抑肝陽藥'),('HERB-CAT-15-02','HERB-CAT-15',2,15,2,'息風止痙藥'),
('HERB-CAT-17-01','HERB-CAT-17',2,17,1,'補氣藥'),('HERB-CAT-17-02','HERB-CAT-17',2,17,2,'補陽藥'),('HERB-CAT-17-03','HERB-CAT-17',2,17,3,'補血藥'),('HERB-CAT-17-04','HERB-CAT-17',2,17,4,'補陰藥'),
('HERB-CAT-18-01','HERB-CAT-18',2,18,1,'固表止汗藥'),('HERB-CAT-18-02','HERB-CAT-18',2,18,2,'斂肺澀腸藥'),('HERB-CAT-18-03','HERB-CAT-18',2,18,3,'固精縮尿止帶藥')
on conflict(code) do update set name_zh=excluded.name_zh,display_order=excluded.display_order;
insert into public.tcm_herb_catalog_items(category_code,herb_code,name_zh,display_order) values
('HERB-CAT-01-01','HERB-MAHUANG','麻黃',1),('HERB-CAT-01-01','HERB-GUIZHI','桂枝',2),('HERB-CAT-01-01','HERB-ZISUYE','紫蘇葉',3),('HERB-CAT-01-01','HERB-SHENGJIANG','生薑',4),('HERB-CAT-01-01','HERB-XIANGRU','香薷',5),('HERB-CAT-01-01','HERB-JINGJIE','荊芥',6),('HERB-CAT-01-01','HERB-FANGFENG','防風',7),('HERB-CAT-01-01','HERB-QIANGHUO','羌活',8),('HERB-CAT-01-01','HERB-BAIZHI','白芷',9),('HERB-CAT-01-01','HERB-XIXIN','細辛',10),('HERB-CAT-01-01','HERB-GAOBEN','藁本',11),('HERB-CAT-01-01','HERB-CANGERZI','蒼耳子',12),('HERB-CAT-01-01','HERB-XINYI','辛夷',13),('HERB-CAT-01-01','HERB-CONGBAI','蔥白',14),
('HERB-CAT-01-02','HERB-BOHE','薄荷',1),('HERB-CAT-01-02','HERB-NIUBANGZI','牛蒡子',2),('HERB-CAT-01-02','HERB-CHANTUI','蟬蛻',3),('HERB-CAT-01-02','HERB-SANGYE','桑葉',4),('HERB-CAT-01-02','HERB-JUHUA','菊花',5),('HERB-CAT-01-02','HERB-MANJINGZI','蔓荊子',6),('HERB-CAT-01-02','HERB-CHAIHU','柴胡',7),('HERB-CAT-01-02','HERB-SHENGMA','升麻',8),('HERB-CAT-01-02','HERB-GEGEN','葛根',9),('HERB-CAT-01-02','HERB-DANDOUCHI','淡豆豉',10),('HERB-CAT-01-02','HERB-FUPING','浮萍',11),('HERB-CAT-01-02','HERB-MUZEI','木賊',12)
on conflict(herb_code) do update set category_code=excluded.category_code,name_zh=excluded.name_zh,display_order=excluded.display_order;



