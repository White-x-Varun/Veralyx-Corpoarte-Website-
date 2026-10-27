import { Link } from 'react-router-dom';
import { ArrowRight, MoveUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { BRAND } from '@/content/brand';

export default function CtaBand({
  title = `Work with ${BRAND.name}`,
  body = 'Explore digital marketing consulting, business consulting, or life coaching with Veralyx.',
  primaryTo = '/contact',
  primaryLabel = 'Start a conversation',
  secondaryTo,
  secondaryHref,
  secondaryLabel,
}) {
  return (
    <section className="section-padding">
      <div className="container-app">
        <Card className="cta-panel relative overflow-hidden border-white/10 bg-gradient-to-br from-brand/20 via-brand/10 to-amber-300/[0.035]">
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl" aria-hidden="true" />
          <CardContent className="relative flex flex-col justify-between gap-8 p-7 sm:p-10 lg:flex-row lg:items-end lg:p-14">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-light">
              {BRAND.name}
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">{title}</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-slate-300">{body}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:pb-1">
              <Link
                to={primaryTo}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-base font-semibold text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-light hover:text-[#25150e]"
              >
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {(secondaryTo || secondaryHref) && (
                secondaryTo ? (
                  <Link
                    to={secondaryTo}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-6 text-base font-medium text-white transition hover:border-brand/40 hover:bg-white/[0.06]"
                  >
                    {secondaryLabel}
                    <MoveUpRight className="h-4 w-4 text-brand-light" />
                  </Link>
                ) : (
                  <a
                    href={secondaryHref}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-6 text-base font-medium text-white transition hover:border-brand/40 hover:bg-white/[0.06]"
                  >
                    {secondaryLabel}
                    <MoveUpRight className="h-4 w-4 text-brand-light" />
                  </a>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
