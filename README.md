# СИЯНИЕ

Site for a handmade rhinestone apparel & textile shop — Next.js storefront
with a Supabase-backed product catalog and a built-in admin panel. See
[`CLAUDE.md`](./CLAUDE.md) for the full architecture, folder map,
environment variables, database schema, and one-time setup steps.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in real values, see CLAUDE.md
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront and
[http://localhost:3000/admin](http://localhost:3000/admin) for the product
catalog admin panel (requires Supabase to be configured first — see
`CLAUDE.md`).

## Deployment

Auto-deployed from `main` on Vercel.
