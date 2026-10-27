import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'What does Veralyx offer?',
    answer: 'Veralyx offers digital marketing consulting and business consulting for organizations, alongside life coaching for individuals.',
  },
  {
    question: 'Can Veralyx help with both strategy and implementation?',
    answer: 'The website describes advisory and coaching services. Any project scope, including implementation support, is discussed and confirmed for each engagement.',
  },
  {
    question: 'What does life coaching cover?',
    answer: 'Life coaching offers a structured space to reflect, clarify personal goals, and plan next steps. It is non-clinical and is not therapy, mental-health treatment, or medical advice.',
  },
  {
    question: 'Who do the experience figures on this site describe?',
    answer: 'Those figures describe the founder’s prior experience and work. They are not Veralyx company-wide totals.',
  },
  {
    question: 'How do I enquire about working with Veralyx?',
    answer: 'Use the contact page to share whether you are interested in digital marketing consulting, business consulting, or life coaching. Veralyx can then discuss a suitable next step.',
  },
  {
    question: 'Where can I find current job openings?',
    answer: 'The careers page lists current openings. Applications are accepted for roles shown there; an enquiry by itself is not an offer of work.',
  },
];

export default function FaqSection() {
  return (
    <section className="section-padding bg-surface/20" aria-labelledby="faq-title">
      <div className="container-app grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-light">FAQs</p>
          <h2 id="faq-title" className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">A few useful answers</h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted">Learn what Veralyx offers, who the founder experience figures refer to, and how to get in touch.</p>
        </div>
        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {FAQS.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-white [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-brand-light transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-3 max-w-2xl pr-8 text-sm leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
