# Suffynux portfolio

A responsive portfolio for Sufiyan Ali / Suffynux, built with Next.js, React and TypeScript. It presents the business problems, workflows and implementation behind client projects.

## Current experience

- Handwritten Suffynux entrance, charcoal and neutral paper with a cobalt accent.
- Scroll-driven project illustrations and continuous drawing that reverses with scrolling.
- Featured stories for Gomila OMS, CEGA, UK Medical Aid, Bangrila Motors and Zone Pro Matériaux.
- Twenty project detail routes, screenshot galleries, technology badges and a next-project journey.
- A continuous reading line across case-study sections and their footers.
- Smaller tools, an ASCII portrait, a searchable project collection, quotes and a creative playground.

## Run locally

```sh
npm install
npm run dev
```

Configure environment variables using `.env.example`. Existing Supabase configuration is required by the authentication middleware and quotes backend. Never commit local environment files.

```sh
npm run build
npm run start
```

## Edit the site

- `components/editorial-prototype.tsx`: homepage hero, OMS and CEGA scenes.
- `components/editorial-sections.tsx`: remaining project scenes, tools and portrait.
- `components/editorial-capabilities.tsx`: responsive capability diagram.
- `components/editorial-motion.tsx`: signature, scroll progress, masked SVG ink and page reading line.
- `components/editorial-case-study.tsx`: shared project study and screenshot navigation.
- `components/editorial-shell.tsx`: navigation, project index and footer.
- `app/editorial.css` and `app/editorial-complete.css`: layout, motion and palette.
- `lib/data.ts`, `lib/project-journey.ts` and `lib/project-showcase.ts`: project information and documented workflows.
- `public/work/`: approved project screenshots; `public/portraits/`: supplied ASCII portrait.

The visible SVG stroke stays solid; a separate mask reveals its prefix. This avoids scaling artifacts caused by combining normalized dash lengths with non-scaling strokes. The case-study reading line uses one HTML element so it crosses section backgrounds without SVG clipping.

## Verification

`npm run build` checks TypeScript and creates all project routes. The browser fixture in `tests/visual/line-regression.tsx` can temporarily be re-exported from a local test route. It compares the current SVG renderer against the earlier implementation at six viewport sizes, with partial, full, reverse and reduced-motion states. Keep the test route out of production.

Touch scrolling remains native. Reduced-motion preferences suppress the entrance and animated reveals. The legacy character and ASCII export tools remain available for the creative playground.

## Deployment

The GitHub repository is connected to Vercel. The `main` branch is used for production; other branches receive previews. Build locally before pushing changes to production.
