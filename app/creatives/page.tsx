import { pageMetadata } from "@/lib/seo";
import { PortfolioPage, PageIntro, NextChapter } from "@/components/portfolio-page";
import { AvatarPlayground } from "@/components/avatar-playground";

export const metadata = pageMetadata({ title: "Creative Playground: Interactive 3D Character", description: "Explore Sufiyan Ali’s interactive 3D character playground. Try presentation poses, monochrome finishes and gestures in this creative web experiment.", path: "/creatives" });
export default function CreativesPage() {
  return <PortfolioPage>
    <PageIntro eyebrow="03 / THE PLAYGROUND" title={<>Serious about the work.<br/><em>Less serious here.</em></>}>A small corner for curiosity, interaction, and the little things that make the web feel more human.</PageIntro>
    <AvatarPlayground/>
    <NextChapter eyebrow="ONE MORE SIDE OF ME" title={<>Some things<br/><em>stay with you.</em></>} href="/quotes" label="Visit the quote wall"/>
  </PortfolioPage>;
}
