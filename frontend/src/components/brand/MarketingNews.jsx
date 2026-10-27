import { ArrowUpRight } from 'lucide-react';

const NEWS = [
  {
    date: 'October 2026',
    dateTime: '2026-10',
    title: 'LinkedIn adds a practical course on boosting high-performing posts',
    summary: 'LinkedIn Marketing Academy’s October releases include a short course on choosing a goal, post, budget, and run time for paid amplification.',
    source: 'LinkedIn Marketing Academy',
    href: 'https://training.marketing.linkedin.com/page/new-releases',
  },
  {
    date: '13 October 2026',
    dateTime: '2026-10-13',
    title: 'Meta describes a more unified model for ad recommendations',
    summary: 'Meta’s engineering team says its latest Generative Ads Model learns across Facebook, Instagram, Reels, and multiple campaign objectives.',
    source: 'Engineering at Meta',
    href: 'https://engineering.fb.com/2026/10/13/ml-applications/generative-ads-model-gem-scaling-frontier-ads-ai/',
  },
  {
    date: '10 September 2026',
    dateTime: '2026-09-10',
    title: 'Google introduces a Data Strength Uplift metric in Ads',
    summary: 'Google announced measurement updates focused on first-party data signals, conversion measurement, and proving the contribution of marketing activity.',
    source: 'Google Ads & Commerce Blog',
    href: 'https://blog.google/products/ads-commerce/data-strength-updates/',
  },
];

export default function MarketingNews() {
  return (
    <section className="section-padding" aria-labelledby="marketing-news-title">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-light">Platform updates</p>
            <h2 id="marketing-news-title" className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Latest in marketing</h2>
            <p className="mt-3 max-w-2xl text-muted">Selected updates from official platform sources. Open the source for full details.</p>
          </div>
        </div>
        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {NEWS.map((item) => (
            <article key={item.href} className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-surface-elevated/40 p-6 transition hover:border-brand/30">
              <time dateTime={item.dateTime} className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-light">{item.date}</time>
              <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-white">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{item.summary}</p>
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-light hover:text-white">
                {item.source}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
