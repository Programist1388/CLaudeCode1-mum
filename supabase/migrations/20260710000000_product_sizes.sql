-- Lets each product declare what kind of size selector its customers see
-- before adding it to the cart: clothing sizes (XS-XXL), shoe sizes
-- (EU 36-45), or none (home textiles like pillows aren't sized).
alter table products add column size_type text not null default 'clothing'
  check (size_type in ('clothing', 'shoes', 'none'));

-- The only existing footwear product predates this column and would
-- otherwise inherit the 'clothing' default, which is wrong for it.
update products set size_type = 'shoes' where slug = 'shoes';
