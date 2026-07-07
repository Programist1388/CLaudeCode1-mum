-- Which messenger the customer opened at checkout — shown in /admin/orders
-- and in the Telegram notification, so the owner knows where the customer's
-- own message will arrive.

alter table orders add column channel text not null default 'whatsapp'
  check (channel in ('whatsapp', 'telegram'));
