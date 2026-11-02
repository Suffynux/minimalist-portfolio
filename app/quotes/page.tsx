import { pageMetadata } from "@/lib/seo";
import { EditorialShell } from "@/components/editorial-shell";
import { EditorialQuotes } from "@/components/quotes/editorial-quotes";
import { getQuotes, getWallSettings } from "@/lib/quotes/queries";
import "./quotes.css";
import "./deck.css";

export const metadata = pageMetadata({
  title: "Words That Stay — Quotes & Reflections",
  description:
    "Sufiyan Ali’s personal notebook. Original thoughts, collected quotes, and words worth coming back to.",
  path: "/quotes",
});
export const revalidate = 60;

export default async function QuotesPage() {
  const [quotes, settings] = await Promise.all([
    getQuotes(),
    getWallSettings(),
  ]);
  return (
    <EditorialShell className="editorial-secondary quotes-editorial">
      <EditorialQuotes quotes={quotes} accepting={settings.accepting} />
    </EditorialShell>
  );
}
