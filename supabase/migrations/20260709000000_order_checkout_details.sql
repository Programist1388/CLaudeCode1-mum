-- Checkout now collects name, phone, and delivery details (mandatory going
-- forward). Existing rows predate this and get empty-string defaults —
-- they were never asked for this, so backfilling a fake value would be
-- worse than an honest blank.
alter table orders add column customer_name text not null default '';
alter table orders add column customer_phone text not null default '';
alter table orders add column delivery_method text not null default '';
alter table orders add column delivery_address text not null default '';

-- These are personal data. The existing "public read orders" policy (from
-- 20260707000000_orders.sql) is `using (true)` — necessary so a customer
-- can look up their own order by its unguessable uuid without an account,
-- but RLS alone can't restrict which *columns* that exposes. Now that the
-- row holds a name/phone/address, an anonymous reader must not be able to
-- pull every customer's contact details out of the table. Postgres column
-- grants provide that: revoke anon's (Supabase-default) full-table SELECT
-- and re-grant it only for the columns the customer-facing status widget
-- actually needs.
revoke select on orders from anon;
grant select (id, status, created_at) on orders to anon;

-- The admin panel authenticates via Supabase Auth, so it gets its own
-- select policy for the full row (name/phone/address included).
create policy "admin read orders" on orders for select
  using (auth.role() = 'authenticated');
