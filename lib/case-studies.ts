/**
 * Long-form case studies.
 *
 * These are the written counterpart to `projectDetails` in `lib/data.ts`: a
 * project there is a card, a case study here is a full page at
 * /projects/<slug>. The PDF stays available as a download, but the page is the
 * canonical version - it reads properly on a phone and search engines can
 * actually index it.
 */

export type CaseStudyStat = {
  num: string;
  label: string;
};

export type CaseStudyFact = {
  label: string;
  value: string;
};

/** A program / workstream card: what the platform is made of. */
export type CaseStudyPillar = {
  no: string;
  tag: string;
  title: string;
  desc: string;
};

/** A job the platform does on its own, with the manual process it replaced. */
export type CaseStudyAutomation = {
  no: string;
  title: string;
  desc: string;
  before: string;
  now: string;
};

export type CaseStudyShot = {
  src: string;
  alt: string;
  title: string;
  desc: string;
  /** Portrait screenshots (e.g. the mobile chatbot) render narrower. */
  portrait?: boolean;
  /** Share a row with the next `half` shot instead of taking the full width. */
  half?: boolean;
};

/** One row of the "in plain words" technology table. */
export type CaseStudyTechRow = {
  part: string;
  does: string;
  built: string;
};

export type CaseStudyOffer = {
  tag: string;
  title: string;
  desc: string;
};

export type CaseStudy = {
  slug: string;
  /** Must match `DetailedProject.name` so the project card can link here. */
  project: string;
  eyebrow: string;
  title: string;
  lede: string;
  readingNote: string;
  stats: CaseStudyStat[];
  facts: CaseStudyFact[];
  problem: {
    eyebrow: string;
    title: string;
    lede: string;
    body: string;
  };
  pillars: {
    eyebrow: string;
    title: string;
    lede: string;
    items: CaseStudyPillar[];
  };
  automations: {
    eyebrow: string;
    title: string;
    lede: string;
    items: CaseStudyAutomation[];
  };
  shots: {
    eyebrow: string;
    title: string;
    items: CaseStudyShot[];
  };
  judging: {
    eyebrow: string;
    title: string;
    items: CaseStudyShot[];
  };
  tech: {
    eyebrow: string;
    title: string;
    lede: string;
    rows: CaseStudyTechRow[];
    pullquote: string;
    stack: string[];
  };
  takeaway: {
    eyebrow: string;
    title: string;
    lede: string;
    items: CaseStudyOffer[];
  };
  pdf: string;
  live: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "cega",
    project: "CEGA",
    eyebrow: "CASE STUDY / NATIONAL PLATFORM",
    title: "The system running Pakistan's national gaming and animation program.",
    lede: "CEGA is a government-backed hub for training, startup incubation, co-working, and community events, used by more than 10,000 students. I designed and built the whole platform on my own, replacing an old WordPress site that could not keep up with the program it was meant to run.",
    readingNote:
      "Read this in three layers: the story of the problem and the fix, the automation that now runs without staff, and a plain-English breakdown of the technology for both technical and non-technical readers.",
    stats: [
      { num: "10,000+", label: "STUDENTS SERVED" },
      { num: "3,392", label: "APPLICANTS IN ONE BATCH" },
      { num: "200+", label: "STARTUPS INCUBATED" },
      { num: "14+", label: "APPLICATION PORTALS" }
    ],
    facts: [
      { label: "MY ROLE", value: "Full-stack developer, solo build and maintenance" },
      { label: "CLIENT", value: "CEGA, Center of Excellence in Gaming & Animation" },
      { label: "BACKED BY", value: "Ministry of IT & Telecom, Ignite National Technology Fund" },
      { label: "BUILT WITH", value: "Next.js, MongoDB, OpenAI, NextAuth" },
      { label: "CENTERS", value: "Karachi and Lahore, plus online" },
      { label: "STATUS", value: "Live at cega.com.pk" }
    ],
    problem: {
      eyebrow: "THE PROBLEM",
      title: "Growing attention, no system to catch it",
      lede: "CEGA runs Pakistan's national training program for gaming and animation. When I came in, the entire thing ran on a basic WordPress website.",
      body: "It barely showed up in Google, so the growing interest the program was earning had nowhere useful to land. More importantly, there was no real system behind the site. There was no proper way to take and verify student applications, no way for judges to score applicants fairly, no automatic emails when someone applied or got accepted, and no way to book a co-working seat, a rendering lab, or a meeting room online. Everything happened by hand, or did not happen at all. Rising demand was a problem instead of an asset, because the site had no way to turn visitors into enrolled students, scored applicants, and booked sessions."
    },
    pillars: {
      eyebrow: "WHAT CEGA ACTUALLY IS",
      title: "Four programs, one platform",
      lede: "CEGA is not a single website. It is four connected programs, each with its own applications, data, and reporting, all run from one system I built and maintain.",
      items: [
        {
          no: "01",
          tag: "TRAINING",
          title: "Courses and enrollment",
          desc: "Applications, enrollment, and outcomes across multiple batches and courses like Unity 3D, Unreal Engine, and 3D animation, onsite in Karachi and Lahore and online."
        },
        {
          no: "02",
          tag: "INCUBATION",
          title: "Startup evaluation",
          desc: "A two-phase judging process that screens founders on market fit, then runs a deeper investment-grade review on the finalists."
        },
        {
          no: "03",
          tag: "CO-WORKING",
          title: "Seats and labs",
          desc: "Bookings and occupancy for co-working seats, meeting rooms, and a rendering lab, tracked per center."
        },
        {
          no: "04",
          tag: "COMMUNITY",
          title: "Events and participation",
          desc: "Event hosting, bookings, and participant tracking that ties the whole community together."
        }
      ]
    },
    automations: {
      eyebrow: "WHAT RUNS ON ITS OWN",
      title: "The work the platform does without staff",
      lede: "This is the real value of the build. Jobs that used to need a person now happen automatically, correctly, every time.",
      items: [
        {
          no: "01",
          title: "Student applications and verification",
          desc: "Multi-step forms that check and save answers as the student types, then confirm the submission. No manual data entry.",
          before: "paper and inbox chaos",
          now: "self-serve and verified"
        },
        {
          no: "02",
          title: "Emails that send themselves",
          desc: "A new sign-up, a booking, a judge's score, or an accept or reject decision each trigger the right email on their own.",
          before: "someone types each reply",
          now: "sent automatically"
        },
        {
          no: "03",
          title: "Two-phase judge scoring",
          desc: "Applicants are scored in two rounds. Each judge sees only their own list, and the system stops any judge from overwriting another's score.",
          before: "spreadsheets, disputes",
          now: "tracked and locked"
        },
        {
          no: "04",
          title: "Bookings with conflict prevention",
          desc: "Seats, rooms, and the rendering lab are booked online, and the system blocks double-bookings before they happen.",
          before: "clashes and guesswork",
          now: "real-time availability"
        },
        {
          no: "05",
          title: "AI assistant, 24/7",
          desc: "A chatbot answers applicant questions about courses, programs, and locations instantly, at any hour, so the team stops repeating itself.",
          before: "same questions daily",
          now: "answered instantly"
        },
        {
          no: "06",
          title: "One live dashboard",
          desc: "Applications, enrollment, bookings, and attendance roll up into one dashboard, filterable by batch, city, and date.",
          before: "scattered spreadsheets",
          now: "one live view"
        }
      ]
    },
    shots: {
      eyebrow: "INSIDE THE PLATFORM",
      title: "Real dashboards, real numbers",
      items: [
        {
          src: "/case-studies/cega/training-overview.png",
          alt: "CEGA training overview dashboard showing 3,392 total applicants and 717 enrolled students, with breakdowns by age and education",
          title: "Training overview",
          desc: "3,392 applicants and 717 enrolled students in a single batch, broken down live by age, education, gender, and city across 126 cities."
        },
        {
          src: "/case-studies/cega/coworking-lab.png",
          alt: "CEGA co-working dashboard showing 733 applications, 590 occupants served and daily seat occupancy charts",
          title: "Co-working and rendering lab",
          desc: "733 applications and 590 people served, with daily seat occupancy per center and 61 rendering-lab bookings tracked against requested hours."
        },
        {
          src: "/case-studies/cega/community-events.png",
          alt: "CEGA community dashboard showing 591 bookings, 110 events hosted, 887 participants and 532 unique participants",
          title: "Community and events",
          desc: "591 bookings, 110 events hosted, and 887 participants (532 unique), filterable by center and date range."
        },
        {
          src: "/case-studies/cega/city-breakdown.png",
          alt: "CEGA city-level dashboard comparing course registrations in Karachi and Lahore",
          title: "City-level breakdown",
          desc: "Registrations by course for Karachi (516) and Lahore (538), each with its own live filters for batch, delivery mode, and course."
        }
      ]
    },
    judging: {
      eyebrow: "FAIR, TRACKED JUDGING",
      title: "Two rounds of scoring, no disputes",
      items: [
        {
          src: "/case-studies/cega/judging-phase-1.png",
          alt: "CEGA phase one judging screen scoring an applicant across six weighted criteria",
          title: "Phase 1, concept and market fit",
          desc: "Each applicant is scored across six weighted criteria, with a composite average and a qualify or reject status."
        },
        {
          src: "/case-studies/cega/judging-phase-2.png",
          alt: "CEGA phase two evaluation screen showing an investment grade matrix for a finalist",
          title: "Phase 2, final evaluation",
          desc: "An investment-grade review on the finalist pool, with a portfolio-readiness score.",
          half: true
        },
        {
          src: "/case-studies/cega/ai-assistant.png",
          alt: "CEGA AI assistant chat window answering a question about the training module",
          title: "AI assistant",
          desc: "Answers course questions in real time.",
          portrait: true,
          half: true
        }
      ]
    },
    tech: {
      eyebrow: "THE TECHNOLOGY",
      title: "What it is built with, in plain words",
      lede: "Every part of the platform is listed below twice: once in plain English, and once with the actual tool. A non-technical reader can follow the middle column; a technical reader can check the right one.",
      rows: [
        {
          part: "The website and pages",
          does: "Everything visitors see: fast pages, forms, and dashboards that work on phone and desktop.",
          built: "Next.js, TypeScript, Tailwind CSS"
        },
        {
          part: "The database",
          does: "Where every applicant, booking, score, and record is stored and searched.",
          built: "MongoDB Atlas, Mongoose"
        },
        {
          part: "Logins and roles",
          does: "Secure sign-in that shows admins, judges, and students only what they are allowed to see.",
          built: "NextAuth, JWT, bcrypt"
        },
        {
          part: "The AI assistant",
          does: "The chatbot that answers questions about courses and programs on its own.",
          built: "OpenAI GPT-4"
        },
        {
          part: "Automatic emails",
          does: "Confirmations, booking notices, and status updates that send themselves.",
          built: "NodeMailer"
        },
        {
          part: "Images and files",
          does: "Uploads and media handled and delivered quickly.",
          built: "Cloudinary"
        },
        {
          part: "Hosting",
          does: "Keeps the site fast and online for thousands of users.",
          built: "Vercel edge network"
        }
      ],
      pullquote:
        "The hardest part was the judge scoring. Several judges can score the same applicant at the same time, each score is recorded and tied to that judge, and the system makes sure no one can ever overwrite another judge's work.",
      stack: [
        "Next.js 15",
        "TypeScript",
        "MongoDB",
        "NextAuth",
        "OpenAI GPT-4",
        "NodeMailer",
        "Cloudinary",
        "Tailwind CSS",
        "Vercel"
      ]
    },
    takeaway: {
      eyebrow: "WHAT THIS MEANS FOR YOU",
      title: "The same parts, any size project",
      lede: "CEGA is a large platform, but it is built from the same building blocks I use on smaller jobs. Whatever you need, one part of this project already proves I can do it.",
      items: [
        {
          tag: "WEBSITE",
          title: "Need a website?",
          desc: "This is the same foundation, just smaller and faster to build, and made to actually show up in search."
        },
        {
          tag: "AI",
          title: "Want AI on your site?",
          desc: "The assistant here is the same kind of AI feature I can add to yours, for support, sales, or bookings."
        },
        {
          tag: "AUTOMATION",
          title: "Tired of manual work?",
          desc: "The automatic emails, scoring, and bookings are automation. The same idea removes busywork like invoices, reminders, and reports."
        },
        {
          tag: "WEB APP",
          title: "Need something bigger?",
          desc: "This handles logins, roles, dashboards, and thousands of users without breaking. Your custom tool or portal is well within range."
        }
      ]
    },
    pdf: "/case-studies/cega/CEGA-Case-Study.pdf",
    live: "https://cega.com.pk"
  }
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

/** Lookup by project name, so a project card knows whether a page exists. */
export function getCaseStudyForProject(project: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.project === project);
}
