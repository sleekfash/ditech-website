# Admin panels, account management, and shop checkout

## 1. New security scan token

The old token can't be read back, so we replace it with a fresh one you choose:

- I open a secure form where you paste a new strong random value (I'll give you a one-line command to generate one).
- You then add the same value to your GitHub repository as the secret `SECURITY_SCAN_TOKEN`, plus a variable `SECURITY_SCAN_URL` pointing at the scan endpoint.
- I verify the scan endpoint accepts the new token and rejects anything else.

## 2. Products panel (finish it)

The Products panel is fully built but never appears, because the dashboard doesn't render it when you click the tab. Same for Account. Fix that, then confirm in the live dashboard that:

- All products list with photo, price, category and status.
- Editing price, description, sale price, badge, stock, featured and published works and shows immediately on the shop and homepage.
- Add, delete and reorder work.

## 3. Account panel

Keeps your password change form, and adds a **Users** section:

- Every registered account with email, name, admin status and join date.
- A switch to grant or revoke administrator access, with a confirmation step. You cannot remove your own admin rights (avoids locking yourself out).
- Admin changes are made server-side so they can't be faked from a browser.

## 4. Prices in naira

Shop, homepage strip, admin and checkout all switch to naira (₦). I need one thing from you: either your naira price list, or a rate to convert the current dollar prices (e.g. ₦1,550 to $1). Until you confirm, I'll convert at a rate you approve and you can fine-tune each price in the Products panel.

## 5. Checkout flow

New pages: **Cart** → **Details** → **Payment** → **Confirmation**.

- Add to cart from the shop grid, product cards and the homepage strip; a cart badge in the header with quantity controls.
- Details step collects name, email and phone only — delivery is arranged with the customer afterwards.
- Card payment via Stripe, handled by Lovable's built-in payments so you don't need your own Stripe account. Note: built-in payments needs a Pro workspace plan; if you'd rather not upgrade, I can either connect your own Stripe keys or ship the same flow as an "order request" (you get the order by email and arrange payment) and switch on cards later.
- Orders are stored in your backend and appear in a new **Orders** tab in the dashboard with status (pending, paid, processing, shipped, delivered, cancelled).
- Stock and price are re-checked on the server at payment time, so a tampered browser can't change what's charged.

## Technical notes

- `src/pages/Admin.tsx`: render `<ProductsAdmin />` and `<AccountPanel />` on their tabs; add an `orders` tab.
- Users list needs an `admin-users` edge function using the service role (profiles RLS is owner-only by design, and `lock_is_admin` blocks client-side flag changes). Function verifies the caller's JWT and `is_admin(auth.uid())` before listing or toggling; a self-demotion guard and the last-admin guard live there.
- Currency: add `currency`/`locale` to `src/config/site.ts` and a `formatPrice()` helper; replace `toLocaleString()` dollar formatting in `Services.tsx`, `ShopTeaser.tsx`, `ProductsAdmin.tsx`. Prices stay in the existing `price` column, restated in NGN via a one-off data update.
- New tables `orders` and `order_items` with GRANTs; inserts only through an edge function (service role), reads restricted to `is_admin(auth.uid())`; guest checkout keyed by an order reference so no customer login is required.
- `useCart` already exists but keys items by numeric `product_id`; retype to the string product UUIDs used by the database.
- Checkout session created by a `create-checkout` edge function that recomputes the total from published database rows; a webhook function marks orders paid.
- If NGN isn't supported by the payment account, we charge in USD at your stated rate and show both amounts at checkout — I'll confirm before switching anything on.
