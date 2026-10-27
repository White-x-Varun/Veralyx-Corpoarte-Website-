import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import BrandLogo from '@/components/brand/BrandLogo';
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
  Legal: [
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
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
            <BrandLogo />
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

        <div className="mt-12 grid gap-4 border-t border-surface-border pt-8 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>

        <div className="mt-8 space-y-2 border-t border-surface-border pt-6">
          <p className="text-sm text-muted">
            &copy; {year} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted">{BRAND.legalLine}</p>
        </div>
      </div>
    </footer>
  );
}
