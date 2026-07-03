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
  an API from training data still works the same way.
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config.ts` — see
  `app/globals.css`).
- **Sanity** — embedded Studio at `/studio` (via `next-sanity`) is the
  product catalog's admin UI. No custom admin panel/auth was built; the
  owner edits products directly in Studio.
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
  studio/[[...tool]]/        embedded Sanity Studio (page.tsx is a Server Component
                              for metadata only; StudioClient.tsx does the actual
                              rendering — see the comment in StudioClient.tsx for why)
  api/revalidate/route.ts    Sanity webhook -> revalidates catalog pages on publish

components/
  layout/     Header, Footer, Wrap (max-width page container)
  home/       static homepage sections (Hero, Sparkles, StatsRow, ProcessSection,
              CareSection, OrderSection) — content here is hardcoded React, not in Sanity
  catalog/    CatalogGrid, ProductCard, PriceTag
  cart/       CartButton, CartLineItem, AddToCartButton, OrderSummaryBuilder
  ImagePlaceholder.tsx   stand-in shown wherever a product/section photo is missing

lib/
  types.ts                shared Product type
  format.ts                formatPriceRub()
  placeholder-products.ts  the original 6 launch products; used as a fallback
                            catalog until NEXT_PUBLIC_SANITY_PROJECT_ID is set
  order-links.ts           WhatsApp/Telegram link builders + contact info (env-driven)
  cart/       cart-context.tsx (CartProvider/useCart), cart-storage.ts (localStorage)
  sanity/     client.ts, image.ts (urlFor), queries.ts (GROQ + Product mapping), types.ts

sanity/
  schemaTypes/product.ts   the product content model (see below)
  structure.ts             pins "Товары" at the top of the Studio's desk structure

sanity.config.ts, sanity.cli.ts   Studio config (same one is used for local `sanity` CLI
                                   commands and the embedded /studio route)
```

## Dev commands

```
npm install
npm run dev         # next dev — also serves /studio, no separate command needed
npm run build
npm run lint
npm run typecheck   # tsc --noEmit
```

## Where content lives

- **Products, prices, photos, availability** → Sanity Studio
  (`localhost:3000/studio` locally, `<site>/studio` in production). Not in
  code. See `sanity/schemaTypes/product.ts` for the exact fields.
- **Everything else** (hero copy, process steps, care instructions, contact
  links) → plain React content in `components/home/*.tsx`, edited via code.
  This was a deliberate scope decision: only the product catalog was asked
  to be self-service; expanding that to the rest of the homepage copy would
  mean adding a `siteSettings` Sanity schema (straightforward if the owner
  asks for it later).
- **Contact details** (WhatsApp number, Telegram handle, email) are read
  from env vars via `lib/order-links.ts`, not hardcoded per-component.

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
  rather than introducing one.

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
- The cart is **not** auto-cleared after "Оформить заказ" (there's no way to
  know the customer actually sent the message) — the user gets an explicit
  "Очистить корзину" action instead.
- Optional next step, not built: an `app/api/order` route that also pings a
  Telegram bot for a durable, searchable order log independent of the
  customer's own WhatsApp/Telegram thread. Needs a bot token + chat ID; ask
  the owner before adding it, since it's a manual setup step on her end.

## Environment variables

| Variable | Purpose | Where to set |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project — catalog is empty/falls back to `lib/placeholder-products.ts` until this is set | Vercel + local `.env.local` |
| `NEXT_PUBLIC_SANITY_DATASET` | Defaults to `production` | Vercel + `.env.local` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version pin | Vercel + `.env.local` |
| `SANITY_REVALIDATE_SECRET` | Signs the Sanity -> `/api/revalidate` webhook | Vercel + Sanity webhook config |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Order-message target number | Vercel + `.env.local` |
| `NEXT_PUBLIC_TELEGRAM_HANDLE` | Order-message target handle | Vercel + `.env.local` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown in the contact section | Vercel + `.env.local` |

Copy `.env.example` to `.env.local` for local dev. `.env.local` is
git-ignored; `.env.example` is intentionally committed as the template.

### One-time setup only the project owner can do (not Claude)

1. Create a free Sanity project (`npx sanity init`, or via sanity.io) →
   get the project ID, put it in the env vars above.
2. In the Sanity project's CORS settings, allow `http://localhost:3000` and
   the production Vercel URL — the embedded Studio needs this.
3. Connect the GitHub repo to a new Vercel project and set the env vars
   there.
4. Add real product photography in Sanity Studio — the repo ships with no
   photos; `ImagePlaceholder` renders "Фото скоро будет" until then.

## Deployment

Vercel auto-deploys `main`. No staging Sanity dataset — a single
`production` dataset is fine at this scale (one editor, low change volume).

## Conventions

- UI copy is Russian-only.
- Prices are formatted "6 900 ₽" / "от 3 500 ₽" via `lib/format.ts` — reuse
  it rather than formatting numbers inline.
- Server components by default; add `"use client"` only where state,
  effects, or browser APIs (cart, localStorage, clipboard) are actually
  needed.
- `params` in dynamic routes are `Promise`s (Next 16) — `await params`.

## Known non-goals (by design, not oversight)

No online payments, no user accounts, no order history page, no automated
inventory decrement — `available` on a product is a manual toggle in
Studio.
