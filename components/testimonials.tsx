import { testimonials } from "@/lib/portfolio-content";

export function Testimonials() {
  if(!testimonials.length)return null;
  return <section className="testimonial-section" aria-label="Client testimonials"><p className="eyebrow">THE PEOPLE BEHIND THE PROJECTS</p>{testimonials.map(item=><figure key={item.name+item.quote}><blockquote>“{item.quote}”</blockquote><figcaption>{item.name} · {item.role}{item.company?`, ${item.company}`:""}{item.project?` / ${item.project}`:""}</figcaption></figure>)}</section>;
}
