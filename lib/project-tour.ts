import { projectDetails } from "@/lib/data";
import { projectSlug } from "@/lib/portfolio-content";

/** `text` is what the guide says; wrap the phrase to emphasise in *asterisks*. */
export type TourStep = {label:string;title:string;text:string;image?:string};
const stories:Record<string,TourStep[]>={
  cega:[
    {label:"Meet the project",title:"A whole program. One platform.",text:"This is CEGA, a national gaming and animation hub. I built *the platform that runs it*.",image:"/case-studies/cega/training-overview.png"},
    {label:"What I built",title:"From applications to decisions.",text:"Here’s judging. Applicants, reviewers and admins each *see only what they need*.",image:"/case-studies/cega/judging-phase-1.png"},
    {label:"Behind the scenes",title:"The everyday work, connected.",text:"Bookings, shared spaces, *14+ portals* and an AI assistant. All in one place.",image:"/case-studies/cega/coworking-lab.png"},
  ],
  "gomila-intersole":[
    {label:"Meet the project",title:"A storefront with its own identity.",text:"Next up, Gomila. A footwear store on Shopify with *its own custom theme*."},
    {label:"What I built",title:"From product discovery to checkout.",text:"Behind the storefront, *automations* keep orders and stock in check."},
    {label:"The toolkit",title:"Commerce, inside and out.",text:"Shopify underneath, Liquid on top. It’s live, so *go have a look*."},
  ],
  deeniverse:[
    {label:"Meet the project",title:"A place to learn. A reason to return.",text:"Deeniverse is a Quran learning platform, *built front to back*."},
    {label:"What I built",title:"More than a landing page.",text:"Sign-in, courses and *progress tracking*, so students pick up where they left off."},
    {label:"The toolkit",title:"The full learning experience.",text:"React up front, Node and MongoDB behind. *One connected build.*"},
  ],
  "nextgrid-it":[
    {label:"Meet the project",title:"Making technical services clear.",text:"NextGrid IT, a UK IT firm. The job: make their services *easy to understand*."},
    {label:"What I built",title:"A consistent business presence.",text:"Service pages, client portals and *one design system* holding it together."},
    {label:"The toolkit",title:"A considered web foundation.",text:"Next.js, TypeScript and Tailwind. *Open it and click around.*"},
  ],
  "ai-chat-agent":[
    {label:"Meet the project",title:"AI with a job to do.",text:"AI Chat Agent. An *assistant for store owners*, not just a chat box."},
    {label:"What I built",title:"The product around the conversation.",text:"Google sign-in and *usage limits*. The unglamorous bits that make AI shippable."},
    {label:"The toolkit",title:"A look under the hood.",text:"Python, Flask, OAuth and an LLM API. *The code is on GitHub.*"},
  ],
};

/** Background for each project's chapter; the tour blends between them as you scroll. */
const tints:Record<string,string>={cega:"#293b32","gomila-intersole":"#554b3c",deeniverse:"#34473e","nextgrid-it":"#424b35","ai-chat-agent":"#272c25"};
const fallbackTints=["#293b32","#554b3c","#34473e","#424b35","#272c25"];

/** Newly added projects automatically join the tour, with factual data fallbacks. */
export const tourProjects=projectDetails.map((project,i)=>({
  ...project,slug:projectSlug(project.name),
  tint:tints[projectSlug(project.name)]??fallbackTints[i%fallbackTints.length],
  steps:stories[projectSlug(project.name)]??[
    {label:"Meet the project",title:project.name,text:`This is *${project.name}*. ${project.desc}`},
    {label:"The project",title:project.kind,text:project.meta},
    {label:"The toolkit",title:"Behind the build",text:`Built with ${project.stack.join(", ")}. *Open it for a closer look.*`},
  ],
}));
export const tourStops=tourProjects.flatMap((project,projectIndex)=>project.steps.map((step,stepIndex)=>({project,projectIndex,step,stepIndex})));
export type TourCue={index:number;projectIndex:number;stepIndex:number;projectName:string;text:string;title:string;total:number};
