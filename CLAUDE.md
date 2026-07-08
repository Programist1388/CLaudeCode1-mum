@AGENTS.md

# LAVANDA (ЛАВАНДА)

Handmade embroidered accessories — bags, caps, pins, and similar
one-of-a-kind pieces embroidered by hand, made to order. Business is
based in Russia. The storefront auto-detects the visitor's browser language
(Russian/English/French/Spanish — see "Internationalization" below); the
admin panel stays Russian-only, since there's a single Russian-speaking
owner. There is **no online payment** — a customer builds a cart, then
"checkout" compiles it into a plain-text order message (always in Russian,
regardless of site language) and opens a prefilled WhatsApp (or Telegram)
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
  page.tsx                   home page — Hero + Showroom (sliding gallery) + static sections
  catalog/page.tsx           full product listing, ?category=<slug> filter tabs
  catalog/[slug]/page.tsx    product detail page
  cart/page.tsx              cart review + "Оформить заказ" (WhatsApp/Telegram)
  admin/
    login/page.tsx            email+password login (no nav shell)
    (dashboard)/               route group — URL stays /admin, /admin/products, etc.
      layout.tsx               nav shell + logout, shown only for logged-in pages
      page.tsx                 dashboard: product/category/showroom counts
      orders/page.tsx          order list + fulfilment-status dropdown per order
      categories/page.tsx      category list + inline add/edit/delete
      products/page.tsx        product table (edit/delete)
      products/new/page.tsx    create form (shares ProductForm)
      products/[id]/edit/page.tsx   edit form (shares ProductForm)
      showroom/page.tsx        showroom gallery list + inline add/edit/delete

proxy.ts                     route guard for /admin/** (see Tech stack note above)

components/
  layout/     Header, Footer, Wrap (max-width page container)
  home/       static homepage sections (Hero, Sparkles, StatsRow, Showroom,
              ProcessSection, CareSection, OrderSection) — content here is hardcoded
              React, not in the DB, except Showroom which renders admin-managed
              showroom_items
  catalog/    CatalogGrid (also used standalone by app/catalog/page.tsx, with
              category filter tabs), ProductCard, PriceTag
  cart/       CartButton, CartLineItem, CartPageClient, AddToCartButton, OrderSummaryBuilder,
              OrderStatusList (customer-facing order statuses on /cart)
  admin/      LogoutButton, CategoriesManager, ProductForm, ShowroomManager,
              ImageUploader, ProductsTable, OrdersTable (status dropdown per order)
  layout/LanguageSwitcher.tsx   RU/EN/FR/ES links, sets the `locale` cookie + router.refresh()
  ImagePlaceholder.tsx   stand-in shown wherever a product/section photo is missing;
                         takes a `label` prop since it's rendered from Client Components
                         too and can't call getDictionary() itself (see i18n below)

lib/
  types.ts                shared Product/ShowroomItem types (storefront-facing, DB-agnostic)
  format.ts                formatPriceRub()
  order-links.ts           WhatsApp/Telegram link builders + contact info (env-driven)
  cart/       cart-context.tsx (CartProvider/useCart), cart-storage.ts (localStorage),
              order-storage.ts (ids of orders placed from this browser, newOrderId/orderNumber)
  i18n/
    locales.ts        SUPPORTED_LOCALES (ru/en/fr/es), DEFAULT_LOCALE, isLocale()
    dictionary.ts     the Dictionary TypeScript interface — source of truth for which
                      keys every locale file must provide
    dictionaries/     ru.ts, en.ts, fr.ts, es.ts — one full Dictionary object each
    get-dictionary.ts getLocale()/getDictionary() — read the `locale` cookie via
                      next/headers; Server Components only (see i18n below)
  supabase/
    client.ts   browser client (anon key) — used by login, image upload, admin forms
    server.ts   server client (cookies via next/headers) — Server Components, Server
                Actions, used by proxy.ts too (constructed inline there, not imported,
                since proxy needs request-bound cookies, not next/headers)
    types.ts    CategoryRow, ProductRow, ShowroomItemRow, OrderRow + ORDER_STATUSES (raw DB shapes)
    queries.ts  getAllProducts, getProductBySlug, getAllCategories,
                getAllShowroomItems, getAllOrders — maps DB rows to storefront types;
                products are joined with categories(slug) so /catalog can filter by category
    mutations.ts  Server Actions: create/update/delete for products, categories, and
                  showroom items, each calling revalidatePath() after writing; plus
                  createOrder (anon, called at checkout) and updateOrderStatus (admin)
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

- **Products, prices, photos, categories, availability, and the homepage
  showroom gallery** → `/admin` on the live site (or `localhost:3000/admin`
  locally). Not in code. See `lib/supabase/types.ts` for the exact fields
  and the SQL below for the schema.
- **Everything else** (hero copy, process steps, care instructions, contact
  links) → plain React content in `components/home/*.tsx`, edited via code.
  This was a deliberate scope decision: only the product catalog and
  showroom gallery were asked to be self-service.
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
  browser to Storage (the `product-images` or `showroom-images` bucket,
  selected via its `bucket` prop) using the admin's authenticated session —
  no server-side proxy route needed, since Storage RLS already restricts
  writes to authenticated users.

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

create table orders (
  id uuid primary key default gen_random_uuid(),
  items jsonb not null default '[]',
  total numeric not null default 0,
  note text not null default '',
  locale text not null default 'ru',
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'ready', 'cancelled')),
  channel text not null default 'whatsapp'
    check (channel in ('whatsapp', 'telegram')),
  customer_name text not null default '',
  customer_phone text not null default '',
  delivery_method text not null default '',
  delivery_address text not null default '',
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

create policy "public insert new orders" on orders for insert
  with check (status = 'new');
create policy "public read orders" on orders for select using (true);
create policy "admin update orders" on orders for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "admin delete orders" on orders for delete
  using (auth.role() = 'authenticated');
create policy "admin read orders" on orders for select
  using (auth.role() = 'authenticated');

-- customer_name/customer_phone/delivery_address are personal data; anon
-- (the customer-facing status widget) must not be able to read them off
-- other people's orders, so its SELECT is narrowed to non-PII columns.
revoke select on orders from anon;
grant select (id, status, created_at) on orders to anon;
```

This full schema (including `showroom_items` and `orders`) is already applied
to the live Supabase project via `supabase/migrations/*.sql` — the block above
just keeps the docs and the DB in sync for anyone reading this file first.

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

- The cart itself is client-side only: `CartProvider`
  (`lib/cart/cart-context.tsx`) holds cart state in React state, mirrored to
  `localStorage`. No payment gateway (Stripe doesn't support Russian
  businesses; the owner explicitly deferred ЮKassa/CloudPayments-style
  integration for now).
- `/cart` builds a plain-text order summary
  (`components/cart/OrderSummaryBuilder.ts`) and opens
  `https://wa.me/<number>?text=<encoded summary>`. Telegram doesn't support
  reliable message prefill, so that path copies the summary to the
  clipboard instead and opens the plain Telegram link.
- The cart is **not** auto-cleared after "Оформить заказ" — the user gets an
  explicit "Очистить корзину" action instead.
- The order message text itself is **always Russian** regardless of the
  site's displayed language (the owner reads/replies in Russian) — see
  `buildOrderSummary()` in `components/cart/OrderSummaryBuilder.ts`. If the
  visitor's site language isn't Russian, an extra line is appended noting
  which language they were browsing in (e.g. "Язык сайта клиента:
  английский"), so the owner knows to reply in that language instead.
- **Order statuses**: checkout also snapshots the cart into an `orders` row
  (id minted in the browser — `lib/cart/order-storage.ts` — so the order
  number can be quoted in the message text; the insert itself is
  fire-and-forget so WhatsApp/Telegram opens instantly). The admin sets the
  status (🆕 new / ⚙️ in_progress / ✅ ready / ❌ cancelled) via a dropdown
  on `/admin/orders`; the customer sees a simplified three-state view
  ("принят" covers both new and in_progress) in the "Ваши заказы" block on
  `/cart`, matched via order ids kept in their browser's localStorage.
- **Checkout fields**: name, phone, and delivery method/address are
  required before either checkout button works (client-side validation in
  `CartPageClient.tsx`, re-validated server-side in `createOrder` — see
  `lib/delivery.ts` for the `DeliveryMethod` union and
  `deliveryMethodNeedsAddress()`, which is false only for in-person pickup).
  These are personal data, unlike the rest of the row, which is why the
  RLS setup below is column-restricted rather than a blanket read policy.
  No payment fields exist anywhere on the site — no online payment gateway
  is configured (see below), so there is nothing legitimate to collect.
- **Order RLS is column-restricted, not just row-restricted**: anon can
  insert (status forced to `'new'`) and can `select` only
  `id, status, created_at` — enforced via a Postgres column-level `GRANT`
  (`supabase/migrations/20260709000000_order_checkout_details.sql`), since
  RLS alone can't hide specific columns and the customer-facing status
  widget must stay reachable without a login. Never write an anon-facing
  query as `select("*")` against `orders` — it will get a permission error;
  name/phone/address are only selectable by the authenticated admin (a
  separate `"admin read orders"` policy), fetched via `getAllOrders()` in
  `/admin/orders`.
- **New-order notifications** (`lib/order-notifications.ts`): after a
  successful insert, `createOrder` sends the owner a Telegram message via
  her bot (`TELEGRAM_BOT_TOKEN`/`TELEGRAM_ADMIN_CHAT_ID`) with the order
  number, items, total, customer name/phone/delivery info, note, and which
  messenger the customer opened (`orders.channel`). Telegram is the only
  admin channel — WhatsApp has no free send API (only the paid WhatsApp
  Business API), which the owner hasn't set up. The send never throws and
  runs only after the insert, so checkout works with Telegram down and a
  duplicate submit (same client-minted id, rejected by the PK) can't
  notify twice.

## Internationalization

- Storefront pages (home, `/catalog`, product page, `/cart`) auto-detect the
  visitor's browser language via the `Accept-Language` header and support
  **Russian (default), English, French, and Spanish**. The admin panel is
  **not** translated — it stays Russian-only (single Russian-speaking owner).
- No routing changes (no `/en`, `/fr` URL prefixes) — this is a cookie-based
  scheme, not next-intl or App Router locale segments. `proxy.ts` runs on
  every route now (matcher widened from `/admin/:path*` to everything except
  static assets) and, if no `locale` cookie exists yet, parses
  `Accept-Language`, matches it against `lib/i18n/locales.ts`'s
  `SUPPORTED_LOCALES`, and sets a 1-year `locale` cookie — using the same
  request-cookie-forwarding trick the existing Supabase auth logic already
  used, so the cookie is visible to Server Components during the very same
  request that set it.
- `lib/i18n/get-dictionary.ts` exports `getLocale()`/`getDictionary()`,
  which read that cookie via `next/headers` `cookies()` — **Server
  Components only**. Every storefront Server Component that renders
  translated text (`Header`, `Footer`, `Hero`, `StatsRow`, `ProcessSection`,
  `CareSection`, `OrderSection`, `Showroom`, `CatalogGrid`, `ProductCard`,
  the catalog/product/cart pages) independently calls
  `await getDictionary()` itself — no prop-drilling a locale through every
  page.
- **Client Components can't call `getDictionary()`** (it uses
  `next/headers`, and a "use client" file can't import an async Server
  Component that does either — this actually broke the build once during
  development: `CartPageClient` briefly imported `Header`/`Footer` directly,
  which doesn't work once those became async). The fix/pattern: Client
  Components that need translated strings (`CartButton`, `AddToCartButton`,
  `CartLineItem`, `PriceTag`, `ImagePlaceholder`, `CartPageClient`) take them
  as **props** from their nearest Server Component ancestor instead. `/cart`
  in particular is split into `app/cart/page.tsx` (Server: fetches the
  dictionary, renders `Header`/`Footer` + `CartPageClient`) and
  `components/cart/CartPageClient.tsx` (Client: everything interactive,
  receives the whole `Dictionary` object as a prop).
- New locale = add the language to `SUPPORTED_LOCALES` in
  `lib/i18n/locales.ts` and add one full `Dictionary`-shaped file under
  `lib/i18n/dictionaries/`; TypeScript enforces every key exists since each
  file is typed as `Dictionary`.
- **Product/category/showroom content the owner types into `/admin` is
  never auto-translated** — titles, descriptions, tags, category names, and
  showroom captions always render exactly as entered. Machine-translating
  handmade-product descriptions with no owner review step was judged too
  risky (garbled or wrong text); only static UI chrome is translated.
- A manual override exists too: `components/layout/LanguageSwitcher.tsx` in
  the header lets a visitor pick RU/EN/FR/ES directly (sets the cookie,
  calls `router.refresh()`), since Accept-Language detection can guess
  wrong.

## Environment variables

| Variable | Purpose | Where to set |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL — required; `/admin` returns a 503 message if this is unset | Vercel + local `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) API key — RLS policies confine what it can actually do | Vercel + `.env.local` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Order-message target number | Vercel + `.env.local` |
| `NEXT_PUBLIC_TELEGRAM_HANDLE` | Order-message target handle | Vercel + `.env.local` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown in the contact section | Vercel + `.env.local` |
| `TELEGRAM_BOT_TOKEN` | Bot (via @BotFather) that notifies the owner about new orders. **Server-only** — no `NEXT_PUBLIC` prefix, must never reach the browser. Unset = notifications silently off, orders unaffected | Vercel + `.env.local` |
| `TELEGRAM_ADMIN_CHAT_ID` | The owner's chat id with that bot (she must /start the bot once; id via the bot API `getUpdates`) | Vercel + `.env.local` |

Copy `.env.example` to `.env.local` for local dev. `.env.local` is
git-ignored; `.env.example` is intentionally committed as the template.

## Deployment

Vercel auto-deploys `main`. Claude should commit and push every completed
modification straight to `main` without pausing to ask for push
confirmation — the owner works solo on this repo and wants changes live
without a manual approval step each time.

## Conventions

- Storefront UI copy is translated (see "Internationalization" above) — new
  user-facing strings go in `lib/i18n/dictionary.ts` +
  `lib/i18n/dictionaries/*.ts`, not hardcoded in components. Admin panel
  copy stays Russian-only, hardcoded as before.
- Prices are formatted "6 900 ₽" / "от 3 500 ₽" via `lib/format.ts` — reuse
  it rather than formatting numbers inline. `formatPriceRub` takes an
  optional `fromLabel` param for the translated "from" word.
- Server components by default; add `"use client"` only where state,
  effects, or browser APIs (cart, localStorage, clipboard, file upload) are
  actually needed.
- `params` in dynamic routes are `Promise`s (Next 16) — `await params`.
- Every product write goes through `lib/supabase/mutations.ts` Server
  Actions (which call `revalidatePath`) — don't call `supabase.from(...)`
  directly from a client component for writes; reads are fine client-side
  (e.g. image upload uses the browser client for Storage only).

## Known non-goals (by design, not oversight)

No online payments, no user accounts beyond the single admin (customers
track their orders via localStorage-kept ids, not a login), no automated
inventory decrement — `available` on a product is a manual toggle in
`/admin`, no analytics/order stats (dashboard is just product/category
counts, as requested).
