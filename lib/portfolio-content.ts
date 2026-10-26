/** Add approved client feedback here when it is supplied. Nothing is invented. */
export type Testimonial = { quote:string; name:string; role:string; company?:string; project?:string };
export const testimonials: Testimonial[] = [];

export function projectSlug(name:string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
