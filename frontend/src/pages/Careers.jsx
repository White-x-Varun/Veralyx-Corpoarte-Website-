import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase, ArrowRight } from 'lucide-react';
import Seo from '@/components/Seo';
import { useMotionProps } from '@/hooks/useMotionProps';
import { useFetch } from '@/hooks/useFetch';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Alert from '@/components/ui/Alert';
import SearchInput from '@/components/ui/SearchInput';
import Select from '@/components/ui/Select';
import { unwrapList } from '@/api/unwrap';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageHero from '@/components/brand/PageHero';
import { BRAND, INTERNSHIP_PATH, INTERNSHIP_ROLES, applyMailto } from '@/content/brand';

export default function Careers() {
  const motionProps = useMotionProps();

  const [query, setQuery] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [workMode, setWorkMode] = useState('');

  const { data: jobs, loading, error } = useFetch(async () => {
    const res = await client.get(endpoints.jobs);
    return unwrapList(res, ['jobs']);
  }, []);

  const filtered = useMemo(() => {
    return (jobs || []).filter((job) => {
      const hay = `${job.title} ${job.location} ${(job.skills || []).join(' ')}`.toLowerCase();
      return (
        (!query || hay.includes(query.toLowerCase())) &&
        (!employmentType || job.employmentType === employmentType || job.type === employmentType) &&
        (!workMode || job.workMode === workMode)
      );
    });
  }, [jobs, query, employmentType, workMode]);

  return (
    <>
      <Seo
        title="Careers"
        description={`Internship and freelance options with ${BRAND.name}. Applying is not a job offer.`}
        path="/careers"
      />

      <PageHero
        eyebrow={`${BRAND.name} · Careers`}
        title="Internship and freelance"
        subtitle="Internship and freelance options may be available from time to time. Applying does not guarantee a role. Any offer will be confirmed in writing."
      >
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={applyMailto()}
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-brand px-6 text-base font-medium text-white hover:bg-brand-light"
          >
            Email an introduction
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#open-roles"
            className="inline-flex h-12 items-center rounded-lg border border-surface-border bg-surface-elevated px-6 text-base font-medium text-white hover:bg-white/5"
          >
            Posted positions
          </a>
        </div>
      </PageHero>

      <section className="section-padding">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-white">Areas you can apply for</h2>
            <p className="mt-4 text-muted">
              Mention the area in your email to {BRAND.email}.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INTERNSHIP_ROLES.map((role) => (
              <motion.div key={role.title} {...motionProps}>
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col pt-6">
                    <h3 className="font-display text-lg font-semibold text-white">{role.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted">{role.summary}</p>
                    <a
                      href={applyMailto(role.title)}
                      className="mt-4 text-sm font-medium text-brand-light hover:text-white"
                    >
                      Apply for {role.title}
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface/30">
        <div className="container-app">
          <h2 className="text-center font-display text-3xl font-bold text-white">Internship path</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {INTERNSHIP_PATH.map((item) => (
              <Card key={item.step} className="h-full bg-card-gradient">
                <CardContent className="pt-6">
                  <p className="font-display text-sm font-semibold text-brand-light">{item.step}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted">
            Send a short introduction to{' '}
            <a className="text-brand-light hover:text-white" href={`mailto:${BRAND.email}`}>
              {BRAND.email}
            </a>
            . Mention the area you are applying for. This is not a job advertisement and does not create a contract.
          </p>
        </div>
      </section>

      <section id="open-roles" className="section-padding">
        <div className="container-app max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-white">Posted positions</h2>
          <p className="mt-2 text-muted">Roles listed here are the only current openings, if any.</p>

          {loading && (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <Alert variant="error" title="Unable to load positions" className="mt-6">
              {error}
            </Alert>
          )}

          <div className="mb-8 mt-8 grid gap-4 md:grid-cols-3">
            <SearchInput value={query} onChange={setQuery} placeholder="Search roles…" />
            <Select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} aria-label="Job type">
              <option value="">All job types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </Select>
            <Select value={workMode} onChange={(e) => setWorkMode(e.target.value)} aria-label="Work mode">
              <option value="">All work modes</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </Select>
          </div>

          {!loading && !error && filtered?.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-sm text-muted">
                No positions are listed right now. You may still send an introduction for internship or freelance consideration.
              </CardContent>
            </Card>
          )}

          {!loading && filtered?.length > 0 && (
            <div className="space-y-4">
              {filtered.map((job) => (
                <Link key={job._id || job.slug} to={`/careers/${job.slug}`}>
                  <Card className="transition-colors hover:border-brand/30">
                    <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="font-display text-xl font-semibold text-white">{job.title}</h2>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" aria-hidden="true" /> {job.location}
                            </span>
                          )}
                          {(job.type || job.employmentType) && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" aria-hidden="true" /> {job.type || job.employmentType}
                            </span>
                          )}
                          {job.workMode && <span className="flex items-center gap-1">{job.workMode}</span>}
                          {job.department && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" aria-hidden="true" /> {job.department}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant="brand">{job.status || 'Open'}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
