# Roadmap

## In progress — Visitor accounts for Workflow Advisor
- [ ] Add email/password signup and sign-in with email confirmation, plus Google sign-in.
- [ ] Require confirmed accounts and enforce a three-recommendation UTC-day quota per account alongside the existing IP limit.
- [ ] Verify visitor registration, sign-in, and advisor access end to end.

## Waiting on available AI credits
- [ ] Verify a live Workflow Advisor recommendation through AI Gateway; the workspace ran out of credits before the real request could be tested.

## Done
- [x] New SECURITY_SCAN_TOKEN generated and saved (value not viewable).
- [x] Admin Products, Orders and Account tabs render real data.
- [x] Checkout flow verified end to end (test order removed).
- [x] Ask Orcka requires sign-in; system-role messages rejected.
- [x] Homepage product strip has add-to-cart.
- [x] New accounts get a profile record automatically.
- [x] Added the uploaded Developer / AI Consultant portrait to Services and the proposed Solvia concept to About without changing DiTech branding.
- [x] Added the public Workflow Advisor on the homepage with validated workflow inputs, private handling, and an atomic five-requests-per-minute IP limit.
- [x] Workflow Advisor validation and rate-limit tests pass; the site build passes.

## Waiting on user
- [ ] GitHub CI: set repo secret SECURITY_SCAN_TOKEN (choose a new value and update the backend secret to match) and variable SECURITY_SCAN_URL.
