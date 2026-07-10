Refined implementation contract per the Engineering Refinement Request. Six independent, sequentially executed deliverables — each with contract, success criteria, failure behaviour, rollback, and verification. No scope expansion, no schema/framework changes.

---

## Deliverable 1 — Performance optimization

**Scope**
- Add `width`/`height` to hero + product `<img>` tags (fix CLS).
- Restrict `fetchpriority="high"` to the first hero slide only.
- `React.lazy` + `Suspense` for below-the-fold Home sections (Projects, Testimonials, Blog teaser, InteractiveDemo, ShopTeaser, TechStack). Hero + first fold stay eager.
- Add `<link rel="preconnect" href="https://images.unsplash.com" crossorigin>` in `index.html`.
- Ensure LCP hero image has `loading="eager"`, `decoding="async"`, explicit dimensions.

**Contract**
- No functional/UI behaviour change; only rendering timing and asset attributes.
- Bundle budget: initial JS chunk must not grow > 5 KB gzipped versus baseline.

**Success criteria**
- Initial JS ≤ baseline + 5 KB gzipped (measured via `bun run build` chunk report).
- Lighthouse Performance ≥ current baseline; LCP not regressed.
- CLS < 0.1 on Home.
- Build succeeds.

**Failure behaviour**
- Missing responsive image → fall back to original `src` (no `srcSet` required).
- Unsupported `fetchpriority` in older browsers → attribute ignored, no error.
- Lazy chunk load error → `Suspense` fallback (spinner) remains; user can retry via reload.

**Files modified**
- `src/pages/Home.tsx`, `src/components/sections/HeroSlider.tsx`, `src/pages/Services.tsx` (product img dims only), `index.html`.

**Rollback** — revert those files; no other deliverable depends on them.
**Regression risk** — low (visual attributes and lazy boundaries).

**Verification**
- `bun run build` — inspect chunk sizes.
- Playwright: load `/`, capture screenshot, confirm no layout shift after hero image loads.
- DevTools network panel: hero image is highest priority; below-fold chunks load only when scrolled.

---

## Deliverable 2 — Responsive QA (HeroSlider + Navigation)

**Scope**
- Sweep HeroSlider + Header at 375, 414, 768, 1024, 1440 px.
- Fix any overflow, clipped text, or stacking bugs found (headline `clamp()`, indicator `z-20`, mobile overlay z-order).
- Lock body scroll while mobile menu open.
- Verify focus rings on nav links + CTA in light + dark themes.

**Contract**
- No copy or structural changes; only responsive/accessibility fixes.
- Reduced-motion users continue to see static hero (already implemented via `useReducedMotion`).

**Success criteria**
- Zero horizontal overflow at all 5 breakpoints (measured: `document.documentElement.scrollWidth === clientWidth`).
- Header, hero content, and indicators never overlap.
- All interactive elements reachable via Tab; visible focus ring in both themes.
- Mobile menu traps scroll while open.

**Failure behaviour**
- `body-scroll-lock` unavailable → fall back to `document.body.style.overflow = 'hidden'`.
- Reduced-motion preference → slider auto-advance disabled (existing behaviour retained).

**Files modified**
- `src/components/sections/HeroSlider.tsx`, `src/components/layout/Header.tsx`, `src/index.css` (only if a focus ring token needs adjustment).

**Rollback** — revert those files; independent of Deliverable 1.
**Regression risk** — low.

**Verification**
- Playwright screenshots at 375/414/768/1024/1440 → visual review.
- Keyboard-only pass: Tab through nav + hero CTAs; focus visible in light and dark.
- Chrome, Edge, Firefox, Safari smoke (Playwright Chromium; manual Safari note in reply).

---

## Deliverable 3 — Shop URL state

**Scope**
- Sync `category`, `q`, `sort` filter state with `useSearchParams` on `/services` (`#shop` section).
- Add sort dropdown (Featured, Price ↑, Price ↓, Rating).
- "Copy share link" button copies `window.location.href` to clipboard.

**Contract — accepted parameters**
| Param | Values | Default | Invalid handling |
|---|---|---|---|
| `category` | one of `productCategories` (case-insensitive match) | `All` | ignore, fall back to `All` |
| `q` | string, ≤100 chars, trimmed | `""` | truncate, strip control chars |
| `sort` | `featured` \| `price-asc` \| `price-desc` \| `rating` | `featured` | ignore, fall back to `featured` |

- **Serialization**: only non-default params appear in URL. Default state → `/services#shop` (no query string).
- **Backward compatibility**: existing `/services#shop` links keep working (no params ⇒ all defaults).
- **Router**: `setSearchParams(..., { replace: true })` during typing (avoid history spam); `push` on category/sort clicks.

**Share link contract**
- **Input** — current `window.location.href` (post-sync).
- **Output** — clipboard write via `navigator.clipboard.writeText`.
- **Clipboard failure** — fall back to `document.execCommand("copy")` on a hidden textarea; if that also fails, open a Sonner toast containing the URL in a selectable input.
- **Toast behaviour** — success: "Link copied — filters preserved" (2s). Failure: "Copy failed — link shown, please copy manually" with URL visible.
- **Image in preview** — static SPA limitation stated plainly in reply: crawlers see the site-wide `og:image` set in `index.html`; per-filter previews would require SSR and are out of scope.

**Success criteria**
- Reload of a filtered URL restores UI state exactly.
- Browser back/forward moves through filter states.
- Malformed URLs render `All` products with no console errors.

**Failure behaviour**
- Invalid category → coerced to `All`, no toast.
- Unknown sort → coerced to `featured`.
- Corrupted query string → `URLSearchParams` handles gracefully; unknown keys ignored.
- Clipboard unavailable → fallback path above.

**Files modified**
- `src/pages/Services.tsx` only.

**Rollback** — revert `Services.tsx`; independent of D1/D2.
**Regression risk** — low; contained to Services page.

**Verification**
- Manual: `/services?category=Laptops&sort=price-asc#shop` → reload → filters restored.
- Manual: apply filters → back button → prior state restored.
- Manual: paste `/services?category=Bogus&sort=xyz#shop` → renders `All`, no console error.
- Manual: click share button in browsers where `navigator.clipboard` is blocked (http localhost with permission denied) → fallback toast fires.

---

## Deliverable 4 — SEO improvements

**Scope**
- Install `react-helmet-async`; wrap app in `<HelmetProvider>` in `src/main.tsx`.
- Add `ItemList` (Services) JSON-LD via Helmet on `/services`.
- Add `BreadcrumbList` JSON-LD on `/services`, `/solutions`, `/blog`, `/about`.
- Confirm site-wide Organization JSON-LD in `index.html` (already present).
- Add default `og:image` in `index.html` pointing to a stable branded image URL (if none currently exists — do not fabricate a URL; if no image is available, document the omission).

**Contract**
- Head tags only; no route/component behaviour changes.
- Nav reorder (Task from previous plan) — **swap Blog ↔ Services position**, **remove Contact from `primaryNav`**. Ordered: Home, Blog, Solutions, Services, About. `/contact` remains reachable via "Start a project" CTA and footer.

**Success criteria**
- `curl https://ditechai.lovable.app/services` returns valid JSON-LD (Google Rich Results test passes for ItemList + BreadcrumbList).
- Nav renders new order on desktop + mobile; Contact link is not present.
- No console errors from Helmet.

**Failure behaviour**
- Helmet fails to mount → static `index.html` head remains (graceful degradation).
- Non-JS crawlers (LinkedIn, Slack) still see static `og:*` — documented limitation.

**Files modified**
- `package.json` (dep add), `src/main.tsx`, `src/pages/Services.tsx`, `src/pages/Solutions.tsx`, `src/pages/Blog.tsx`, `src/pages/About.tsx`, `src/config/nav.ts`, `index.html`.

**Rollback** — remove `<Helmet>` blocks and revert `nav.ts` + `main.tsx`; `react-helmet-async` can stay installed harmlessly.
**Regression risk** — low.

**Verification**
- Google Rich Results test on preview URL (documented in reply if not runnable from sandbox).
- Playwright DOM assertion: `<script type="application/ld+json">` present on each page.
- Manual nav walkthrough desktop + mobile.

---

## Deliverable 5 — AI chat product awareness

**Scope**
- `ChatWidget.tsx` sends `{ messages, context: { products: [...] } }`.
- `ai-chat` Edge Function accepts optional `context.products` (Zod-validated), injects catalog into system prompt.
- Prompt updated to instruct the model to describe items, ask clarifying questions (budget/OS/portability), and recommend 1–3 SKUs from the supplied list only.

**Product context contract**
| Field | Rule |
|---|---|
| **Max payload** | 50 products, each ≤500 bytes when serialized; hard cap 25 KB total. |
| **Required fields per item** | `id`, `name`, `category`, `price`, `inStock`. |
| **Optional fields** | `rating`, `reviews`, `badge`, `originalPrice`. Omitted when absent (no nulls in prompt). |
| **Ordering strategy** | Client sends products in `products.ts` order (featured first). Server preserves order. |
| **Duplicate handling** | Server dedupes by `id`; first occurrence wins. |
| **Missing values** | Optional fields silently omitted from the prompt-formatted line. |
| **Future catalog growth** | If > 50 items sent, server truncates to first 50 and appends `"... (truncated)"` to prompt so the model knows the list is partial. |

**Success criteria**
- Sending "Recommend a laptop under $2000" produces a reply that references only SKUs present in `products.ts` (verified by string match).
- Sending an empty catalog `context.products: []` returns a graceful reply ("I don't have live inventory right now — ask me about services instead") — no crash.
- Payload > 25 KB → 400 with `{ error: "Product context too large" }`.

**Failure behaviour**
- Empty catalog → model told "no products currently available"; falls back to service Q&A.
- Oversized payload → 400 as above; client toasts "Product info too large — please retry".
- Missing optional field → omitted from prompt line, no error.
- `context` field entirely absent → backward compatible; behaves as pre-D5 chat.

**Files modified**
- `supabase/functions/ai-chat/index.ts`, `src/components/ChatWidget.tsx`.

**Rollback** — revert both files; no schema change to undo.
**Regression risk** — medium (edge function change). Requires redeploy of `ai-chat`.

**Verification**
- Manual chat: "Show me monitors under $800" → reply names LG UltraWide and/or Dell 4K from catalog.
- Manual: temporarily pass empty array → graceful reply.
- `supabase--test_edge_functions` with oversized fixture → 400.

---

## Deliverable 6 — Regression verification (full pass)

Run after D1–D5 are individually verified.

**Performance**
- Lighthouse Home + Services: LCP, CLS, TBT compared against baseline captured at start of D1.
- `bun run build` chunk report vs baseline.

**Accessibility**
- Keyboard-only walk of Home, Services, Header (mobile + desktop).
- Focus indicators visible in light + dark.
- `prefers-reduced-motion` respected on hero slider.
- Color contrast spot-check on nav + shop cards (target WCAG AA).

**Browser compatibility**
- Chrome + Edge (Playwright Chromium): full smoke.
- Firefox + Safari: manual smoke; document any deltas.

**Functional**
- Malformed shop URL → renders `All`.
- Browser back/forward across filter changes.
- Clipboard failure → fallback toast.
- AI recommendations grounded in catalog.
- Nav reorder consistent; no dead `/contact` link in menu.

**Deliverable independence check**
- Confirm each of D1–D5 could be reverted without touching the others (file-modified lists above are disjoint except for `src/pages/Services.tsx` in D1 (dims only), D3 (URL state), D4 (JSON-LD) — sequential edits, each additive).

---

## Execution rules

1. Execute D1 → D6 in order.
2. Each deliverable completes its own verification before the next starts.
3. No new scope introduced mid-flight unless a blocking bug is found; document any such deviation in the closing reply.
4. Reply after each deliverable summarises: files touched, success criteria met, failure paths tested.