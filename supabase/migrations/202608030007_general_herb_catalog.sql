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
