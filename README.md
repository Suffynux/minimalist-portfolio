# Sufiyan Portfolio

A polished personal portfolio for Sufiyan Ali, built with the Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style primitives, and Framer Motion. The site presents Shopify, MERN, automation, AI, and creative work through a fast, responsive, content-driven interface.

## Highlights

- Responsive home page with hero, services, selected work, about, process, and contact sections
- Dedicated project, creative, and journey pages
- Centralized portfolio content in `lib/data.ts`
- Animated reveal effects with Framer Motion
- Reusable UI components for cards, navigation, tags, contact links, and WhatsApp CTA
- Google font setup through `next/font`

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
  creatives/page.tsx    Creative work gallery
  journey/page.tsx      Timeline and experience
components/
  *.tsx                 Reusable layout, cards, nav, contact, and UI pieces
lib/
  data.ts               Site copy, links, services, projects, stats, and galleries
  utils.ts              Shared utility helpers
```

## Editing Content

Most portfolio content lives in `lib/data.ts`, including:

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
