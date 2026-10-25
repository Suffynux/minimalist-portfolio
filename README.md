# Sufiyan Portfolio

A polished personal portfolio for Sufiyan Ali, built with the Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style primitives, and Framer Motion. The site presents full-stack applications, websites, AI integrations and business automation through an interactive ASCII identity.

## Highlights

- Responsive home page with hero, services, selected work, about, process, and contact sections
- Filterable project index, ASCII playground, case studies and journey pages
- Interactive portrait with pointer movement, Focus/Glitch modes, palette switching and profile-picture exports
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
  creatives/page.tsx    Interactive ASCII playground
  journey/page.tsx      Timeline and experience
components/
  *.tsx                 Reusable layout, cards, nav, contact, and UI pieces
lib/
  data.ts               Site copy, links, services, projects, stats, and galleries
  utils.ts              Shared utility helpers
```

## Editing Content

The homepage story and capability copy live in `app/page.tsx`. Project and contact content live in `lib/data.ts`, including:

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

## ASCII identity

`components/ascii-portrait.tsx` renders the local character map on canvas. A static SVG is available before JavaScript and if loading fails. Animation respects reduced motion, pauses painting offscreen and does not load the original photo in the browser.

Run `npm run avatar:generate` after editing `scripts/generate-ascii.mjs` to rebuild the portrait data, 1080px PNGs, SVGs, text export, and social sharing image. The script samples the existing `lib/assessts/Avator.jpeg`; its silhouette mask is specific to that portrait. It uses Sharp, which is also installed with Next.js.

Exports live in `public/avatar/`. The PNG files are ready for WhatsApp profile pictures; the SVG files scale without losing the character shapes. The interactive modes are browser effects; downloaded portraits are clean, static artwork.

The visual system is in `app/portfolio.css`; legacy inner-page components share its palette through `tailwind.config.ts`. The quotes backend and admin flows retain their existing Supabase setup. See `.env.example` for the required environment variable names.
