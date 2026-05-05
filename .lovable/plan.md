## Goal
Combine the Solutions and Projects pages into one unified page that showcases both our legal-tech solutions and our portfolio of completed projects.

## Approach

Keep a single route and page name. Recommended: keep `/solutions` as the merged route titled **"Solutions & Projects"**, and redirect `/projects` to it so existing links (e.g. the "View Case Studies" CTA) still work.

### Page structure (top → bottom)
1. Hero — combined headline ("AI-Powered Solutions & Proven Results")
2. Benefits stats strip (from Solutions: 60% / 99% / 24/7 / 40%)
3. Our Legal Tech Solutions — 6-card grid (from Solutions)
4. Featured Projects — portfolio grid with category filter badges (from Projects)
5. Portfolio stats (150+ / 50+ / 10+ / 99% from Projects)
6. Integration section (from Solutions)
7. Single combined CTA

### Files to change
- `src/pages/Solutions.tsx` — rewrite as the merged page containing both sets of content
- `src/pages/Projects.tsx` — delete
- `src/App.tsx` — remove `Projects` import/route; add a redirect `/projects` → `/solutions`
- `src/components/layout/Header.tsx` — remove the "Projects" nav item (Solutions remains, relabeled to "Solutions & Projects" — or keep "Solutions" for brevity)
- Update internal links: `Link to="/projects"` inside the merged page should scroll to the projects section instead

### Notes
- The home page section component `src/components/sections/Projects.tsx` is unrelated (used on `/`) and stays untouched.
- No backend or schema changes.
