import { projectDetails } from "@/lib/data";
import { projectSlug } from "@/lib/portfolio-content";

export type TourStep = {label:string;title:string;text:string;image?:string};
const stories:Record<string,TourStep[]>={
  cega:[
    {label:"Meet the project",title:"A whole program. One platform.",text:"This is CEGA, a national gaming and animation hub. I connected its training, applications and everyday operations in one full-stack platform.",image:"/case-studies/cega/training-overview.png"},
    {label:"What I built",title:"From applications to decisions.",text:"Here’s the judging workflow. Applicants, reviewers and administrators have different jobs, so the platform gives each role the tools and permissions it needs.",image:"/case-studies/cega/judging-phase-1.png"},
    {label:"Behind the scenes",title:"The everyday work, connected.",text:"And here are the shared spaces and bookings. CEGA brings more than fourteen application portals together, with Next.js, MongoDB and an integrated AI assistant.",image:"/case-studies/cega/coworking-lab.png"},
  ],
  "gomila-intersole":[
    {label:"Meet the project",title:"A storefront with its own identity.",text:"Next up, Gomila Intersole. This is a footwear storefront built on Shopify, with a custom Liquid theme rather than a generic storefront experience."},
    {label:"What I built",title:"From product discovery to checkout.",text:"My work here covers the custom theme and product pages, along with order and inventory automations that support the store behind the scenes."},
    {label:"The toolkit",title:"Commerce, inside and out.",text:"Shopify provides the commerce foundation. Liquid shapes the storefront, and automations connect the operational work. You can open the live store to explore it."},
  ],
  deeniverse:[
    {label:"Meet the project",title:"A place to learn. A reason to return.",text:"Meet Deeniverse, a Quran learning platform. The build connects the public website with the tools students need once they’ve signed in."},
    {label:"What I built",title:"More than a landing page.",text:"Authentication, course management and progress tracking are all part of this build. The aim is to give learning a clear path, from discovery to continued study."},
    {label:"The toolkit",title:"The full learning experience.",text:"React handles the interface. Node.js and Express handle the application logic, with MongoDB for the data. A connected frontend and backend for one learning experience."},
  ],
  "nextgrid-it":[
    {label:"Meet the project",title:"Making technical services clear.",text:"This is NextGrid IT, a corporate website for a UK IT firm. A different kind of project: help visitors understand the services and find their next step."},
    {label:"What I built",title:"A consistent business presence.",text:"The work includes service showcases, client portals and a shared design system, so the website feels consistent as visitors move between sections."},
    {label:"The toolkit",title:"A considered web foundation.",text:"Next.js, TypeScript and Tailwind form the toolkit for this build. Open the website to see the service pages and the design in context."},
  ],
  "ai-chat-agent":[
    {label:"Meet the project",title:"AI with a job to do.",text:"Here’s AI Chat Agent, a full-stack AI application built for store owners. It connects an LLM to an application with authentication and usage controls."},
    {label:"What I built",title:"The product around the conversation.",text:"The build includes Google sign-in, usage limits and e-commerce integration settings. Those surrounding systems matter just as much as the chat interface."},
    {label:"The toolkit",title:"A look under the hood.",text:"Python and Flask handle the backend, with OAuth for sign-in and an LLM API for responses. The source code is available if you’d like a closer look."},
  ],
};

/** Newly added projects automatically join the tour, with factual data fallbacks. */
export const tourProjects=projectDetails.map(project=>({
  ...project,slug:projectSlug(project.name),
  steps:stories[projectSlug(project.name)]??[
    {label:"Meet the project",title:project.name,text:`This is ${project.name}. ${project.desc}`},
    {label:"The project",title:project.kind,text:project.meta},
    {label:"The toolkit",title:"Behind the build",text:`The toolkit for ${project.name}: ${project.stack.join(", ")}. Open the project for a closer look.`},
  ],
}));
export const tourStops=tourProjects.flatMap((project,projectIndex)=>project.steps.map((step,stepIndex)=>({project,projectIndex,step,stepIndex})));
export type TourCue={index:number;projectIndex:number;stepIndex:number;projectName:string;text:string;title:string;total:number};
