# DiTech — Coastal Luxury Rebuild

## 1. Design System — Hamptons Linen & Tide

Rewrite `src/index.css` tokens (light-first, dark variant preserved):

- `--background` linen `#faf8f3` · `--foreground` deep navy `#0f2233`
- `--primary` tidal blue `#2c5f7a` · `--accent` brass `#a89b7c`
- `--surface` driftwood `#d9cfc0` · `--muted` warm sand `#ece5d6`
- Gradients recast to navy → tide → brass; glow softened to brass warmth
- Radius `1rem`, generous whitespace, hairline `1px` borders in warm taupe

Typography (via @fontsource, not CDN):
- Display: **Fraunces** (editorial serif, 300–700, slight optical)
- Body: **Inter Tight** (clean sans, 400/500/600)
- Retire Space Grotesk. Wide tracking on kickers, `text-wrap: balance` on headings.

Vibe cues: sail-line dividers, brass hairline underlines under section eyebrows, subtle grain overlay, no purple/teal-gradient AI clichés.

## 2. Decoupled Business Data — `src/config/*`

Typed TS modules (recommended for build-time safety + IDE autocomplete):

```
src/config/
  site.ts          // brand, contact, socials, legal copy
  hero.ts          // slider slides (headline, sub, cta, image)
  services.ts      // service catalog
  products.ts      // shop catalog (moved from Shop page data)
  solutions.ts     // case studies
  nav.ts           // routes + labels
```

All sections import from these — swap a deployment by editing config only.

## 3. Homepage Hero — 2-slide fade slider

New `src/components/sections/HeroSlider.tsx` replacing `Hero.tsx`:
- 2 slides, 7s dwell, Framer Motion crossfade + slow Ken Burns scale
- Bottom-left dot indicators + pause on hover / reduced-motion respect
- Content pulled from `config/hero.ts`
- Slides recommended:
  1. **"Engineered intelligence for firms that don't do generic."** — sub: bespoke AI, automation & legal tech. CTA: Start a project.
  2. **"From boardroom to backend — one team."** — sub: full-stack builds, kiosks, integrations, retail systems. CTA: Explore services.
- Coastal imagery: soft navy ocean gradient photograph + architectural interior; generated via imagegen (premium), stored in `src/assets/`.

## 4. Merge Shop → Services, homepage teaser

- Add `#shop` anchor section inside `src/pages/Services.tsx` rendering product cards from `config/products.ts`.
- Redirect `/shop` → `/services#shop` in `src/App.tsx`.
- Remove Shop from `nav.ts`.
- Homepage: new `ShopTeaser` component — auto-scrolling marquee carousel of featured products (price + name + brass hairline), CTA "Browse the shop →" linking to `/services#shop`.

## 5. Additional polish

- Header restyled: transparent-over-hero → linen glass on scroll, brass underline for active link
- Footer: coastal wordmark, thin sail-line divider
- Buttons: primary = navy fill with brass hover ring; ghost = navy text + brass underline reveal
- All existing routes/features preserved (admin, auth, blog, contact, solutions)

## Technical Details

- `bun add @fontsource/fraunces @fontsource/inter-tight`; import in `src/main.tsx`
- Update `tailwind.config.ts` fontFamily + `container` unchanged
- Generate 2 hero images (premium tier, 1920×1080) into `src/assets/hero-slide-1.jpg` and `hero-slide-2.jpg`
- Generate 1 shop teaser backdrop if needed
- No backend/schema changes; no route breakage (Shop redirect keeps SEO)
- Keep existing accessibility (focus-visible, aria-*, reduced-motion)
