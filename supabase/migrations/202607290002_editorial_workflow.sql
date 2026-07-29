-- Editorial workflow additions. Safe to apply after the initial schema.
alter table public.articles add column if not exists content jsonb not null default '{}'::jsonb;

create policy "users read own profile" on public.profiles
for select to authenticated using (id = auth.uid());

create policy "editors manage companies" on public.companies for all to authenticated
using (exists(select 1 from public.profiles where id=auth.uid()))
with check (exists(select 1 from public.profiles where id=auth.uid()));
create policy "editors manage leaders" on public.leaders for all to authenticated
using (exists(select 1 from public.profiles where id=auth.uid()))
with check (exists(select 1 from public.profiles where id=auth.uid()));
create policy "editors manage ips" on public.ips for all to authenticated
using (exists(select 1 from public.profiles where id=auth.uid()))
with check (exists(select 1 from public.profiles where id=auth.uid()));
create policy "editors manage stratagems" on public.stratagems for all to authenticated
using (exists(select 1 from public.profiles where id=auth.uid()))
with check (exists(select 1 from public.profiles where id=auth.uid()));
create policy "editors manage article companies" on public.article_companies for all to authenticated
using (exists(select 1 from public.profiles where id=auth.uid()))
with check (exists(select 1 from public.profiles where id=auth.uid()));
create policy "editors manage article leaders" on public.article_leaders for all to authenticated
using (exists(select 1 from public.profiles where id=auth.uid()))
with check (exists(select 1 from public.profiles where id=auth.uid()));
create policy "editors manage article ips" on public.article_ips for all to authenticated
using (exists(select 1 from public.profiles where id=auth.uid()))
with check (exists(select 1 from public.profiles where id=auth.uid()));
create policy "editors manage article stratagems" on public.article_stratagems for all to authenticated
using (exists(select 1 from public.profiles where id=auth.uid()))
with check (exists(select 1 from public.profiles where id=auth.uid()));
create policy "editors manage article ymos" on public.article_ymos_layers for all to authenticated
using (exists(select 1 from public.profiles where id=auth.uid()))
with check (exists(select 1 from public.profiles where id=auth.uid()));

-- The original deferred constraint trigger cannot set NEW.published_at.
create or replace function public.set_article_published_at() returns trigger
language plpgsql as $$
begin
  if new.status='published' and old.status is distinct from 'published' then
    new.published_at=coalesce(new.published_at,now());
  end if;
  return new;
end $$;
drop trigger if exists set_article_published_at on public.articles;
create trigger set_article_published_at before update of status on public.articles
for each row execute function public.set_article_published_at();
