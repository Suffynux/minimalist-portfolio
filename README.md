# Sufiyan Portfolio

A polished personal portfolio for Sufiyan Ali, built with the Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style primitives, and Framer Motion. The site presents full-stack applications, websites, AI integrations and business automation through a scrolling story guided by an articulated monochrome 3D character.

## Highlights

- Responsive chapter-based homepage with synchronized project walkthroughs and narration
- Filterable project index, 3D playground, project detail pages, quote wall and development journey
- Real head, eye and arm movement, presentation poses, reactions, a dithered finish and a static fallback
- Centralized portfolio content in `lib/data.ts`
- Animated reveal effects with Framer Motion
- Reusable UI components for cards, navigation, tags, contact links, and WhatsApp CTA
- Self-hosted Manrope, Instrument Serif and JetBrains Mono through `next/font/local`

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js (lazy-loaded character renderer)
- Radix Slot
- Lucide React

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev
```

Runs the local development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after building.

```bash
npm run typecheck
```

Runs TypeScript checks with `tsc --noEmit`.

```bash
npm run lint
```

Runs the configured Next.js lint command.

## Project Structure

```text
app/
  page.tsx              Home page
  projects/page.tsx     Project showcase
  creatives/page.tsx    Interactive 3D playground
  journey/page.tsx      Timeline and experience
components/
  *.tsx                 Reusable layout, cards, nav, contact, and UI pieces
lib/
  data.ts               Site copy, links, services, projects, stats, and galleries
  utils.ts              Shared utility helpers
```

## Editing Content

The homepage story and capability copy live in `components/story-portfolio.tsx`, with chapter narration in `lib/story.ts`. Project and contact content live in `lib/data.ts`, including:

- Contact details and social links in `site`
- Navigation links in `navItems`
- Services, process steps, stats, and principles
- Featured and detailed projects
- Journey milestones
- Creative gallery sections and tools

Update project images by replacing the `img` values in `lib/data.ts` with real screenshots or production assets.

## Deployment

This project is ready for deployment on Vercel or any platform that supports Next.js. Build locally with:

```bash
npm run build
```

Then deploy the generated Next.js application using your preferred hosting provider.

## Archived ASCII exports

`components/ascii-portrait.tsx` renders the local character map on canvas. A static SVG is available before JavaScript and if loading fails. Animation respects reduced motion, pauses painting offscreen and does not load the original photo in the browser.

Run `npm run avatar:generate` after editing `scripts/generate-ascii.mjs` to rebuild the portrait data, 1080px PNGs, SVGs, text export, and social sharing image. The script samples the existing `lib/assessts/Avator.jpeg`; its silhouette mask is specific to that portrait. It uses Sharp, which is also installed with Next.js.

Exports live in `public/avatar/`. The PNG files are ready for WhatsApp profile pictures; the SVG files scale without losing the character shapes. The interactive modes are browser effects; downloaded portraits are clean, static artwork.

The shared visual system is in `app/studio.css`, `app/story.css` and `app/portfolio.css`; inner-page components share the palette through `tailwind.config.ts`. The quotes backend and admin flows retain their existing Supabase setup. See `.env.example` for the required environment variable names.


## Guided portfolio and 3D character

The homepage is `components/story-portfolio.tsx`, with chapter narration in `lib/story.ts`.
`lib/avatar-rig.ts` constructs the original articulated 3D character; `components/mascot-canvas.tsx`
lazy-loads Three.js and renders the monochrome dither pass. It turns toward the presentation,
points, follows the pointer, and supports reactions. Rendering pauses offscreen, when hidden,
and in background tabs. Devices without WebGL receive the saved illustrated portrait.

`app/studio.css` contains the shared site layout and presentation overrides. `app/story.css`
contains the chapter and character foundations. Palette tokens are shared with the quote wall
and case studies through `tailwind.config.ts`.

### Adding approved content

- Edit `projectDetails` in `lib/data.ts` to add project names, descriptions, stacks and links.
  Project overview routes and the sitemap are derived from those names.
- Add long-form case studies to `lib/case-studies.ts`; CEGA is the existing full case study.
- Add approved testimonials to the typed `testimonials` array in `lib/portfolio-content.ts`.
  The testimonial section is deliberately absent until real feedback is supplied.
- Quotes continue to use the existing Supabase collection and moderation workflow. No sample
  quotes or client feedback are written to the database by the rebuild.

`/creatives` is the interactive 3D playground. `/quotes` retains the scrollable quote deck,
filters, reading overlay and submissions. `/projects`, `/journey`, recovery pages and all
project routes share the same navigation and editorial frame.

Development output lives in `.next-dev`; production output stays in `.next`. This allows
`npm run build` to validate the site without breaking an already-running `npm run dev` preview.


### Interactive project tour

`lib/project-tour.ts` derives the tour from `projectDetails`. Each existing project has three
factual narration steps, and new entries automatically receive an introduction, overview and
stack step. Add custom narration and screenshot paths in that file to tailor new projects.
`components/project-tour.tsx` synchronizes native scrolling, project selectors and next/back
buttons using the sticky stage’s measured height. The character offers the same navigation
inside its speech bubble, with optional browser speech synthesis activated only by a click.
The live model has simple oval eyes, swept hair, a shaped animated mouth and coarse monochrome
dithering. `public/avatar/sufiyan-guide.png` is its matching fallback and downloadable portrait.
