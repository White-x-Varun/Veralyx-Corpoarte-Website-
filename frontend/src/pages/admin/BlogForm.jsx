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

const blogSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  category: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

export default function BlogForm() {
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: { status: 'draft' },
  });

  const title = watch('title');

  useEffect(() => {
    if (!isEdit && title) setValue('slug', slugify(title));
  }, [title, isEdit, setValue]);

  useEffect(() => {
    if (!isEdit) return;
    async function load() {
      try {
        const { data } = await client.get(endpoints.adminBlogPost(id));
        const post = data.post || data;
        Object.entries(post).forEach(([k, v]) => v != null && setValue(k, v));
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
    try {
      if (isEdit) {
        await client.put(endpoints.adminBlogPost(id), formData);
        toast.success('Post updated');
      } else {
        await client.post(endpoints.adminBlog, formData);
        toast.success('Post created');
      }
      navigate('/admin/blog');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div>
      <Link to="/admin/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>
      <h2 className="font-display text-2xl font-bold text-white">{isEdit ? 'Edit post' : 'New post'}</h2>

      <Card className="mt-6">
        <CardHeader><CardTitle>Post details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Title" required {...register('title')} error={errors.title?.message} />
              <Input label="Slug" required {...register('slug')} error={errors.slug?.message} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Category" {...register('category')} />
              <Input label="Author" {...register('author')} />
            </div>
            <Select label="Status" {...register('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
            <Textarea label="Excerpt" rows={2} {...register('excerpt')} />
            <Textarea label="Content" required rows={12} {...register('content')} error={errors.content?.message} />
            <div className="flex gap-3">
              <Button type="submit" loading={submitting}>{isEdit ? 'Update' : 'Create'}</Button>
              <Link to="/admin/blog"><Button variant="secondary" type="button">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
