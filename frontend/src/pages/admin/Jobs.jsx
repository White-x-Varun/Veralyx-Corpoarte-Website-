import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { usePagination } from '@/hooks/usePagination';
import { useToast } from '@/context/ToastContext';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { getErrorMessage } from '@/utils/format';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import SearchInput from '@/components/ui/SearchInput';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { Card, CardContent } from '@/components/ui/Card';

export default function Jobs() {
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: jobs, loading, error, refetch } = useFetch(async () => {
    const { data } = await client.get(endpoints.adminJobs);
    return data.jobs || data || [];
  }, []);

  const { paginated, page, totalPages, setPage, search, setSearch } = usePagination(jobs || [], {
    pageSize: 10,
    searchKeys: ['title', 'location', 'department'],
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await client.delete(endpoints.adminJob(deleteTarget._id || deleteTarget.id));
      toast.success('Job deleted successfully');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Jobs</h2>
          <p className="text-sm text-muted">Manage open positions and job listings.</p>
        </div>
        <Link to="/admin/jobs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add job
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Search jobs…" />
      </div>

      {loading && <div className="mt-12 flex justify-center"><Spinner size="lg" /></div>}
      {error && <Alert variant="error" className="mt-6" title="Error">{error}</Alert>}

      {!loading && !error && jobs?.length === 0 && (
        <EmptyState className="mt-8" title="No jobs yet" actionLabel="Add job" onAction={() => window.location.href = '/admin/jobs/new'} />
      )}

      {!loading && paginated.length > 0 && (
        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-surface-border bg-surface/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted">Title</th>
                  <th className="px-4 py-3 font-medium text-muted">Location</th>
                  <th className="px-4 py-3 font-medium text-muted">Status</th>
                  <th className="px-4 py-3 font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {paginated.map((job) => (
                  <tr key={job._id || job.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white">{job.title}</td>
                    <td className="px-4 py-3 text-muted">{job.location || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={job.status === 'closed' ? 'default' : 'success'}>
                        {job.status || 'open'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link to={`/admin/jobs/${job._id || job.id}/edit`}>
                          <Button variant="ghost" size="sm" aria-label={`Edit ${job.title}`}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(job)} aria-label={`Delete ${job.title}`}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CardContent className="border-t border-surface-border py-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </CardContent>
        </Card>
      )}

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete job"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
          </>
        }
      />
    </div>
  );
}
