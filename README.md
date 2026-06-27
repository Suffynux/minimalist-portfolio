# Sufiyan Portfolio

Next.js App Router + TypeScript portfolio converted from the supplied HTML design. It uses Tailwind CSS, shadcn/ui-style primitives, Framer Motion, and `next/font/google` for Instrument Serif, Manrope, and JetBrains Mono.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Edit content

All repeated content lives in [`lib/data.ts`](./lib/data.ts):

- `services`
- `featuredProject`
- `projects`
- `projectDetails`
- `principles`
- `milestones`
- `creativeSections`
- stats, process steps, filters, social links

Update the placeholder contact values in the `site` object:

```ts
export const site = {
  email: "suffynux@gmail.com",
  phone: "+923150541169",
  whatsapp: "923150541169",
  github: "https://github.com/suffynux/",
  linkedin: "https://www.linkedin.com/in/sufiyan-ali-suffynux/",
  upwork: "https://www.upwork.com/freelancers/~0165abeee5bd5616b7?viewMode=1",
  instagram: "https://instagram.com/sufiyan"
};
```

The project images are the stock Pexels images from the HTML. Replace each `img` URL in `lib/data.ts` with real screenshots when they are ready.
