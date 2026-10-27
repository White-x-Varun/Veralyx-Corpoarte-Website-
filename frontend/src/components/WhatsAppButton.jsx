import { MessageCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { formatPhoneForWhatsApp } from '@/utils/format';
import { BRAND } from '@/content/brand';

export default function WhatsAppButton() {
  const { settings } = useSettings();
  const number = formatPhoneForWhatsApp(settings.whatsappNumber);
  const message = encodeURIComponent(
    settings.whatsappPrefill || `Hello Veralyx, I would like to get in touch.`,
  );
  const href = number ? `https://wa.me/${number}?text=${message}` : BRAND.whatsappUrl;

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
