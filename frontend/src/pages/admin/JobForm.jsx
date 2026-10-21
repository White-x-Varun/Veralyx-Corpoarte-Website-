import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { getErrorMessage, slugify } from '@/utils/format';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Alert from '@/components/ui/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  location: z.string().optional(),
  type: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(['open', 'closed', 'draft']),
  summary: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().optional(),
});

export default function JobForm() {
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: { status: 'open' },
  });

  const title = watch('title');

  useEffect(() => {
    if (!isEdit && title) {
      setValue('slug', slugify(title));
    }
  }, [title, isEdit, setValue]);

  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      try {
        const { data } = await client.get(endpoints.adminJob(id));
        const job = data.job || data;
        Object.entries(job).forEach(([key, val]) => {
          if (key === 'requirements' && Array.isArray(val)) {
            setValue(key, val.join('\n'));
          } else if (val != null) {
            setValue(key, val);
          }
        });
      } catch (err) {
        setFetchError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, isEdit, setValue]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    const payload = {
      ...formData,
      requirements: formData.requirements
        ? formData.requirements.split('\n').map((r) => r.trim()).filter(Boolean)
        : [],
    };

    try {
      if (isEdit) {
        await client.put(endpoints.adminJob(id), payload);
        toast.success('Job updated successfully');
      } else {
        await client.post(endpoints.adminJobs, payload);
        toast.success('Job created successfully');
      }
      navigate('/admin/jobs');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  return (
    <div>
      <Link to="/admin/jobs" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <h2 className="font-display text-2xl font-bold text-white">
        {isEdit ? 'Edit job' : 'Create job'}
      </h2>

      {fetchError && <Alert variant="error" className="mt-4">{fetchError}</Alert>}

      <Card className="mt-6">
        <CardHeader><CardTitle>Job details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Title" required {...register('title')} error={errors.title?.message} />
              <Input label="Slug" required {...register('slug')} error={errors.slug?.message} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Location" {...register('location')} error={errors.location?.message} />
              <Input label="Type" placeholder="Full-time" {...register('type')} error={errors.type?.message} />
              <Input label="Department" {...register('department')} error={errors.department?.message} />
            </div>
            <Select label="Status" {...register('status')}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </Select>
            <Input label="Summary" {...register('summary')} error={errors.summary?.message} />
            <Textarea label="Description" required rows={6} {...register('description')} error={errors.description?.message} />
            <Textarea
              label="Requirements"
              hint="One requirement per line"
              rows={4}
              {...register('requirements')}
              error={errors.requirements?.message}
            />
            <div className="flex gap-3">
              <Button type="submit" loading={submitting}>{isEdit ? 'Update' : 'Create'}</Button>
              <Link to="/admin/jobs"><Button variant="secondary" type="button">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
