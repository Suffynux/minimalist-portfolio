export type Service = {
  no: string;
  tag: string;
  title: string;
  desc: string;
  stack: string[];
};

export type Project = {
  name: string;
  status: string;
  href: string;
  meta: string;
  desc: string;
  stack: string[];
  img: string;
};

export type DetailedProject = {
  no: string;
  kind: string;
  name: string;
  status: string;
  meta: string;
  desc: string;
  stack: string[];
  live: string;
  pdf: string;
  img: string;
  reverse?: boolean;
};

export type Stat = {
  num: string;
  label: string;
};

export type ProcessStep = {
  no: string;
  title: string;
  desc: string;
};

export type Principle = {
  tag: string;
  title: string;
  desc: string;
};

export type Milestone = {
  year: string;
  label: string;
  title: string;
  desc: string;
  stack: string[] | null;
};

export type CreativeImage = {
  img: string;
  cap: string;
};

export type CreativeSection = {
  id: string;
  no: string;
  title: string;
  desc: string;
  cols: number;
  items: CreativeImage[];
};

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=700`;

const mk = (ids: number[], caps: string[]): CreativeImage[] =>
  ids.map((id, index) => ({ img: pexels(id), cap: caps[index] || "AI Generated" }));

export const site = {
  accent: "#6E7A45",
  email: "hello@sufiyan.dev",
  whatsapp: "923000000000",
  github: "https://github.com/Suffynux",
  linkedin: "https://linkedin.com/in/sufiyan",
  upwork: "https://upwork.com/freelancers/sufiyan",
  instagram: "https://instagram.com/sufiyan"
} as const;

export const navItems = [
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/projects" },
  { label: "Creatives", href: "/creatives" },
  { label: "Journey", href: "/journey" },
  { label: "About", href: "/#about" }
] as const;

export const marqueeText =
  "\u00A0\u00A0Shopify\u00A0\u00A0·\u00A0\u00A0Liquid\u00A0\u00A0·\u00A0\u00A0React\u00A0\u00A0·\u00A0\u00A0Next.js\u00A0\u00A0·\u00A0\u00A0Node.js\u00A0\u00A0·\u00A0\u00A0Express\u00A0\u00A0·\u00A0\u00A0MongoDB\u00A0\u00A0·\u00A0\u00A0Automations\u00A0\u00A0·\u00A0\u00A0AI Integration\u00A0\u00A0·\u00A0\u00A0Tailwind\u00A0\u00A0·\u00A0\u00A0TypeScript\u00A0\u00A0";

export const services: Service[] = [
  {
    no: "/ 01",
    tag: "commerce",
    title: "Shopify & E-commerce",
    desc: "Custom Liquid themes, conversion-focused storefronts and order, inventory & notification automations — built to sell, not just to look good.",
    stack: ["Shopify", "Liquid", "Theme Dev", "Automations"]
  },
  {
    no: "/ 02",
    tag: "product",
    title: "Web Apps — MERN",
    desc: "Full-stack platforms, dashboards and secure REST APIs with React/Next on the front and Node/Express/Mongo behind it. Scalable from MVP to growth.",
    stack: ["React", "Next.js", "Node.js", "MongoDB"]
  },
  {
    no: "/ 03",
    tag: "leverage",
    title: "Automation & AI",
    desc: "Cut the busywork — automated workflows, integrations and AI features (chat agents, LLM tooling) that quietly run in the background while you grow.",
    stack: ["APIs", "LLM", "Workflows", "Bots"]
  }
];

export const featuredProject: Project = {
  name: "CEGA",
  status: "FEATURED",
  href: "https://github.com/Suffynux/Cega-Readme",
  meta: "Pakistan's National Gaming & Animation Hub",
  desc: "A full-stack platform serving as the digital gateway for a national institute — portals, dashboards and content management powering 10,000+ students.",
  stack: ["Next.js", "React", "Node.js", "Full-Stack", "CMS"],
  img: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
};

export const projects: Project[] = [
  {
    name: "Gomila Intersole",
    status: "LIVE",
    href: "https://gomilaintersole.pk/",
    meta: "gomilaintersole.pk · Shopify Store",
    desc: "Custom Shopify store for a footwear brand — bespoke Liquid theme, conversion-focused product pages and order automations.",
    stack: ["Shopify", "Liquid", "Automations"],
    img: "https://images.pexels.com/photos/19090/pexels-photo.jpg"
  },
  {
    name: "Deeniverse",
    status: "LIVE",
    href: "http://deeniverse.com/",
    meta: "deeniverse.com · Learning Platform",
    desc: "Full-stack Quran learning platform with auth, course management, progress tracking and a polished landing experience.",
    stack: ["React", "Node.js", "MongoDB"],
    img: "https://images.pexels.com/photos/5553047/pexels-photo-5553047.jpeg"
  },
  {
    name: "NextGrid IT",
    status: "LIVE",
    href: "https://www.nextgridit.co.uk/",
    meta: "nextgridit.co.uk · United Kingdom",
    desc: "Corporate web presence for a UK IT firm — service showcases, client portals and a modern design system on Next.js.",
    stack: ["Next.js", "Tailwind", "TypeScript"],
    img: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
  },
  {
    name: "AI Chat Agent",
    status: "SAAS",
    href: "https://github.com/Suffynux/ai-chat-agent",
    meta: "Full-Stack AI SaaS Application",
    desc: "Production-ready AI chat platform with Google OAuth, LLM integration, usage limits and e-commerce integration settings.",
    stack: ["Python", "Flask", "LLM API"],
    img: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
  }
];

export const homeStats: Stat[] = [
  { num: "5+", label: "Years building for the web" },
  { num: "10k+", label: "Users served by shipped platforms" },
  { num: "15+", label: "Projects delivered end to end" },
  { num: "<24h", label: "Typical reply time" }
];

export const process: ProcessStep[] = [
  { no: "01", title: "Discovery", desc: "We talk through your goals, scope and what success actually looks like." },
  { no: "02", title: "Build", desc: "I build in clear milestones with regular previews — no black box." },
  { no: "03", title: "Launch", desc: "Tested, optimised and shipped. Handover docs included." },
  { no: "04", title: "Grow", desc: "Ongoing support, iterations and automations as you scale." }
];

export const filters = ["All", "Shopify", "MERN", "SaaS / AI", "Corporate"];

export const projectDetails: DetailedProject[] = [
  {
    no: "01",
    kind: "FULL-STACK PLATFORM",
    name: "CEGA",
    status: "FEATURED",
    meta: "National Gaming & Animation Hub · 10k+ users",
    desc: "The digital gateway for a national institute — student portals, admin dashboards and a content management system powering thousands of learners across Pakistan.",
    stack: ["Next.js", "React", "Node.js", "CMS"],
    live: "https://github.com/Suffynux/Cega-Readme",
    pdf: "#",
    img: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
    reverse: true
  },
  {
    no: "02",
    kind: "SHOPIFY STORE",
    name: "Gomila Intersole",
    status: "LIVE",
    meta: "gomilaintersole.pk · Footwear brand",
    desc: "A bespoke Shopify storefront with a custom Liquid theme, conversion-focused product pages, and order & inventory automations that keep the store running hands-free.",
    stack: ["Shopify", "Liquid", "Automations"],
    live: "https://gomilaintersole.pk/",
    pdf: "#",
    img: "https://images.pexels.com/photos/19090/pexels-photo.jpg"
  },
  {
    no: "03",
    kind: "LEARNING PLATFORM",
    name: "Deeniverse",
    status: "LIVE",
    meta: "deeniverse.com · EdTech",
    desc: "A full-stack Quran learning platform: authentication, course management, progress tracking and a polished landing experience that converts visitors to students.",
    stack: ["React", "Node.js", "MongoDB", "Express"],
    live: "http://deeniverse.com/",
    pdf: "#",
    img: "https://images.pexels.com/photos/5553047/pexels-photo-5553047.jpeg",
    reverse: true
  },
  {
    no: "04",
    kind: "CORPORATE SITE",
    name: "NextGrid IT",
    status: "UK",
    meta: "nextgridit.co.uk · United Kingdom",
    desc: "A modern corporate web presence for a UK IT firm — service showcases, client portals and a clean design system built on Next.js and TypeScript.",
    stack: ["Next.js", "Tailwind", "TypeScript"],
    live: "https://www.nextgridit.co.uk/",
    pdf: "#",
    img: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
  },
  {
    no: "05",
    kind: "AI SAAS APP",
    name: "AI Chat Agent",
    status: "SAAS",
    meta: "Full-stack AI application",
    desc: "A production-ready AI chat platform with Google OAuth, LLM integration, usage limits and e-commerce integration settings — built for resale to store owners.",
    stack: ["Python", "Flask", "LLM API", "OAuth"],
    live: "https://github.com/Suffynux/ai-chat-agent",
    pdf: "#",
    img: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
    reverse: true
  }
];

export const principles: Principle[] = [
  { tag: "how I work", title: "Clarity over jargon", desc: "You should always understand what I’m building and why. No black boxes, no surprise invoices." },
  { tag: "what I value", title: "Ship, then refine", desc: "Momentum beats perfection. I get a working version in front of you fast, then sharpen it together." },
  { tag: "the promise", title: "Your business first", desc: "Code is a means to an end. Every decision is judged by whether it moves your numbers." }
];

export const milestones: Milestone[] = [
  { year: "2019", label: "THE SPARK", title: "First lines of code", desc: "Started with HTML, CSS and JavaScript — building small sites for fun and quickly getting hooked on turning ideas into things people could actually use.", stack: ["HTML", "CSS", "JavaScript"] },
  { year: "2021", label: "GOING FULL-STACK", title: "Discovered the MERN stack", desc: "Went deep on React, Node, Express and MongoDB. Built my first real full-stack apps with authentication, databases and REST APIs — and never looked back.", stack: ["React", "Node.js", "MongoDB", "Express"] },
  { year: "2022", label: "COMMERCE", title: "Entered the Shopify world", desc: "Started building custom Shopify stores and Liquid themes for brands — learning what actually drives conversions, not just what looks nice.", stack: ["Shopify", "Liquid"] },
  { year: "2024", label: "SCALE", title: "Shipping for thousands", desc: "Delivered CEGA, a national platform serving 10,000+ users, plus live stores and apps for clients in Pakistan and the UK. Learned to build for scale and reliability.", stack: ["Next.js", "Full-Stack", "CMS"] },
  { year: "2025", label: "AI & AUTOMATION", title: "Building leverage", desc: "Added AI integrations, chat agents and automations to my toolkit — helping clients cut busywork and do more without growing their team.", stack: ["LLM API", "Automations", "AI"] },
  { year: "Now", label: "FREELANCE", title: "Open for your project", desc: "Taking on Shopify and MERN work for founders and brands who want the technical side handled properly. You grow the business; I build the engine.", stack: null }
];

export const journeyStats: Stat[] = [
  { num: "5+", label: "Years writing code" },
  { num: "15+", label: "Projects delivered" },
  { num: "10k+", label: "Users served" },
  { num: "3", label: "Countries shipped to" }
];

export const creativeHeroes = [
  { img: pexels(1762851), kicker: "FEATURED · AI CONCEPT", title: "Neon Dreams" },
  { img: pexels(3052361), kicker: "SERIES · BRAND", title: "Editorial Forms" }
];

export const creativeTags = [
  { label: "AI Art", href: "#ai-art" },
  { label: "Brand", href: "#brand" },
  { label: "Product", href: "#product" },
  { label: "Abstract", href: "#abstract" },
  { label: "All", href: "#ai-art" }
];

export const creativeSections: CreativeSection[] = [
  { id: "ai-art", no: "01 — AI ARTWORK", title: "Generative art", desc: "Concepts and scenes built with Midjourney, prompt-crafted and curated.", cols: 3, items: mk([1762851, 3617457, 1183992, 1707828, 1054218, 3308588], ["Dreamscape", "Portrait study", "Light & form", "Surreal city", "Neon figure", "Soft chaos"]) },
  { id: "brand", no: "02 — BRAND & IDENTITY", title: "Brand concepts", desc: "Visual identities, moodboards and logo directions for imagined and real brands.", cols: 4, items: mk([3585047, 4439901, 6177645, 1762851, 1707828, 5081930, 3771089, 2079438], ["Mark", "Palette", "Type lockup", "Hero", "Pattern", "Mockup", "Badge", "System"]) },
  { id: "product", no: "03 — PRODUCT MOCKUPS", title: "Product & UI", desc: "App screens, packaging and product shots — design that’s ready to build.", cols: 3, items: mk([196644, 326503, 1779487, 4439901, 160107, 1029757], ["App UI", "Dashboard", "Device", "Packaging", "Storefront", "Landing"]) },
  { id: "abstract", no: "04 — ABSTRACT & TEXTURE", title: "Abstract explorations", desc: "Textures, gradients and forms — the raw material behind the work.", cols: 4, items: mk([3109807, 1939485, 2693529, 3568520, 1762973, 2110951, 1568607, 1212487], ["Flow", "Grain", "Bloom", "Fold", "Haze", "Drift", "Glow", "Mesh"]) }
];

export const creativeTools = [
  { name: "Midjourney", use: "Concept art & hero imagery" },
  { name: "Photoshop", use: "Compositing & retouching" },
  { name: "Figma", use: "UI & brand systems" },
  { name: "Code", use: "Turning visuals into live sites" }
];
