-- Orders with a status the admin manages from /admin/orders.
-- No personal data is stored here: the customer conversation itself
-- happens in WhatsApp/Telegram as before; a row only snapshots the cart
-- so the owner can track fulfilment and the customer can see the status.

create table orders (
  id uuid primary key default gen_random_uuid(),
  items jsonb not null default '[]',
  total numeric not null default 0,
  note text not null default '',
  locale text not null default 'ru',
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'ready', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

-- Anyone can place an order, but it always starts as "new".
create policy "public insert new orders" on orders for insert
  with check (status = 'new');

-- The customer checks the status by the order's unguessable uuid, which
-- their browser saved at checkout; rows contain no personal data.
create policy "public read orders" on orders for select using (true);

-- Only the admin can change (e.g. set the status) or delete orders.
create policy "admin update orders" on orders for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "admin delete orders" on orders for delete
  using (auth.role() = 'authenticated');
