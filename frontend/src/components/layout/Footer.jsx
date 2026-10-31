import { Link } from 'react-router-dom';
import { ArrowUpRight, CreditCard, Mail, MapPin, Phone } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import SpectrumBar from '@/components/brand/SpectrumBar';
import { BRAND, isPlaceholderValue, resolveEmail } from '@/content/brand';

const FOOTER_LINKS = {
  Brand: [
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/projects', label: 'Work' },
    { to: '/blog', label: 'Insights' },
  ],
  Connect: [
    { to: '/contact', label: 'Contact' },
    { to: '/careers', label: 'Careers' },
  ],
};

export default function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();
  const email = resolveEmail(settings);

  return (
    <footer className="border-t border-surface-border bg-surface/50">
      <SpectrumBar className="opacity-70" />
      <div className="container-app section-padding pb-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-4 w-44 rounded-xl bg-white p-3">
              <img src="/brand/veralyx.png" alt="Veralyx — Authentic Strategies, Brilliant Outcomes" className="h-28 w-full object-contain" loading="lazy" />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {BRAND.description}
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
                {title}
              </h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={`${title}-${link.to}-${link.label}`}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted transition-colors hover:text-brand-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 border-t border-surface-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <a href={`mailto:${email}`} className="flex items-start gap-2 text-sm text-muted hover:text-white">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" aria-hidden="true" />
            {email}
          </a>
          {!isPlaceholderValue(settings.phone) && (
            <a href={`tel:${settings.phone}`} className="flex items-start gap-2 text-sm text-muted hover:text-white">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" aria-hidden="true" />
              {settings.phone}
            </a>
          )}
          {!isPlaceholderValue(settings.address) && (
            <p className="flex items-start gap-2 text-sm text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" aria-hidden="true" />
              {settings.address}
            </p>
          )}
          <a href={BRAND.paymentUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-muted hover:text-white">
            <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" aria-hidden="true" />
            Pay Veralyx via Razorpay <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-light" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-surface-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted">
              &copy; {year} {BRAND.name}. All rights reserved.
            </p>
            <p className="text-sm text-muted">{BRAND.legalLine}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
