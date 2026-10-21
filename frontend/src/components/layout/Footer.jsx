import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Linkedin, Youtube, Instagram, Facebook } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import BrandLogo from '@/components/brand/BrandLogo';
import SpectrumBar from '@/components/brand/SpectrumBar';
import { BRAND, isPlaceholderValue, resolveEmail, SOCIAL_PLATFORMS } from '@/content/brand';

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

const SOCIAL_ICONS = {
  linkedin: Linkedin,
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
  twitter: XIcon,
};

function XIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.725-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();
  const email = resolveEmail(settings);
  const social = settings.socialLinks || {};

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

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-surface-border pt-6">
          {SOCIAL_PLATFORMS.map((platform) => {
            const href = social[platform.key];
            const Icon = SOCIAL_ICONS[platform.key];
            const hasLink = href && !isPlaceholderValue(href);
            const className =
              'inline-flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border text-muted transition-colors hover:border-brand/40 hover:text-white';
            if (!hasLink) {
              return (
                <span
                  key={platform.key}
                  className={`${className} cursor-default opacity-60`}
                  title={`${platform.label} link will be added here`}
                  aria-label={`${platform.label} (coming soon)`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              );
            }
            return (
              <a
                key={platform.key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                aria-label={platform.label}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>

        <div className="mt-8 space-y-2 border-t border-surface-border pt-6">
          <p className="text-sm text-muted">{BRAND.legalLine}</p>
          <p className="text-sm text-muted">
            &copy; {year} {BRAND.legalEntity}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
