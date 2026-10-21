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
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const projectSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  category: z.string().optional(),
  client: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().min(10),
  content: z.string().optional(),
  technologies: z.string().optional(),
  featured: z.boolean().optional(),
});

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { featured: false },
  });

  const title = watch('title');

  useEffect(() => {
    if (!isEdit && title) setValue('slug', slugify(title));
  }, [title, isEdit, setValue]);

  useEffect(() => {
    if (!isEdit) return;
    async function load() {
      try {
        const { data } = await client.get(endpoints.adminProject(id));
        const project = data.project || data;
        Object.entries(project).forEach(([k, v]) => {
          if (k === 'technologies' && Array.isArray(v)) {
            setValue(k, v.join(', '));
          } else if (v != null) {
            setValue(k, v);
          }
        });
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isEdit, setValue, toast]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    const payload = {
      ...formData,
      technologies: formData.technologies
        ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };

    try {
      if (isEdit) {
        await client.put(endpoints.adminProject(id), payload);
        toast.success('Project updated');
      } else {
        await client.post(endpoints.adminProjects, payload);
        toast.success('Project created');
      }
      navigate('/admin/projects');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div>
      <Link to="/admin/projects" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>
      <h2 className="font-display text-2xl font-bold text-white">{isEdit ? 'Edit project' : 'New project'}</h2>

      <Card className="mt-6">
        <CardHeader><CardTitle>Project details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Title" required {...register('title')} error={errors.title?.message} />
              <Input label="Slug" required {...register('slug')} error={errors.slug?.message} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Category" {...register('category')} />
              <Input label="Client" placeholder="Your company name" {...register('client')} />
            </div>
            <Input label="Summary" {...register('summary')} />
            <Textarea label="Description" required rows={4} {...register('description')} error={errors.description?.message} />
            <Textarea label="Full content (HTML allowed)" rows={8} {...register('content')} />
            <Input label="Technologies" hint="Comma-separated" {...register('technologies')} />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" {...register('featured')} className="rounded border-surface-border bg-surface text-brand focus:ring-brand" />
              Featured project
            </label>
            <div className="flex gap-3">
              <Button type="submit" loading={submitting}>{isEdit ? 'Update' : 'Create'}</Button>
              <Link to="/admin/projects"><Button variant="secondary" type="button">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
