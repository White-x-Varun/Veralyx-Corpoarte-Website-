import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Bot, MessageCircle, Search, Send, X } from 'lucide-react';
import { BRAND, SERVICES } from '@/content/brand';

const SEARCH_ITEMS = [
  ...SERVICES.map((service) => ({
    title: service.title,
    description: `${service.description} ${service.content}`,
    to: `/services/${service.slug}`,
    keywords: service.features.join(' '),
  })),
  {
    title: 'About Veralyx',
    description: `${BRAND.description} Learn about the founder’s experience, approach, and areas of expertise.`,
    to: '/about',
    keywords: 'about founder experience industries approach team',
  },
  {
    title: 'Contact Veralyx',
    description: 'Get in touch about digital marketing, PR management, social media, business consulting, or life coaching.',
    to: '/contact',
    keywords: 'contact email enquiry consultation coaching phone whatsapp',
  },
  {
    title: 'Current openings',
    description: 'See roles currently listed by Veralyx.',
    to: '/careers',
    keywords: 'careers jobs work internship openings apply',
  },
  {
    title: 'Projects and work',
    description: 'Explore selected work and projects published by Veralyx.',
    to: '/projects',
    keywords: 'portfolio case studies client projects examples',
  },
  {
    title: 'Insights',
    description: 'Read articles and perspectives from Veralyx.',
    to: '/blog',
    keywords: 'blog articles insights ideas marketing business',
  },
];

const QUERY_ALIASES = [
  [/\b(ads?|advertising|seo|sem|marketing|promotion|prachar)\b/g, 'digital marketing'],
  [/\b(insta|instagram|linkedin|facebook|socials|social media)\b/g, 'social media'],
  [/\b(pr|public relations|press|media coverage)\b/g, 'pr management'],
  [/\b(business|startup|founder|company|vyapar|karobaar)\b/g, 'business consulting'],
  [/\b(coach|coaching|personal growth|life goals|zindagi|jeevan)\b/g, 'life coaching'],
  [/\b(job|jobs|career|careers|naukri|internship|opening)\b/g, 'careers'],
  [/\b(contact|email|phone|call|baat|connect|enquiry|enquire)\b/g, 'contact'],
  [/\b(work|project|projects|portfolio|kaam)\b/g, 'projects'],
  [/\b(blog|article|articles|insights|ideas)\b/g, 'insights'],
];
const STOP_WORDS = new Set(['a', 'an', 'and', 'are', 'can', 'do', 'does', 'for', 'how', 'i', 'in', 'is', 'it', 'ke', 'liye', 'me', 'mujhe', 'of', 'on', 'please', 'the', 'to', 'we', 'what', 'with', 'you', 'your', 'hai', 'ho', 'ka', 'kar', 'karo', 'chahiye', 'dikhao', 'batao']);

function normalizeQuery(query) {
  return QUERY_ALIASES.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), query.toLowerCase());
}

function searchSite(query) {
  const normalized = normalizeQuery(query).trim();
  const words = normalized.split(/[^a-z0-9]+/).filter((word) => word.length > 1 && !STOP_WORDS.has(word));
  if (!words.length) return [];

  return SEARCH_ITEMS.map((item) => {
    const title = item.title.toLowerCase();
    const content = `${item.description} ${item.keywords}`.toLowerCase();
    const score = words.reduce(
      (total, word) => total + (title.includes(word) ? 4 : 0) + (content.includes(word) ? 1 : 0),
      normalized && title.includes(normalized) ? 5 : 0,
    );
    return { ...item, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function isGreeting(query) {
  return /^(hi|hello|hey|namaste|namaskar|good morning|good afternoon|good evening)[!. ]*$/i.test(query.trim());
}

export default function SiteAssistant() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hi! I can help you find Veralyx services and pages. Try “ads”, “naukri”, “business consulting”, or “baat karni hai”.',
    },
  ]);

  function submit(event) {
    event.preventDefault();
    const text = query.trim();
    if (!text) return;

    const results = searchSite(text);
    const reply = isGreeting(text)
      ? 'Hello! Namaste! What would you like to find on the Veralyx website?'
      : results.length
        ? `I found a page that may help: ${results[0].description.split('. ')[0]}.`
        : 'I couldn’t find a matching page. Try “marketing”, “coaching”, “naukri”, “projects”, or “contact”.';

    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, role: 'user', text },
      { id: `${Date.now()}-assistant`, role: 'assistant', text: reply, results },
    ]);
    setQuery('');
  }

  return (
    <>
      {open && (
        <section
          className="fixed bottom-44 right-4 z-[60] flex max-h-[calc(100vh-13rem)] w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-2xl shadow-black/40 sm:right-6 sm:w-96"
          id="veralyx-assistant-panel"
          role="dialog"
          aria-label="Veralyx website assistant"
        >
          <header className="flex items-center justify-between border-b border-surface-border bg-surface-elevated px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/15 text-brand-light">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-white">Veralyx assistant</h2>
                <p className="text-xs text-muted">Find services and pages</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-white"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </header>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite" aria-relevant="additions">
            {messages.map((message) => (
              <div key={message.id} className={message.role === 'user' ? 'ml-8' : 'mr-3'}>
                <p className={`rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${message.role === 'user' ? 'bg-brand text-white' : 'bg-surface-elevated text-slate-200'}`}>
                  {message.text}
                </p>
                {message.results?.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {message.results.map((result) => (
                      <li key={result.to}>
                        <Link
                          to={result.to}
                          onClick={() => setOpen(false)}
                          className="group block rounded-xl border border-surface-border bg-white/[0.02] p-3 transition hover:border-brand/40 hover:bg-white/[0.04]"
                        >
                          <span className="flex items-center justify-between gap-2 text-sm font-medium text-white">
                            {result.title}
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-light" aria-hidden="true" />
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-muted">{result.description.split('. ')[0]}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="border-t border-surface-border bg-surface-elevated/70 p-3">
            <label className="sr-only" htmlFor="site-assistant-query">Ask a question or search Veralyx pages</label>
            <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 focus-within:border-brand/50">
              <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <input
                id="site-assistant-query"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask or search the website"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className="rounded-lg p-2 text-brand-light transition hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Search website"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5 px-1" aria-label="Suggested searches">
              {['Marketing', 'Coaching', 'Naukri', 'Contact'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="rounded-full border border-surface-border px-2.5 py-1 text-[11px] text-muted transition hover:border-brand/50 hover:text-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-24 right-6 z-[60] inline-flex h-14 items-center gap-2 rounded-full border border-brand/30 bg-surface-elevated px-4 text-sm font-medium text-white shadow-lg shadow-black/30 transition hover:border-brand-light/60 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
        aria-label={open ? 'Close Veralyx assistant' : 'Open Veralyx assistant'}
        aria-expanded={open}
        aria-controls={open ? 'veralyx-assistant-panel' : undefined}
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <MessageCircle className="h-5 w-5 text-brand-light" aria-hidden="true" />}
        <span>{open ? 'Close' : 'Ask Veralyx'}</span>
      </button>
    </>
  );
}
