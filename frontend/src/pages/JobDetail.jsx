import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload } from 'lucide-react';
import Seo from '@/components/Seo';
import { useFetch } from '@/hooks/useFetch';
import { useToast } from '@/context/ToastContext';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { getErrorMessage } from '@/utils/format';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import NotFound from './NotFound';
import PageHero from '@/components/brand/PageHero';

const applySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  coverLetter: z.string().min(20, 'Cover letter must be at least 20 characters'),
});

export default function JobDetail() {
  const { slug } = useParams();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState('');

  const { data: job, loading, error } = useFetch(
    async () => {
      const { data } = await client.get(endpoints.job(slug));
      return data.job || data;
    },
    [slug],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(applySchema),
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setResumeError('');
    if (!file) {
      setResume(null);
      return;
    }
    if (file.type !== 'application/pdf') {
      setResumeError('Resume must be a PDF file');
      setResume(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('Resume must be under 5 MB');
      setResume(null);
      return;
    }
    setResume(file);
  };

  const onSubmit = async (formData) => {
    if (!resume) {
      setResumeError('Please upload your resume (PDF)');
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      if (formData.phone) payload.append('phone', formData.phone);
      payload.append('coverLetter', formData.coverLetter);
      payload.append('resume', resume);

      await client.post(endpoints.jobApply(slug), payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Application submitted successfully!');
      reset();
      setResume(null);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to submit application.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !job) return <NotFound />;

  return (
    <>
      <Seo title={job.title} description={job.summary || job.description} path={`/careers/${slug}`} />

      <PageHero
        eyebrow={`${job.status || 'Open'} role`}
        pretitle={<Link to="/careers" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to careers</Link>}
        title={job.title}
        subtitle={[job.location, job.type, job.department].filter(Boolean).join(' · ')}
      />

      <section className="section-padding">
        <div className="container-app grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="prose-content">
              {job.content ? (
                <div dangerouslySetInnerHTML={{ __html: job.content }} />
              ) : (
                <p>{job.description || job.summary}</p>
              )}
            </div>

            {job.requirements?.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold text-white">Requirements</h2>
                <ul className="mt-4 space-y-2">
                  {job.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Apply for this role</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <Input label="Full name" required {...register('name')} error={errors.name?.message} />
                  <Input label="Email" type="email" required {...register('email')} error={errors.email?.message} />
                  <Input label="Phone" type="tel" {...register('phone')} error={errors.phone?.message} />
                  <Textarea
                    label="Cover letter"
                    required
                    rows={5}
                    {...register('coverLetter')}
                    error={errors.coverLetter?.message}
                  />

                  <div className="space-y-1.5">
                    <label htmlFor="resume" className="block text-sm font-medium text-slate-200">
                      Resume (PDF) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="resume"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor="resume"
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-surface-border bg-surface px-4 py-6 text-sm text-muted hover:border-brand/50"
                      >
                        <Upload className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                        {resume ? resume.name : 'Choose PDF file (max 5 MB)'}
                      </label>
                    </div>
                    {resumeError && (
                      <p className="text-xs text-red-400" role="alert">{resumeError}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" loading={submitting}>
                    Submit application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
