import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Seo from '@/components/Seo';
import NotFound from './NotFound';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { BRAND, SERVICES } from '@/content/brand';
import PageHero from '@/components/brand/PageHero';

const LEGACY_SLUGS = {
  'digital-marketing-strategy': 'go-to-market-strategy',
  'digital-marketing-consulting': 'go-to-market-strategy',
  'business-consulting': 'marketing-sales-alignment',
  'business-branding-consulting': 'cro-brand-positioning',
  'personal-branding-leadership': 'marketing-sales-alignment',
  'life-coaching': 'go-to-market-strategy',
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const resolved = LEGACY_SLUGS[slug] || slug;
  const service = SERVICES.find((s) => s.slug === resolved);

  if (!service) return <NotFound />;

  return (
    <>
      <Seo title={service.title} description={service.description} path={`/services/${slug}`} />

      <PageHero
        eyebrow={`${BRAND.name} · Service`}
        pretitle={<Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to services</Link>}
        title={service.title}
        subtitle={service.description}
      />

      <section className="section-padding">
        <div className="container-app max-w-3xl">
          <div className="prose-content">
            <p>{service.content}</p>
          </div>

          {service.features?.length > 0 && (
            <Card className="mt-8">
              <CardContent className="pt-6">
                <h2 className="font-display text-xl font-semibold text-white">How we help</h2>
                <ul className="mt-4 space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="mt-12 text-center">
            <Link to="/contact">
              <Button size="lg">Discuss this service</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
