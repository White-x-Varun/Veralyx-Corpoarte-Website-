import { Link } from 'react-router-dom';
import { Briefcase, FileText, FolderKanban, MessageSquare, Inbox } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import Spinner from '@/components/ui/Spinner';
import Alert from '@/components/ui/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const STAT_CARDS = [
  { key: 'jobs', label: 'Open Jobs', icon: Briefcase, link: '/admin/jobs', color: 'text-brand-light' },
  { key: 'applications', label: 'Applications', icon: Inbox, link: '/admin/applications', color: 'text-green-400' },
  { key: 'enquiries', label: 'Enquiries', icon: MessageSquare, link: '/admin/enquiries', color: 'text-amber-400' },
  { key: 'blogPosts', label: 'Blog Posts', icon: FileText, link: '/admin/blog', color: 'text-purple-400' },
  { key: 'projects', label: 'Projects', icon: FolderKanban, link: '/admin/projects', color: 'text-cyan-400' },
];

export default function Dashboard() {
  const { data, loading, error } = useFetch(async () => {
    const { data: res } = await client.get(endpoints.adminDashboard);
    return res;
  }, []);

  const stats = data?.stats || data || {};

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-white">Dashboard</h2>
      <p className="mt-1 text-sm text-muted">Overview of your website content and activity.</p>

      {loading && (
        <div className="mt-12 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <Alert variant="error" className="mt-8" title="Unable to load dashboard">
          {error}
        </Alert>
      )}

      {!loading && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STAT_CARDS.map(({ key, label, icon: Icon, link, color }) => (
            <Link key={key} to={link}>
              <Card className="transition-colors hover:border-brand/30">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted">{label}</CardTitle>
                  <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <p className="font-display text-3xl font-bold text-white">
                    {stats[key] ?? stats[key.replace(/s$/, '')] ?? '—'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {data?.recentEnquiries?.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-surface-border">
              {data.recentEnquiries.map((e) => (
                <li key={e._id || e.id} className="flex justify-between py-3 text-sm">
                  <span className="text-white">{e.name} — {e.subject}</span>
                  <span className="text-muted">{e.email}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
