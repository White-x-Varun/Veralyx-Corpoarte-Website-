import { ArrowUpRight, Linkedin } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { BRAND } from '@/content/brand';

const SOCIAL_LABELS = {
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'X',
};

const isValidEmbed = (url) => typeof url === 'string' && url.startsWith('https://www.linkedin.com/embed/feed/update/');

export default function LinkedInPostSection() {
  const { settings } = useSettings();
  const embedUrl = BRAND.companyLinkedInEmbedUrl;
  const socialLinks = Object.entries(settings.socialLinks || {})
    .filter(([key, url]) => SOCIAL_LABELS[key] && typeof url === 'string' && url.startsWith('https://'));

  return (
    <section className="section-padding" aria-labelledby="linkedin-post-title">
      <div className="container-app">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-light">From Veralyx</p>
          <h2 id="linkedin-post-title" className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Follow the conversation</h2>
          <p className="mt-3 text-muted">Company updates and perspectives from Veralyx.</p>
        </div>
        <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-elevated/45">
          {isValidEmbed(embedUrl) ? (
            <iframe title="Veralyx LinkedIn post" src={embedUrl} className="h-[520px] w-full border-0" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
          ) : (
            <div className="grid min-h-52 place-items-center p-8 text-center">
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand-light"><Linkedin className="h-5 w-5" aria-hidden="true" /></span>
                <p className="mt-4 font-medium text-white">The Veralyx LinkedIn post will appear here.</p>
                <p className="mt-2 text-sm text-muted">The company page and post are being prepared.</p>
              </div>
            </div>
          )}
        </div>
        {BRAND.companyLinkedInUrl && (
          <a href={BRAND.companyLinkedInUrl} target="_blank" rel="noopener noreferrer" className="mx-auto mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-light hover:text-white">
            Visit Veralyx on LinkedIn<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
        {socialLinks.length > 0 && (
          <nav className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-3" aria-label="Veralyx social media links">
            {socialLinks.map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-brand/40 hover:text-brand-light">
                {key === 'linkedin' && <Linkedin className="h-4 w-4" aria-hidden="true" />}
                {SOCIAL_LABELS[key]}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
