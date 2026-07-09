# DiTech Deployment Guide: cPanel & E-commerce Integration

## Part 1: Static Deployment to cPanel (PHP/Subfolder Hosting)

### Overview
DiTech is a **static SPA** (Single Page Application) built with Vite + React. It requires:
- No Node.js runtime on server
- Static file hosting
- `.htaccess` rewrite rules for SPA routing

### Build & Deploy Steps

#### 1. Local Build
```bash
# Install dependencies
npm i

# Build for production
npm run build
```

This generates a `dist/` folder with all static assets (HTML, JS, CSS).

#### 2. Configure for Subfolder Hosting (Optional)
If deploying to a subfolder (e.g., `/ditechai/` instead of domain root):

**Edit `vite.config.ts`:**
```typescript
export default defineConfig(({ mode }) => ({
  base: '/ditechai/', // Add this line
  // ... rest of config
}));
```

Then rebuild:
```bash
npm run build
```

#### 3. Upload to cPanel

**Option A: File Manager**
1. Log into cPanel
2. Open File Manager
3. Navigate to `public_html` (or your subfolder, e.g., `public_html/ditechai/`)
4. Upload all files from `dist/`
5. Preserve folder structure exactly

**Option B: FTP**
- Use FTP client (WinSCP, Filezilla, etc.)
- Connect to your cPanel FTP credentials
- Upload `dist/` contents to `public_html` or subfolder

#### 4. Create `.htaccess` for SPA Routing

Create `.htaccess` in the same directory as `index.html`:

**For domain root:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite actual files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Route all requests to index.html (React Router)
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

**For subfolder (e.g., `/ditechai/`):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ditechai/
  
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

#### 5. Test Deployment

✅ Visit your domain → should load the home page

✅ Navigate to `/services`, `/about`, etc. → should work without 404s

✅ Open browser DevTools → check that JS/CSS bundles load (no 404s)

---

## Part 2: Environment Variables for cPanel

### Setting Environment Variables in cPanel

Since cPanel is static hosting, environment variables must be injected **before build** or via a **build script**.

#### Option 1: Create `.env.production` before upload

**Locally, create `.env.production`:**
```
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-key-here
VITE_API_URL=https://api.ditechai.com
VITE_API_ENV=production
VITE_ENABLE_CHECKOUT=true
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
```

Then build:
```bash
npm run build
```

Upload `dist/` as described above.

#### Option 2: Use cPanel Environment or DNS for API endpoints

Hardcode base API URLs in TypeScript config and let DNS/subdomain routing handle it:

**In `src/config/env.ts`:**
```typescript
const baseUrl = import.meta.env.VITE_API_URL || 'https://api.ditechai.com';
```

Update DNS records to point subdomains to your API backend.

---

## Part 3: E-commerce & Checkout Integration

### Current State
The shop displays **curated hardware** with:
- Product catalog (12 items across 6 categories)
- Search & filtering
- **"Enquire" button** → links to Contact page

**No checkout flow exists yet.**

### To Enable Full E-commerce Checkout

#### Step 1: Set Up Supabase Backend

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Run the schema** from `src/integrations/supabase/schema.sql`:
   - Go to Supabase SQL Editor
   - Paste entire schema
   - Click "Run"
3. **Enable RLS** on all tables (already in schema)
4. **Configure Auth**:
   - In Supabase Dashboard → Authentication → Providers
   - Enable Email/Password or OAuth (Google, GitHub, etc.)

#### Step 2: Set Environment Variables

**Update `.env.production` (and local `.env`):**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
VITE_ENABLE_CHECKOUT=true
```

#### Step 3: Implement Checkout UI Component

Create `src/components/checkout/CheckoutFlow.tsx`:

```typescript
import { useState } from 'react';
import { CheckoutStep, CheckoutState } from '@/types/checkout';
import { useCart } from '@/hooks/useCart';

const CheckoutFlow = () => {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const { cart } = useCart();

  switch (step) {
    case 'cart':
      return <CartReview onNext={() => setStep('shipping')} />;
    case 'shipping':
      return <ShippingForm onNext={() => setStep('payment')} />;
    case 'payment':
      return <PaymentForm onNext={() => setStep('confirmation')} />;
    case 'confirmation':
      return <OrderConfirmation />;
  }
};

export default CheckoutFlow;
```

#### Step 4: Add Stripe Integration

1. **Get Stripe API Key** from [stripe.com](https://stripe.com)
2. **Install Stripe React:**
   ```bash
   npm install @stripe/react-stripe-js @stripe/js
   ```
3. **Create payment form** using `@stripe/react-stripe-js`

#### Step 5: Update Shop Routes

**In `src/App.tsx`, add checkout route:**
```typescript
const Checkout = lazy(() => import("./pages/Checkout"));

// In Routes:
<Route path="/checkout" element={<Checkout />} />
```

**Update Shop product cards to use checkout:**
```typescript
// Before:
<Link to="/contact">Enquire</Link>

// After:
<Link to="/checkout">Add to Cart</Link>
```

#### Step 6: Database Schema for Orders

Schema already includes:
- `customers` table → users
- `products` table → inventory
- `orders` table → order records
- `order_items` table → order line items
- `payment_intents` table → Stripe payment tracking
- `shipping_addresses` table → delivery addresses
- RLS policies → secure access

#### Step 7: Deploy Backend API (Optional)

For production, you may want a **Node.js/Express backend** to:
- Create Stripe payment intents securely
- Send order confirmation emails
- Manage inventory
- Handle webhooks

Example backend structure:
```
backend/
  src/
    routes/
      orders.ts    # Create orders, list orders
      payments.ts  # Stripe webhook handling
      products.ts  # Product inventory
    middleware/
      auth.ts      # JWT validation
      errorHandler.ts
    config/
      supabase.ts  # Supabase client
      stripe.ts    # Stripe client
```

**Deploy to:**
- Render.com (free tier)
- Railway.app
- AWS Lambda + API Gateway
- Heroku

---

## Checklist: Go Live with E-commerce

- [ ] Create Supabase project and run schema
- [ ] Set up Stripe account and get API keys
- [ ] Update `.env.production` with secrets
- [ ] Build locally: `npm run build`
- [ ] Test checkout flow locally: `npm run dev`
- [ ] Upload `dist/` to cPanel
- [ ] Add `.htaccess` for SPA routing
- [ ] Test routes on live domain
- [ ] Test checkout (cart → shipping → payment → confirmation)
- [ ] Enable SSL/HTTPS (required for Stripe)
- [ ] Set up Stripe webhooks for order notifications
- [ ] Configure email service for order confirmations
- [ ] Monitor Supabase logs for errors
- [ ] Set up analytics (Sentry, LogRocket)

---

## Troubleshooting

### Issue: 404 on routes like `/services`
**Solution:** Ensure `.htaccess` is in the correct directory and `mod_rewrite` is enabled on cPanel.

### Issue: Supabase connection fails
**Solution:** Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are correct. Verify RLS policies allow anonymous access for reading products.

### Issue: Stripe keys not working
**Solution:** Ensure you're using **published keys** (not secret keys) in frontend. Secret keys go in backend only.

### Issue: Cart data lost on page refresh
**Solution:** Verify localStorage is enabled in browser. Check DevTools Application tab.

---

## Security Best Practices (2025)

✅ **Environment Variables:**
- Use `.env` files, never hardcode secrets
- Use Supabase Vault or AWS Secrets Manager for production secrets
- Rotate keys every 90 days

✅ **Database (Supabase):**
- Enable RLS on all tables
- Write tight access policies (see schema.sql)
- Never expose raw SQL to frontend

✅ **Payments (Stripe):**
- Never handle card data on frontend
- Always use Stripe Elements or Payment Elements
- Validate amounts server-side
- Use webhooks for order confirmation (not API responses)

✅ **Frontend:**
- Sanitize user inputs
- Use HTTPS only
- Implement rate limiting on API calls
- Use Content Security Policy (CSP) headers

✅ **Monitoring:**
- Set up Sentry for error tracking
- Monitor Supabase logs
- Alert on failed payments
- Track checkout abandonment rate

---

## References

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Best Practices](https://supabase.com/docs/guides/database/best-practices)
- [Stripe Payment Intents](https://stripe.com/docs/payments/accept-a-payment)
- [Apache .htaccess Rewrite Rules](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)
- [React Router v6](https://reactrouter.com/en/main)
- [PCI DSS Compliance](https://www.pcisecuritystandards.org/)
