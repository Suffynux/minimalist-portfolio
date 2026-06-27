import { site } from "@/lib/data";
import { WhatsAppIcon } from "@/components/icons";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-[60] flex size-[58px] items-center justify-center rounded-full bg-[#25D366] text-[#0B2E17] shadow-[0_10px_30px_-6px_rgba(37,211,102,0.55)] transition hover:scale-105"
    >
      <WhatsAppIcon className="size-[30px]" />
    </a>
  );
}
