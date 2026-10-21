import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Handshake, Megaphone, MousePointerClick, Search, Target } from 'lucide-react';
import Seo from '@/components/Seo';
import { useMotionProps } from '@/hooks/useMotionProps';
import { Card, CardContent } from '@/components/ui/Card';
import PageHero from '@/components/brand/PageHero';
import CtaBand from '@/components/brand/CtaBand';
import { BRAND, SERVICES } from '@/content/brand';

const ICON_MAP = {
  target: Target,
  megaphone: Megaphone,
  chart: BarChart3,
  search: Search,
  cursor: MousePointerClick,
  handshake: Handshake,
};

export default function Services() {
  const motionProps = useMotionProps();

  return (
    <>
      <Seo
        title="Services"
        description={`${BRAND.name} builds focused Go-to-Market, demand generation, and customer acquisition systems.`}
        path="/services"
      />

      <PageHero
        eyebrow={BRAND.name}
        title="Build a growth system that moves the business forward"
        subtitle="Focused Go-to-Market, demand generation, and customer acquisition systems for founders and leadership teams."
      />

      <section className="section-padding bg-surface/20">
        <div className="container-app">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-light">Our capabilities</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white">A connected path from market to customer</h2>
            <p className="mt-3 leading-relaxed text-muted">Each engagement is shaped around your business goals, customer journey, and the commercial outcomes you need.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = ICON_MAP[service.icon] || Target;

              return (
                <motion.div key={service.slug} {...motionProps}>
                  <Link to={`/services/${service.slug}`}>
                    <Card className="service-card group h-full transition duration-300 hover:-translate-y-1 hover:border-brand/40">
                      <CardContent className="flex h-full flex-col p-6">
                        <div className="flex items-start justify-between">
                          <span className="inline-flex rounded-xl border border-brand/20 bg-brand/10 p-3">
                          <Icon className="h-6 w-6 text-brand-light" aria-hidden="true" />
                          </span>
                          <span className="font-display text-sm font-medium tracking-widest text-slate-600">{String(SERVICES.indexOf(service) + 1).padStart(2, '0')}</span>
                        </div>
                        <h2 className="font-display text-xl font-semibold text-white group-hover:text-brand-light">
                          {service.title}
                        </h2>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{service.description}</p>
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-light">
                          Explore service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand
        title="Turn marketing investment into commercial value"
        body="Connect with Veralyx to discuss qualified opportunities, efficient customer acquisition, and stronger commercial performance."
      />
    </>
  );
}
