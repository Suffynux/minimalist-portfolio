import { pageMetadata } from "@/lib/seo";
import { PortfolioPage, PageIntro, NextChapter } from "@/components/portfolio-page";
import { TagList } from "@/components/tag-list";
import { journeyStats, milestones, principles } from "@/lib/data";

export const metadata = pageMetadata({ title: "About Sufiyan Ali: Full-Stack Developer", description: "Meet Sufiyan Ali, the Pakistan-based full-stack developer behind Suffynux. Explore his development journey, working principles and approach to practical AI.", path: "/journey" });
export default function JourneyPage() {
  return <PortfolioPage>
    <PageIntro eyebrow="01 / THE HUMAN BEHIND THE BUILD" title={<>Curious mind.<br/><em>Builder at heart.</em></>}>I’m Sufiyan, a developer based in Pakistan. I like the point where a messy problem starts becoming a clear, useful product.</PageIntro>
    <section className="studio-section page-width journey-lead"><p className="eyebrow">A LITTLE ABOUT HOW I THINK</p><p>The screen is only one part of the story. I care about who uses it, what happens behind it, and whether it makes someone’s day a little easier.</p></section>
    <section className="page-width journey-principles" aria-label="My working principles">{principles.map((item,i)=><article className="journey-principle" key={item.title}><span>0{i+1} / {item.tag}</span><h3>{item.title}</h3><p>{item.desc}</p></article>)}</section>
    <section className="studio-section page-width"><p className="eyebrow">LEARNING BY BUILDING</p><h2 style={{marginTop:20}}>The story <em>so far.</em></h2><div className="journey-timeline">{milestones.map(item=><article className="journey-milestone" key={item.year+item.label}><span>{item.year}</span><div><span className="eyebrow">{item.label}</span><h3>{item.title}</h3><p>{item.desc}</p>{item.stack&&<TagList tags={item.stack} className="mt-5"/>}</div></article>)}</div></section>
    <div className="page-width"><section className="journey-stats" aria-label="Experience at a glance">{journeyStats.map(stat=><div key={stat.label}><strong>{stat.num}</strong><span>{stat.label}</span></div>)}</section></div>
    <NextChapter eyebrow="THE THINKING, IN PRACTICE" title={<>Enough about me.<br/><em>Meet the work.</em></>} href="/projects" label="Explore the projects"/>
  </PortfolioPage>;
}
