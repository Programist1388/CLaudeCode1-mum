@AGENTS.md

# SIYANIE (СИЯНИЕ)

Handmade rhinestone ("стразы") apparel and home textiles — hoodies, t-shirts,
pillows with one-of-a-kind crystal-laid prints, made to order. Business is
based in Russia; the whole UI is Russian-only. There is **no online
payment** — a customer builds a cart, then "checkout" compiles it into a
plain-text order message and opens a prefilled WhatsApp (or Telegram)
chat with the shop owner, who confirms availability, price, and a 50%
prepayment manually, exactly like the shop's original manual process.

## Tech stack

- **Next.js 16 (App Router, TypeScript)** — see `AGENTS.md`, this is a very
  recent major version; check `node_modules/next/dist/docs/` before assuming
  an API from training data still works the same way. One concrete example:
  `middleware.ts` was renamed to **`proxy.ts`** (exported function `proxy`,
  not `middleware`) in this version — that's what guards `/admin`.
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config.ts` — see
  `app/globals.css`).
- **Supabase** (Postgres + Storage + Auth) — the product/category database,
  photo storage, and the single admin login. No separate CMS account; the
  owner manages everything from `/admin` on her own site.
- **Vercel** for hosting, deploying the `main` branch of
  `github.com/Programist1388/CLaudeCode1-mum`.

## Folder structure

```
app/
  layout.tsx                 root layout: fonts, <html lang="ru">, wraps CartProvider
  globals.css                design tokens (ported from the original static site) + Tailwind
  page.tsx                   home page — fetches products, composes all sections
  catalog/[slug]/page.tsx    product detail page
  cart/page.tsx              cart review + "Оформить заказ" (WhatsApp/Telegram)
  admin/
    login/page.tsx            email+password login (no nav shell)
    (dashboard)/               route group — URL stays /admin, /admin/products, etc.
      layout.tsx               nav shell + logout, shown only for logged-in pages
      page.tsx                 dashboard: product count + category count
      categories/page.tsx      category list + inline add/edit/delete
      products/page.tsx        product table (edit/delete)
      products/new/page.tsx    create form (shares ProductForm)
      products/[id]/edit/page.tsx   edit form (shares ProductForm)

proxy.ts                     route guard for /admin/** (see Tech stack note above)

components/
  layout/     Header, Footer, Wrap (max-width page container)
  home/       static homepage sections (Hero, Sparkles, StatsRow, ProcessSection,
              CareSection, OrderSection) — content here is hardcoded React, not in the DB
  catalog/    CatalogGrid, ProductCard, PriceTag
  cart/       CartButton, CartLineItem, AddToCartButton, OrderSummaryBuilder
  admin/      LogoutButton, CategoriesManager, ProductForm, ImageUploader, ProductsTable
  ImagePlaceholder.tsx   stand-in shown wherever a product/section photo is missing

lib/
  types.ts                shared Product type (storefront-facing, DB-agnostic)
  format.ts                formatPriceRub()
  order-links.ts           WhatsApp/Telegram link builders + contact info (env-driven)
  cart/       cart-context.tsx (CartProvider/useCart), cart-storage.ts (localStorage)
  supabase/
    client.ts   browser client (anon key) — used by login, image upload, admin forms
    server.ts   server client (cookies via next/headers) — Server Components, Server
                Actions, used by proxy.ts too (constructed inline there, not imported,
                since proxy needs request-bound cookies, not next/headers)
    types.ts    CategoryRow, ProductRow (raw DB shapes)
    queries.ts  getAllProducts, getProductBySlug, getAllCategories — maps DB rows to
                the storefront Product type
    mutations.ts  Server Actions: create/update/delete for products and categories,
                  each calling revalidatePath() after writing
```

## Dev commands

```
npm install
npm run dev         # next dev — also serves /admin, no separate command needed
npm run build
npm run lint
npm run typecheck   # tsc --noEmit
```

## Where content lives

- **Products, prices, photos, categories, availability** → `/admin` on the
  live site (or `localhost:3000/admin` locally). Not in code. See
  `lib/supabase/types.ts` for the exact fields and the SQL below for the
  schema.
- **Everything else** (hero copy, process steps, care instructions, contact
  links) → plain React content in `components/home/*.tsx`, edited via code.
  This was a deliberate scope decision: only the product catalog was asked
  to be self-service.
- **Contact details** (WhatsApp number, Telegram handle, email) are read
  from env vars via `lib/order-links.ts`, not hardcoded per-component.

## Admin panel

- Single admin user, email+password, via Supabase Auth. No public sign-up
  route exists anywhere in the app.
- `proxy.ts` protects every `/admin/**` route except `/admin/login`,
  redirecting unauthenticated requests to the login page (and logged-in
  users away from `/admin/login` to the dashboard). It calls
  `supabase.auth.getUser()` (not `getSession()`) since that revalidates the
  token against Supabase rather than trusting a possibly-stale cookie.
- If `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` aren't set,
  `proxy.ts` returns a plain 503 message instead of crashing — `/admin`
  simply can't function before Supabase is configured (see setup below).
- No service-role key is used anywhere in the app. Every read/write goes
  through the anon key, and Row Level Security policies (see SQL below) are
  what actually confine writes to the logged-in admin — the storefront's
  anon key can only ever read.
- Image uploads (`components/admin/ImageUploader.tsx`) go straight from the
  browser to the `product-images` Storage bucket using the admin's
  authenticated session — no server-side proxy route needed, since Storage
  RLS already restricts writes to authenticated users.

## Supabase setup (one-time, owner performs this — see below)

```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text default '',
  images text[] not null default '{}',
  price_value numeric not null,
  price_is_from boolean not null default false,
  badge text,
  tags text[] not null default '{}',
  category_id uuid references categories(id) on delete set null,
  available boolean not null default true,
  order_index integer,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;
alter table products enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read available products" on products for select
  using (available = true or auth.role() = 'authenticated');

create policy "admin write categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write products" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

create policy "public read product images" on storage.objects for select
  using (bucket_id = 'product-images');
create policy "admin write product images" on storage.objects for all
  using (bucket_id = 'product-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
```

### One-time setup only the project owner can do (not Claude)

1. Create a free Supabase project, get the project URL + anon key
   (Project Settings -> API).
2. Paste the SQL above into the Supabase SQL Editor and run it once.
3. Create the admin user in Supabase Dashboard -> Authentication -> Users ->
   Add user (sets her own password there — not shared with Claude).
4. Set `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
   and local `.env.local`.
5. Add real product photography via `/admin/products/new` (or edit) — the
   repo ships with no photos; `ImagePlaceholder` renders "Фото скоро будет"
   until then.

## Design system rules

- Colors and fonts are CSS custom properties in `app/globals.css` (`--bg`,
  `--gold`, `--gold-soft`, etc., ported verbatim from the original static
  site), exposed to Tailwind via `@theme inline` as `bg-*`/`text-*`
  utilities (e.g. `bg-card`, `text-gold-soft`, `border-line`). **Don't
  hardcode hex colors in components** — add/adjust the token in
  `globals.css` instead so it stays in one place.
- Fonts: Cormorant Garamond (serif/headings) and Manrope (sans/body), loaded
  via `next/font/google` in `app/layout.tsx`.
- No UI component library — the site is small and bespoke; keep it that way
  rather than introducing one. The admin panel follows the same tokens
  (dark/gold), it's not a separate visual system.

## Cart / order flow

- Client-side only: `CartProvider` (`lib/cart/cart-context.tsx`) holds cart
  state in React state, mirrored to `localStorage`. No order database, no
  payment gateway (Stripe doesn't support Russian businesses; the owner
  explicitly deferred ЮKassa/CloudPayments-style integration for now).
- `/cart` builds a plain-text order summary
  (`components/cart/OrderSummaryBuilder.ts`) and opens
  `https://wa.me/<number>?text=<encoded summary>`. Telegram doesn't support
  reliable message prefill, so that path copies the summary to the
  clipboard instead and opens the plain Telegram link.
- The cart is **not** auto-cleared after "Оформить заказ" — the user gets an
  explicit "Очистить корзину" action instead.

## Environment variables

| Variable | Purpose | Where to set |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL — required; `/admin` returns a 503 message if this is unset | Vercel + local `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) API key — RLS policies confine what it can actually do | Vercel + `.env.local` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Order-message target number | Vercel + `.env.local` |
| `NEXT_PUBLIC_TELEGRAM_HANDLE` | Order-message target handle | Vercel + `.env.local` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown in the contact section | Vercel + `.env.local` |

Copy `.env.example` to `.env.local` for local dev. `.env.local` is
git-ignored; `.env.example` is intentionally committed as the template.

## Deployment

Vercel auto-deploys `main`.

## Conventions

- UI copy is Russian-only.
- Prices are formatted "6 900 ₽" / "от 3 500 ₽" via `lib/format.ts` — reuse
  it rather than formatting numbers inline.
- Server components by default; add `"use client"` only where state,
  effects, or browser APIs (cart, localStorage, clipboard, file upload) are
  actually needed.
- `params` in dynamic routes are `Promise`s (Next 16) — `await params`.
- Every product write goes through `lib/supabase/mutations.ts` Server
  Actions (which call `revalidatePath`) — don't call `supabase.from(...)`
  directly from a client component for writes; reads are fine client-side
  (e.g. image upload uses the browser client for Storage only).

## Known non-goals (by design, not oversight)

No online payments, no user accounts beyond the single admin, no order
history page, no automated inventory decrement — `available` on a product
is a manual toggle in `/admin`, no analytics/order stats (dashboard is just
product/category counts, as requested).
