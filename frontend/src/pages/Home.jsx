import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CircleDot,
  Handshake,
  Megaphone,
  MousePointerClick,
  Search,
  Target,
  TrendingUp,
} from 'lucide-react';
import Seo from '@/components/Seo';
import { useMotionProps } from '@/hooks/useMotionProps';
import { useFetch } from '@/hooks/useFetch';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { unwrapList } from '@/api/unwrap';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Alert from '@/components/ui/Alert';
import { formatDateShort, truncate } from '@/utils/format';
import ImpactStats from '@/components/brand/ImpactStats';
import CtaBand from '@/components/brand/CtaBand';
import { BRAND, EXPERTISE, INDUSTRIES, SERVICES } from '@/content/brand';

const SERVICE_ICONS = {
  target: Target,
  megaphone: Megaphone,
  chart: BarChart3,
  search: Search,
  cursor: MousePointerClick,
  handshake: Handshake,
  circle: CircleDot,
};

export default function Home() {
  const motionProps = useMotionProps();
  const headlineWords = BRAND.heroTitle.trim().split(/\s+/);
  const headlineSplit = Math.ceil(headlineWords.length / 2);
  const headlineLead = headlineWords.slice(0, headlineSplit).join(' ');
  const headlineAccent = headlineWords.slice(headlineSplit).join(' ');

  const { data: projects, loading: projectsLoading } = useFetch(async () => {
    const res = await client.get(endpoints.projects, { params: { limit: 3, featured: true } });
    const featured = unwrapList(res, ['projects']);
    if (featured.length) return featured;
    const all = await client.get(endpoints.projects, { params: { limit: 3 } });
    return unwrapList(all, ['projects']);
  }, []);

  const { data: testimonials, loading: testimonialsLoading } = useFetch(async () => {
    const res = await client.get(endpoints.testimonials, { params: { limit: 3 } });
    return unwrapList(res, ['testimonials']);
  }, []);

  const { data: posts } = useFetch(async () => {
    const res = await client.get(endpoints.blog, { params: { limit: 3 } });
    return unwrapList(res, ['posts']);
  }, []);

  return (
    <>
      <Seo description={BRAND.description} path="/" />

      <section className="home-hero home-hero--editorial relative overflow-hidden bg-hero-gradient">
        <div className="pointer-events-none absolute inset-0 horizon-glow" aria-hidden="true" />
        <div className="container-app relative">
          <div className="hero-topline">
            <span><b>{BRAND.name}</b><i /> Independent growth partner</span>
            <span className="hidden sm:inline-flex">Digital marketing <i /> Business consulting <i /> Life coaching</span>
          </div>

          <div className="home-hero-layout grid items-center gap-8 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:py-12">
            <motion.div {...motionProps} className="hero-art-column order-2 lg:order-1">
              <div className="hero-art-heading">
                <span>THE VERALYX GROWTH SYSTEM</span>
                <span>01 — 03</span>
              </div>
              <div className="growth-visual growth-visual--editorial" role="img" aria-label="An animated 3D growth model connecting strategy, demand and customer acquisition">
              <div className="growth-visual-grid" aria-hidden="true" />
              <div className="growth-orbit growth-orbit--one" aria-hidden="true"><span /></div>
              <div className="growth-orbit growth-orbit--two" aria-hidden="true"><span /></div>
              <div className="growth-visual-glow" aria-hidden="true" />

              <div className="growth-prism" aria-hidden="true">
                <div className="growth-prism-face growth-prism-face--front"><span>V</span></div>
                <div className="growth-prism-face growth-prism-face--back" />
                <div className="growth-prism-face growth-prism-face--right" />
                <div className="growth-prism-face growth-prism-face--left" />
                <div className="growth-prism-face growth-prism-face--top" />
                <div className="growth-prism-face growth-prism-face--bottom" />
              </div>

              <div className="growth-float-card growth-float-card--top">
                <span className="growth-card-icon"><CircleDot className="h-4 w-4" aria-hidden="true" /></span>
                <span><span className="growth-card-kicker">01 / Focus</span><strong>GTM strategy</strong></span>
              </div>
              <div className="growth-float-card growth-float-card--bottom">
                <span className="growth-card-icon"><BarChart3 className="h-4 w-4" aria-hidden="true" /></span>
                <span><span className="growth-card-kicker">02 / Build</span><strong>Qualified demand</strong></span>
                <TrendingUp className="ml-auto h-4 w-4 text-brand-light" aria-hidden="true" />
              </div>
              <span className="growth-orbit-label growth-orbit-label--left">Position</span>
              <span className="growth-orbit-label growth-orbit-label--right">Convert</span>
              <span className="growth-visual-caption">Strategy <i /> Demand <i /> Acquisition</span>
              </div>
              <div className="hero-art-note">
                <span className="hero-art-note-icon"><BarChart3 className="h-4 w-4" aria-hidden="true" /></span>
                <span>Focused marketing.<br /><strong>Measured by business impact.</strong></span>
              </div>
            </motion.div>

            <motion.div {...motionProps} className="hero-copy order-1 lg:order-2">
              <div className="hero-eyebrow"><span className="hero-eyebrow-dot" /> CONSULTING FOR BUSINESS · COACHING FOR INDIVIDUALS</div>
              <h1 className="hero-headline">
                <span>{headlineLead}</span>
                {headlineAccent && <span className="hero-headline-accent">{headlineAccent}</span>}
              </h1>
              <p className="hero-lede">{BRAND.heroSubtitle}</p>
              <p className="hero-description">
                Veralyx offers digital marketing consulting and business consulting to organizations, alongside life coaching for individuals.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-base font-semibold text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-light hover:text-[#25150e]"
                >
                  Start a conversation <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-6 text-base font-medium text-white transition hover:border-brand/50 hover:bg-white/[0.06]"
                >
                  Explore our services <ArrowUpRight className="h-4 w-4 text-brand-light" />
                </Link>
              </div>
              <div className="hero-trustline">
                <span>FOUNDER-LED</span><i />
                <span>STRATEGY-LED</span><i />
                <span>BUSINESS & PERSONAL GROWTH</span>
              </div>
            </motion.div>
          </div>

          <div className="hero-bottomline">
            <span>VERALYX <b>—</b> AUTHENTIC STRATEGIES, BRILLIANT OUTCOMES</span>
            <span><i className="hero-status-dot" /> Independent by design. Accountable to outcomes.</span>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface/20">
        <div className="container-app">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-light">What we do</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Consulting for businesses. Coaching for individuals.</h2>
              <p className="mt-3 max-w-xl text-muted">Three focused offers, shaped around the goals of each engagement.</p>
            </div>
            <Link to="/services" className="link-underline text-sm font-medium">Explore all services <span aria-hidden="true">→</span></Link>
          </div>
          <div className="service-list mt-10 grid gap-x-8 md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((service, index) => {
              const Icon = SERVICE_ICONS[service.icon] || Target;
              return (
                <Link key={service.slug} to={`/services/${service.slug}`}>
                  <Card className="service-card service-card--editorial group h-full transition-colors duration-300">
                    <CardContent className="flex h-full gap-4 px-2 py-6 sm:gap-6 sm:py-7">
                      <span className="service-index">0{index + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="service-icon"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                          <ArrowUpRight className="h-5 w-5 text-slate-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand-light" aria-hidden="true" />
                        </div>
                        <h3 className="mt-4 font-display text-xl font-semibold text-white transition-colors group-hover:text-brand-light">{service.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-surface/65 py-9">
        <div className="container-app">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Founder experience</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white">Experience built across real growth challenges</h2>
            </div>
            <p className="max-w-sm text-sm text-muted">These figures describe the founder’s experience and work, not Veralyx company-wide totals.</p>
          </div>
          <ImpactStats />
        </div>
      </section>

      <section id="expertise" className="section-padding">
        <div className="container-app">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-brand/10 via-surface-elevated/70 to-surface/50 p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-light">A connected approach</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white">From strategy to acquisition</h2>
              <p className="mt-4 leading-relaxed text-muted">Focused marketing systems connect positioning, demand, and conversion to the commercial goals of the business.</p>
              <div className="mt-7 flex items-center gap-3 border-t border-white/[0.08] pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand-light"><MousePointerClick className="h-5 w-5" aria-hidden="true" /></span>
                <p className="text-sm text-slate-300">Clear choices. Connected execution. Measurable progress.</p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.07] bg-surface-elevated/45 p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Expertise</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-white">Capabilities that connect</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {EXPERTISE.map((item) => <li key={item}><Badge variant="brand">{item}</Badge></li>)}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-surface-elevated/45 p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Founder experience</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-white">Work across 12+ industries</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">The founder’s experience spans sectors where customer understanding and clear positioning matter.</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {INDUSTRIES.map((item) => <li key={item}><Badge variant="default">{item}</Badge></li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface/25">
        <div className="container-app">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-light">Proof in practice</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white">Selected work</h2>
              <p className="mt-2 text-muted">Published case studies from {BRAND.name}.</p>
            </div>
            <Link to="/projects" className="link-underline text-sm font-medium">View all work <span aria-hidden="true">→</span></Link>
          </div>

          {projectsLoading ? (
            <div className="mt-12 flex justify-center"><Spinner size="lg" /></div>
          ) : projects?.length > 0 ? (
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {projects.slice(0, 3).map((project) => (
                <Link key={project._id || project.slug} to={`/projects/${project.slug}`}>
                  <Card className="group h-full transition hover:-translate-y-1 hover:border-brand/30">
                    <CardContent className="p-6">
                      {project.category && <Badge variant="brand" className="mb-4">{project.category}</Badge>}
                      <h3 className="font-display text-lg font-semibold text-white group-hover:text-brand-light">{project.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{truncate(project.summary || project.description, 100)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Alert variant="info" className="mt-9" title="Work coming soon">Case studies will appear here once they are published from the admin panel.</Alert>
          )}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-light">Client perspective</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white">What partners say</h2>
          </div>

          {testimonialsLoading ? (
            <div className="mt-12 flex justify-center"><Spinner size="lg" /></div>
          ) : testimonials?.length > 0 ? (
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <Card key={t._id || t.id} className="h-full border-white/[0.07] bg-surface-elevated/45">
                  <CardContent className="flex h-full flex-col p-6">
                    <p className="flex-1 text-sm leading-relaxed text-slate-300">&ldquo;{t.quote || t.feedback}&rdquo;</p>
                    <div className="mt-6 border-t border-white/[0.08] pt-4">
                      <p className="font-medium text-white">{t.author || t.clientName}</p>
                      <p className="mt-1 text-xs text-muted">{[t.role || t.designation, t.company].filter(Boolean).join(' · ') || 'Partner'}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert variant="info" className="mt-9" title="Testimonials will appear here">Client quotes are shown only after they are approved in the admin panel.</Alert>
          )}
        </div>
      </section>

      <section className="section-padding bg-surface/25">
        <div className="container-app">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-light">Ideas for growth</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white">Insights</h2>
            </div>
            <Link to="/blog" className="link-underline text-sm font-medium">View all <span aria-hidden="true">→</span></Link>
          </div>
          {posts?.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <Link key={post._id || post.slug} to={`/blog/${post.slug}`}>
                  <Card className="h-full transition hover:border-brand/30">
                    <CardContent className="p-6">
                      <p className="text-xs font-medium uppercase tracking-wider text-brand-light">{formatDateShort(post.publishedAt || post.createdAt)}</p>
                      <h3 className="mt-3 font-display text-lg font-semibold text-white">{post.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{truncate(post.excerpt, 100)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted">Published articles will appear here.</p>
          )}
        </div>
      </section>

      <CtaBand
        title={`Work with ${BRAND.name}`}
        body="Explore digital marketing consulting, business consulting, or life coaching with Veralyx."
        primaryTo="/contact"
        primaryLabel="Start a conversation"
        secondaryTo="/services"
        secondaryLabel="Explore services"
      />
    </>
  );
}
