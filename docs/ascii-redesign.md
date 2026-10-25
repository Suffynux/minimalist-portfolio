# ASCII portfolio redesign

Branch: `feat/ascii-portfolio`.

## Direction and content

The reference, [sebg.ch](https://www.sebg.ch/), uses a playful interactive character to introduce a developer and guide visitors through their work. This implementation borrows that interaction-led approach while using Sufiyan's own portrait, an original layout and existing project content. It does not reuse the reference site's character, copy or source code.

The live [Suffynux portfolio](https://www.suffynux.com/) was checked against `lib/data.ts` and `lib/case-studies.ts`. The [CEGA site](https://www.cega.com.pk/) also confirms its training, incubation, co-working, community and assistant surfaces. The description of Sufiyan's role and the 14+ portals figure come from his existing case study, not an independent attribution claim.

The new positioning leads with full-stack applications, websites, practical AI integrations and business logic. Commerce remains part of the offering rather than the entire headline. Project facts and contact destinations are retained from the existing portfolio. No new client endorsements or results were invented. The AI card is explicitly an interface concept; CEGA uses an actual repository screenshot.

## Implementation

- Home: `app/page.tsx`.
- Project index and filters: `app/projects/page.tsx`, `components/project-filters.tsx`.
- ASCII playground and profile-picture downloads: `app/creatives/page.tsx`.
- Portrait: `components/ascii-portrait.tsx`, generated from `lib/assessts/Avator.jpeg`.
- Visual system: `app/portfolio.css` and shared Tailwind colors.
- Self-hosted font files and licenses: `public/fonts/`.
- Sharing image and favicon: `public/og-ascii.png`, `app/icon.svg`.

The portrait is an ASCII rendering of the actual photo, not a 3D emoji model. Pointer movement, Focus and Glitch are canvas effects. Exports are static 1080px PNGs, SVGs and plain text. Reduced-motion users get a still portrait, and the SVG fallback works without JavaScript or when the character-data request fails.

The quote wall, admin authentication and backend integration remain in place. Existing case study and journey content use the updated navigation, palette and typography. Content can be refined in a separate pass.

## Local verification

Run `npm run build` and `npm run typecheck`. Run `npm run avatar:generate` to regenerate portrait assets and the sharing image. Preview with `npm run start` after building, or `npm run dev` while editing.
