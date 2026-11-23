# DiTech deployment

## Current architecture

The frontend is a React/TypeScript SPA built by Vite. Supabase supplies authentication,
data, and Edge Functions. The repository includes cart, checkout and order submission;
checkout records a pending order and is not an integrated card-payment checkout.
Ask Orcka and the separate Workflow Advisor require sign-in in the current code.

## Vercel preview workflow

1. Import `sleekfash/ditech-website` into the intended Vercel team. Use the Vite
   preset, repository root, Node 22, `npm ci --ignore-scripts`, `npm run build`, and
   output directory `dist`. The same build settings and SPA rewrites are in `vercel.json`.
2. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and optionally
   `VITE_SUPABASE_PROJECT_ID` in Preview and Production. These are browser-visible
   configuration. Never use a service-role/secret API key or an AI/email provider
   secret in a VITE variable. Prefer a separate Supabase project for staging;
   previews using the existing project read and write the existing data.
3. Push a feature branch and open a pull request. Vercel's Git integration creates
   a preview. The `Frontend validation` workflow checks the build and static
   frontend security. The separate `Security Scan` workflow evaluates the deployed
   backend when configured. A successful frontend build is not a backend verdict.
4. Add the exact HTTPS preview origin(s) to the backend secret
   `ADDITIONAL_ALLOWED_ORIGINS`, comma-separated. Redeploy affected functions,
   including `workflow-advisor`, `ai-chat`, `contact-form`, `place-order`, and
   `admin-users`, with their existing authorization settings. Never allow all
   `*.vercel.app` domains. This source change alone does not update deployed functions.
5. Add exact preview and production callback URLs to Supabase Auth's redirect
   configuration. Check sign-in and sign-out without changing the existing Site URL
   until the production cutover is intended.
6. Configure GitHub variable `SECURITY_SCAN_URL` and secret `SECURITY_SCAN_TOKEN`
   to match the backend scan endpoint. See `SECURITY_CI.md`. The existing production
   scan remains fail-closed when credentials are missing; do not bypass it to release.
7. Require frontend and backend checks before merging into the production branch.
   Verify home, direct deep links, assets, day/night persistence, authentication,
   and authorized admin access. Exercise order creation only with test data.
8. Release through a reviewed production build after backend checks pass. Verify
   production before switching DNS. Vercel can restore the previous production
   deployment; database changes require their own recovery plan.

The Vercel preview uses the existing Lovable/Supabase backend unless explicitly
reconfigured. Hosting the frontend on Vercel does not migrate backend functions,
secrets, authentication settings, or the Lovable AI Gateway dependency.

## Day/night mode

The header and admin controls share a Day/Night button. Day is the initial default;
the selected mode is saved on the device and restored before paint. An existing
`system` preference follows device appearance until the visitor explicitly toggles.
Blocked preference storage does not prevent the control from working for the visit.

## Shared hosting alternative

Build with the public Supabase variables supplied at build time. Upload only `dist/`
to the domain root. No Node runtime is required to serve the frontend. Keep the backend
on Supabase and configure its origins and Auth redirect URLs for the final domain.
For Apache/cPanel, add this `.htaccess` alongside `index.html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

Subfolder hosting also requires matching Vite `base` and React Router `basename`;
changing only the Vite base does not fix navigation. Prefer a dedicated subdomain.

## Remaining backend work

A frontend deployment does not resolve order transactionality or verify database
RLS. Review those independently before commercial checkout: create order and line
items atomically, add idempotency, and validate deployed access policies.
