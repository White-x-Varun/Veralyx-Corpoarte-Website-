import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Seo from '@/components/Seo';
import { useFetch } from '@/hooks/useFetch';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import Spinner from '@/components/ui/Spinner';
import { formatDateShort } from '@/utils/format';
import NotFound from './NotFound';
import PageHero from '@/components/brand/PageHero';

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, loading, error } = useFetch(
    async () => {
      const { data } = await client.get(endpoints.blogPost(slug));
      return data.post || data;
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

  if (error || !post) return <NotFound />;

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt || post.summary}
        path={`/blog/${slug}`}
        type="article"
      />

      <article>
        <PageHero
          eyebrow={post.category || 'Veralyx journal'}
          pretitle={<Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to blog</Link>}
          title={post.title}
          subtitle={formatDateShort(post.publishedAt || post.createdAt) + (post.author ? ` · ${post.author}` : '')}
        />

        <section className="section-padding">
          <div className="container-app max-w-3xl prose-content">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p>{post.excerpt || post.summary}</p>
            )}
          </div>
        </section>
      </article>
    </>
  );
}
