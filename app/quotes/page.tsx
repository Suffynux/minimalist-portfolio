import type { Metadata } from "next";
import { PortfolioPage, NextChapter } from "@/components/portfolio-page";
import { Wall } from "@/components/quotes/wall";
import { IndexGrid } from "@/components/quotes/index-grid";
import { getQuotes, getWallSettings } from "@/lib/quotes/queries";

export const metadata: Metadata = {
  title:"The Quote Wall — Words Worth Keeping",
  description:"A quiet corner for words that stay with you. Read Sufiyan’s collection, explore the wall, or leave a line of your own.",
  alternates:{canonical:"/quotes"},
};
export const revalidate=60;
export default async function QuotesPage() {
  const [quotes,settings]=await Promise.all([getQuotes(),getWallSettings()]);
  return <PortfolioPage className="quote-page">
    <Wall quotes={quotes} accepting={settings.accepting}/>
    <section id="index" className="quote-index page-width"><p className="eyebrow">A QUIETER WAY TO READ</p><h2>Every line, in order.</h2><p className="eyebrow">{quotes.length} LINES / PICK ONE TO REVISIT IT ON THE WALL</p>{quotes.length?<IndexGrid quotes={quotes}/>:<p className="text-sm leading-7 text-body">A little space for words worth keeping. {settings.accepting?"You can leave the first line using “Add yours” above.":"Check back for the collection."}</p>}</section>
    <NextChapter eyebrow="BACK TO THE BUILD" title={<>Words matter.<br/><em>So does the work.</em></>} href="/projects" label="Explore the projects"/>
  </PortfolioPage>;
}
