import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePagination } from '@/hooks/usePagination';
import { useToast } from '@/context/ToastContext';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { formatDateShort, getErrorMessage } from '@/utils/format';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import SearchInput from '@/components/ui/SearchInput';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { Card, CardContent } from '@/components/ui/Card';

export default function Applications() {
  const toast = useToast();
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: applications, loading, error, refetch } = useFetch(async () => {
    const { data } = await client.get(endpoints.adminApplications);
    return data.applications || data || [];
  }, []);

  const { paginated, page, totalPages, setPage, search, setSearch } = usePagination(applications || [], {
    pageSize: 10,
    searchKeys: ['name', 'email', 'jobTitle'],
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await client.delete(endpoints.adminApplication(deleteTarget._id || deleteTarget.id));
      toast.success('Application deleted');
      setDeleteTarget(null);
      if (selected?._id === deleteTarget._id) setSelected(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-white">Applications</h2>
      <p className="text-sm text-muted">Review job applications and resumes.</p>

      <div className="mt-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Search applications…" />
      </div>

      {loading && <div className="mt-12 flex justify-center"><Spinner size="lg" /></div>}
      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      {!loading && !error && applications?.length === 0 && (
        <EmptyState className="mt-8" title="No applications yet" />
      )}

      {!loading && paginated.length > 0 && (
        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-surface-border bg-surface/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted">Name</th>
                  <th className="px-4 py-3 font-medium text-muted">Email</th>
                  <th className="px-4 py-3 font-medium text-muted">Position</th>
                  <th className="px-4 py-3 font-medium text-muted">Date</th>
                  <th className="px-4 py-3 font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {paginated.map((app) => (
                  <tr key={app._id || app.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-white">{app.name}</td>
                    <td className="px-4 py-3 text-muted">{app.email}</td>
                    <td className="px-4 py-3 text-muted">{app.jobTitle || app.job?.title || '—'}</td>
                    <td className="px-4 py-3 text-muted">{formatDateShort(app.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelected(app)}>View</Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(app)}>Delete</Button>
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
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Application details"
        size="lg"
      >
        {selected && (
          <dl className="space-y-3 text-sm">
            <div><dt className="text-muted">Name</dt><dd className="text-white">{selected.name}</dd></div>
            <div><dt className="text-muted">Email</dt><dd className="text-white">{selected.email}</dd></div>
            {selected.phone && <div><dt className="text-muted">Phone</dt><dd className="text-white">{selected.phone}</dd></div>}
            <div><dt className="text-muted">Cover letter</dt><dd className="mt-1 whitespace-pre-wrap text-slate-300">{selected.coverLetter}</dd></div>
            {selected.resumeUrl && (
              <div>
                <dt className="text-muted">Resume</dt>
                <dd><a href={selected.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-brand-light hover:underline">Download PDF</a></dd>
              </div>
            )}
          </dl>
        )}
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete application"
        description="Are you sure you want to delete this application?"
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
