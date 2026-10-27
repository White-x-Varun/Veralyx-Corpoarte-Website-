import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { getErrorMessage } from '@/utils/format';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      await client.post(endpoints.contact, {
        name: 'Newsletter subscriber',
        email,
        subject: 'Newsletter subscription request',
        enquiryType: 'newsletter',
        message: 'I consent to receive future Veralyx newsletter updates at this email address.',
        consent: true,
      });
      setMessage('Thanks — your newsletter request has been received.');
      setEmail('');
      setConsent(false);
    } catch (err) {
      setError(getErrorMessage(err, 'We could not record your request. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section-padding bg-surface/25" aria-labelledby="newsletter-title">
      <div className="container-app">
        <div className="newsletter-panel grid gap-8 rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/10 via-surface-elevated/65 to-surface/70 p-7 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-brand/25 bg-brand/10 text-brand-light"><Mail className="h-5 w-5" aria-hidden="true" /></span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-brand-light">Newsletter</p>
            <h2 id="newsletter-title" className="mt-3 font-display text-3xl font-bold text-white">Ideas and updates from Veralyx</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-muted">Sign up for occasional notes on marketing, business consulting, and personal development.</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <label htmlFor="newsletter-email" className="block text-sm font-medium text-slate-200">Email address</label>
            <div className="flex gap-2 rounded-xl border border-white/10 bg-surface/80 p-1.5 focus-within:border-brand/50">
              <input id="newsletter-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-muted" />
              <button type="submit" disabled={!consent || submitting} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-light hover:text-[#25150e] disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? 'Joining…' : 'Subscribe'}<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <label className="flex items-start gap-2 text-xs leading-relaxed text-muted">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 accent-brand" />
              <span>I’d like to receive future Veralyx updates at this email address. I can contact Veralyx to request removal.</span>
            </label>
            {message && <p className="text-sm text-emerald-300" role="status">{message}</p>}
            {error && <p className="text-sm text-red-300" role="alert">{error}</p>}
            <p className="text-xs text-muted">Your sign-up request is recorded for the Veralyx team to manage. See the <a href="/privacy-policy" className="underline decoration-brand/50 underline-offset-2 hover:text-white">Privacy Policy</a>.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
