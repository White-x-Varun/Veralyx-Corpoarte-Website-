import { Target, Users, Lightbulb, Award } from 'lucide-react';
import Seo from '@/components/Seo';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent } from '@/components/ui/Card';
import PageHero from '@/components/brand/PageHero';
import ImpactStats from '@/components/brand/ImpactStats';
import CtaBand from '@/components/brand/CtaBand';
import { BRAND, EXPERTISE, INDUSTRIES } from '@/content/brand';

const VALUES = [
  {
    icon: Target,
    title: 'Commercial outcomes',
    description: 'Build marketing around qualified opportunities, efficient acquisition, and stronger performance.',
  },
  {
    icon: Lightbulb,
    title: 'Focused strategy',
    description: 'Choose markets, positioning, channels, and measures that support business goals.',
  },
  {
    icon: Users,
    title: 'Marketing and sales in sync',
    description: 'Bring both teams together around shared priorities, clear handoffs, and a smoother path to customer acquisition.',
  },
  {
    icon: Award,
    title: 'Measurable investment',
    description: 'Treat marketing as an investment and track its contribution to commercial value.',
  },
];

export default function About() {
  const { settings } = useSettings();

  return (
    <>
      <Seo
        title="About"
        description={BRAND.description}
        path="/about"
      />

      <PageHero
        eyebrow={BRAND.name}
        title={`About ${BRAND.name}`}
        subtitle={BRAND.heroSubtitle}
      />

      <section className="section-padding">
        <div className="container-app">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-brand/10 to-surface-elevated/40 p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Our purpose</p>
              <h2 className="font-display text-3xl font-bold text-white">Mission</h2>
              <p className="mt-4 leading-relaxed text-muted">{BRAND.mission}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-surface-elevated/35 p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Where we&apos;re headed</p>
              <h2 className="font-display text-3xl font-bold text-white">Vision</h2>
              <p className="mt-4 leading-relaxed text-muted">{BRAND.vision}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface/20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-white">What we offer</h2>
            <p className="mt-4 text-muted">
              {BRAND.description}
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-app grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.07] bg-surface-elevated/35 p-7 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Digital marketing consulting</p>
            <h2 className="font-display text-3xl font-bold text-white">Marketing capabilities</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {EXPERTISE.map((item) => (
                <li key={item} className="rounded-full border border-surface-border bg-surface-elevated px-4 py-2 text-sm text-slate-200">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/[0.07] bg-surface-elevated/35 p-7 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Founder experience</p>
            <h2 className="font-display text-3xl font-bold text-white">Experience across 12+ industries</h2>
            <p className="mt-4 text-muted">The founder has worked across industries including:</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {INDUSTRIES.map((industry) => (
                <li key={industry} className="rounded-full border border-surface-border bg-surface-elevated px-4 py-2 text-sm text-slate-200">
                  {industry}
                </li>
              ))}
              <li className="rounded-full border border-surface-border bg-surface-elevated px-4 py-2 text-sm text-slate-200">More</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-white">Founder experience</h2>
            <p className="mt-4 text-muted">
              These figures describe the founder&apos;s experience and work, not Veralyx company-wide totals.
            </p>
          </div>
          <ImpactStats className="mt-12" />
        </div>
      </section>

      {settings.team?.length > 0 && (
        <section className="section-padding bg-surface/30">
          <div className="container-app">
            <h2 className="text-center font-display text-3xl font-bold text-white">Team</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {settings.team.map((member) => (
                <Card key={member.name}>
                  <CardContent className="pt-6">
                    <h3 className="font-display text-lg text-white">{member.name}</h3>
                    <p className="text-sm text-brand-light">{member.role}</p>
                    {member.bio && <p className="mt-2 text-sm text-muted">{member.bio}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {settings.milestones?.length > 0 && (
        <section className="section-padding bg-surface/30">
          <div className="container-app max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-white">Journey</h2>
            <ol className="mt-8 space-y-6">
              {settings.milestones.map((item) => (
                <li key={`${item.year}-${item.title}`} className="border-l border-brand/40 pl-4">
                  <p className="text-sm text-brand-light">{item.year}</p>
                  <h3 className="font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-muted">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container-app">
          <h2 className="text-center font-display text-3xl font-bold text-white">How we work</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="service-card h-full transition duration-300 hover:-translate-y-1 hover:border-brand/30">
                  <CardContent className="pt-6">
                    <span className="mb-5 inline-flex rounded-xl border border-brand/20 bg-brand/10 p-3 text-brand-light">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-white">{value.title}</h3>
                    <p className="mt-2 text-sm text-muted">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
