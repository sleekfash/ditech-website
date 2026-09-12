# Admin account, Orcka walkthrough, and a database-backed shop

## Part 1 — Your admin account

There are currently no user accounts on the site at all, and email sign-in has never been switched on. So this is a first-time setup, not a repair.

1. Turn on email sign-in for the site.
2. Create the account `admin@ditech.website` with a strong generated password, confirmed immediately so you can sign in right away.
3. Mark that account as an administrator so it can reach `/admin`.
4. Show you the password once, here in chat. Change it after your first sign-in.
5. Add a "Change password" panel inside the admin dashboard so you can do that without help.

I will then sign in as this account myself and confirm the admin dashboard loads.

## Part 2 — Walking the Orcka admin tab

With the account working, I go through the "Orcka AI" tab end to end and report what I see:

- **Persona** — set the greeting, tone, guardrails and starter prompts, save as a draft, run the built-in preview against the draft, then publish it as a new live version. Confirm the old version is archived and rollback still works.
- **Knowledge** — the knowledge list is currently empty. I'll add a few starter entries (what DiTech does, pricing approach, how to reach you, shop/delivery basics) and confirm enabled entries actually reach the bot.
- **Transcripts** — there are 4 stored conversations. I'll open one, flag it, add a note, and confirm the flag count updates.
- **Live test** — from `/ask`, run two real conversations: one asking Orcka to recommend a laptop from your shop, one about your automation and legal-tech services. I'll confirm the published tone and instructions are being used and paste the replies back to you.

## Part 3 — Shop products move into the database

Right now the shop's 12 products live in a fixed file inside the site, so nothing can be edited without a code change, and there is no catalog database to connect to or cache.

**What changes for you**

- A new "Products" tab in your admin dashboard: add, edit, delete and reorder products, set price, sale price, category, rating, stock, badge and image, and mark items as featured for the homepage.
- The shop page, the homepage teaser, and Orcka all read from that one live list, so an edit shows up everywhere.
- Visitors only ever see products you have published and, as now, cannot change anything.

**Speed work, done properly**

- **Smaller images.** Product photos are currently downloaded at 800x600 even on a phone showing them at roughly a third of that. I'll request correctly sized versions per screen, so a phone loads a fraction of the data. This is the single biggest win.
- **Cached catalog.** The product list is fetched once and reused across pages and back-navigation instead of refetching. Search and filtering then happen instantly in the browser, with typing debounced so the address bar doesn't update on every keystroke.
- **Early connection.** The site will open its connection to your backend before the shop needs it, so the first product load doesn't wait.
- Loading placeholders so the page never jumps while products arrive.

I'll measure the shop page before and after and give you the actual numbers.

## Technical notes

- `enable_email_auth`, then sign up via the public auth endpoint, then `UPDATE public.profiles SET is_admin = true` (the `lock_is_admin` trigger blocks client-side escalation, so this is a server-side data update).
- New `public.products` table (name, slug, category, price, original_price, rating, reviews, image_url, badge, in_stock, featured, published, sort_order) with GRANTs: `SELECT` to `anon`/`authenticated` for published rows only; full write restricted to `is_admin(auth.uid())`; `ALL` to `service_role`. Seeded from the current 12 entries in `src/config/products.ts` so nothing visibly changes on launch.
- `src/config/products.ts` keeps its types and becomes the seed/fallback only; `Services.tsx#shop` and `ShopTeaser.tsx` switch to a `useProducts` hook built on the React Query client already installed.
- Images: a `productImage(url, width)` helper appends width/quality/format params and emits `srcSet` + `sizes` for the card grid. `images.unsplash.com` is already preconnected; add a preconnect for the backend origin.
- `ai-chat` currently trusts a product catalog posted from the browser. It will read the published catalog from the database itself instead, which is both faster and no longer client-controlled.
- Existing URL filter contract (`category` / `q` / `sort`) and the share-link behaviour stay exactly as they are.
