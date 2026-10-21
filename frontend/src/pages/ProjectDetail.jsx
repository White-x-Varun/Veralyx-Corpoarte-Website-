import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Seo from '@/components/Seo';
import { useFetch } from '@/hooks/useFetch';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import NotFound from './NotFound';
import PageHero from '@/components/brand/PageHero';

export default function ProjectDetail() {
  const { slug } = useParams();

  const { data: project, loading, error } = useFetch(
    async () => {
      const { data } = await client.get(endpoints.project(slug));
      return data.project || data;
    },
    [slug],
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !project) return <NotFound />;

  return (
    <>
      <Seo title={project.title} description={project.summary || project.description} path={`/projects/${slug}`} />

      <PageHero
        eyebrow={project.category || 'Selected work'}
        pretitle={<Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to projects</Link>}
        title={project.title}
        subtitle={project.client ? `Client: ${project.client}` : (project.summary || project.description)}
      />

      <section className="section-padding">
        <div className="container-app max-w-3xl">
          <div className="prose-content">
            {project.content ? (
              <div dangerouslySetInnerHTML={{ __html: project.content }} />
            ) : (
              <p>{project.description || project.summary}</p>
            )}
          </div>

          {project.technologies?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
