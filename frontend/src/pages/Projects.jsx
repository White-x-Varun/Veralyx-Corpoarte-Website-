import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';
import { useMotionProps } from '@/hooks/useMotionProps';
import { useFetch } from '@/hooks/useFetch';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import Alert from '@/components/ui/Alert';
import { truncate } from '@/utils/format';
import { unwrapList } from '@/api/unwrap';
import SearchInput from '@/components/ui/SearchInput';
import { useState, useMemo } from 'react';
import PageHero from '@/components/brand/PageHero';

export default function Projects() {
  const motionProps = useMotionProps();
  const [query, setQuery] = useState('');
  const [tech, setTech] = useState('');

  const { data: projects, loading, error } = useFetch(async () => {
    const res = await client.get(endpoints.projects);
    return unwrapList(res, ['projects']);
  }, []);

  const technologies = useMemo(() => {
    const set = new Set();
    (projects || []).forEach((p) => (p.technologies || []).forEach((t) => set.add(t)));
    return [...set];
  }, [projects]);

  const filtered = useMemo(() => {
    return (projects || []).filter((p) => {
      const hay = `${p.title} ${p.description} ${(p.technologies || []).join(' ')}`.toLowerCase();
      const matchesQuery = !query || hay.includes(query.toLowerCase());
      const matchesTech = !tech || (p.technologies || []).includes(tech);
      return matchesQuery && matchesTech;
    });
  }, [projects, query, tech]);

  return (
    <>
      <Seo title="Work" description="Selected work and case studies from Veralyx." path="/projects" />

      <PageHero
        eyebrow="Selected work"
        title="Built for meaningful growth"
        subtitle="Engagements where Veralyx helped organizations grow, position, and transform."
      />

      <section className="section-padding">
        <div className="container-app">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <SearchInput value={query} onChange={setQuery} placeholder="Search projects…" />
            {technologies.length > 0 && (
              <select
                className="field-control h-11 rounded-lg border border-surface-border bg-surface px-3 text-sm text-white"
                value={tech}
                onChange={(e) => setTech(e.target.value)}
                aria-label="Filter by technology"
              >
                <option value="">All technologies</option>
                {technologies.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          </div>
          {loading && (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <Alert variant="error" title="Unable to load projects">
              {error}
            </Alert>
          )}

          {!loading && !error && filtered?.length === 0 && (
            <EmptyState
              title="No projects yet"
              description="Projects will appear here once published from the admin panel."
            />
          )}

          {!loading && filtered?.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <motion.div key={project._id || project.slug} {...motionProps}>
                  <Link to={`/projects/${project.slug}`}>
                    <Card className="group h-full transition-colors hover:border-brand/30">
                      <CardContent className="pt-6">
                        {project.category && <Badge variant="brand" className="mb-3">{project.category}</Badge>}
                        <h2 className="font-display text-xl font-semibold text-white group-hover:text-brand-light">
                          {project.title}
                        </h2>
                        <p className="mt-2 text-sm text-muted">{truncate(project.summary || project.description, 120)}</p>
                        {project.client && (
                          <p className="mt-4 text-xs text-slate-500">Client: {project.client}</p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
