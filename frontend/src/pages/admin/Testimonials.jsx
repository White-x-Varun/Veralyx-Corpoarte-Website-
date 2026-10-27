import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFetch } from '@/hooks/useFetch';
import { usePagination } from '@/hooks/usePagination';
import { useToast } from '@/context/ToastContext';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { getErrorMessage } from '@/utils/format';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import SearchInput from '@/components/ui/SearchInput';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const testimonialSchema = z.object({
  quote: z.string().min(10, 'Quote must be at least 10 characters'),
  author: z.string().min(2),
  role: z.string().optional(),
  company: z.string().optional(),
});

export default function Testimonials() {
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: testimonials, loading, error, refetch } = useFetch(async () => {
    const { data } = await client.get(endpoints.adminTestimonials);
    return data.testimonials || data || [];
  }, []);

  const { paginated, page, totalPages, setPage, search, setSearch } = usePagination(testimonials || [], {
    pageSize: 10,
    searchKeys: ['author', 'company', 'quote'],
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(testimonialSchema),
  });

  const openCreate = () => {
    reset({ quote: '', author: '', role: '', company: '' });
    setEditing({});
  };

  const openEdit = (item) => {
    reset({
      quote: item.quote || item.content,
      author: item.author || item.name,
      role: item.role || '',
      company: item.company || '',
    });
    setEditing(item);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing?._id || editing?.id) {
        await client.put(endpoints.adminTestimonial(editing._id || editing.id), formData);
        toast.success('Testimonial updated');
      } else {
        await client.post(endpoints.adminTestimonials, formData);
        toast.success('Testimonial created');
      }
      setEditing(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await client.delete(endpoints.adminTestimonial(deleteTarget._id || deleteTarget.id));
      toast.success('Testimonial deleted');
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
          <h2 className="font-display text-2xl font-bold text-white">Testimonials</h2>
          <p className="text-sm text-muted">Manage partner testimonials displayed on the homepage.</p>
        </div>
        <Button onClick={openCreate}>Add testimonial</Button>
      </div>

      <div className="mt-6"><SearchInput value={search} onChange={setSearch} placeholder="Search testimonials…" /></div>

      {loading && <div className="mt-12 flex justify-center"><Spinner size="lg" /></div>}
      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      {!loading && !error && testimonials?.length === 0 && (
        <EmptyState className="mt-8" title="No testimonials yet" actionLabel="Add testimonial" onAction={openCreate} />
      )}

      {!loading && paginated.length > 0 && (
        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-surface-border bg-surface/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted">Author</th>
                  <th className="px-4 py-3 font-medium text-muted">Company</th>
                  <th className="px-4 py-3 font-medium text-muted">Quote</th>
                  <th className="px-4 py-3 font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {paginated.map((t) => (
                  <tr key={t._id || t.id}>
                    <td className="px-4 py-3 text-white">{t.author || t.name}</td>
                    <td className="px-4 py-3 text-muted">{t.company || '—'}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-muted">{t.quote || t.content}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(t)}>Delete</Button>
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
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?._id || editing?.id ? 'Edit testimonial' : 'Add testimonial'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button loading={submitting} onClick={handleSubmit(onSubmit)}>Save</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Textarea label="Quote" required rows={4} {...register('quote')} error={errors.quote?.message} />
          <Input label="Author" required {...register('author')} error={errors.author?.message} />
          <Input label="Role" {...register('role')} />
          <Input label="Company" placeholder="Your company name" {...register('company')} />
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete testimonial"
        description="Are you sure?"
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
