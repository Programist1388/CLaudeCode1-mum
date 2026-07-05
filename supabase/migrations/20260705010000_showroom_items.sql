create table showroom_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image text not null,
  order_index integer,
  created_at timestamptz not null default now()
);

alter table showroom_items enable row level security;

create policy "public read showroom items" on showroom_items for select using (true);
create policy "admin write showroom items" on showroom_items for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public) values ('showroom-images', 'showroom-images', true);

create policy "public read showroom images" on storage.objects for select
  using (bucket_id = 'showroom-images');
create policy "admin write showroom images" on storage.objects for all
  using (bucket_id = 'showroom-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'showroom-images' and auth.role() = 'authenticated');
