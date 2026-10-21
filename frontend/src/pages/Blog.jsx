import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';
import { useSettings } from '@/context/SettingsContext';
import { useMotionProps } from '@/hooks/useMotionProps';
import { useFetch } from '@/hooks/useFetch';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import Alert from '@/components/ui/Alert';
import { formatDateShort, truncate } from '@/utils/format';
import PageHero from '@/components/brand/PageHero';

export default function Blog() {
  const { companyName } = useSettings();
  const motionProps = useMotionProps();

  const { data: posts, loading, error } = useFetch(async () => {
    const { data } = await client.get(endpoints.blog);
    return data.posts || data || [];
  }, []);

  return (
    <>
      <Seo title="Insights" description={`Insights and updates from ${companyName}.`} path="/blog" />

      <PageHero
        eyebrow="Veralyx journal"
        title="Insights"
        subtitle="Notes on growth, branding, leadership, and responsible innovation."
      />

      <section className="section-padding">
        <div className="container-app">
          {loading && (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <Alert variant="error" title="Unable to load posts">
              {error}
            </Alert>
          )}

          {!loading && !error && posts?.length === 0 && (
            <EmptyState title="No posts yet" description="Blog posts will appear here once published." />
          )}

          {!loading && posts?.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <motion.div key={post._id || post.slug} {...motionProps}>
                  <Link to={`/blog/${post.slug}`}>
                    <Card className="group h-full transition-colors hover:border-brand/30">
                      <CardContent className="pt-6">
                        {post.category && <Badge variant="brand" className="mb-3">{post.category}</Badge>}
                        <h2 className="font-display text-xl font-semibold text-white group-hover:text-brand-light">
                          {post.title}
                        </h2>
                        <p className="mt-2 text-xs text-muted">
                          {formatDateShort(post.publishedAt || post.createdAt)}
                          {post.author && ` · ${post.author}`}
                        </p>
                        <p className="mt-3 text-sm text-muted">{truncate(post.excerpt || post.summary, 120)}</p>
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
