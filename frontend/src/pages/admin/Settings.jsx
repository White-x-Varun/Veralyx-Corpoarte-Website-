import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/context/ToastContext';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { getErrorMessage } from '@/utils/format';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Alert from '@/components/ui/Alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export default function Settings() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    async function load() {
      try {
        const { data } = await client.get(endpoints.adminSettings);
        reset(data.settings || data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [reset]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await client.put(endpoints.adminSettings, formData);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-white">Settings</h2>
      <p className="text-sm text-muted">Configure your website content and contact information.</p>

      {error && <Alert variant="error" className="mt-4">{error}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company</CardTitle>
            <CardDescription>Basic company information displayed across the site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Brand name" {...register('companyName')} />
            <Input label="Tagline" {...register('tagline')} />
            <Textarea label="Description" rows={3} {...register('description')} />
            <p className="text-xs text-muted">
              Veralyx is owned, operated, and marketed by Vibgyor Horizons Private Limited.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Hero title" {...register('heroTitle')} />
            <Textarea label="Hero subtitle" rows={2} {...register('heroSubtitle')} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>Use placeholder values until real contact details are available.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Email" type="email" {...register('email')} />
            <Input label="Phone" {...register('phone')} />
            <Input label="Address" {...register('address')} />
            <Input label="WhatsApp number" hint="International format without + or spaces. Leave empty to hide button." {...register('whatsappNumber')} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social links</CardTitle>
            <CardDescription>Shown as icons at the bottom of every public page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="LinkedIn" {...register('socialLinks.linkedin')} />
            <Input label="YouTube" {...register('socialLinks.youtube')} />
            <Input label="Instagram" {...register('socialLinks.instagram')} />
            <Input label="Facebook" {...register('socialLinks.facebook')} />
            <Input label="X / Twitter" {...register('socialLinks.twitter')} />
          </CardContent>
        </Card>

        <Button type="submit" loading={submitting}>Save settings</Button>
      </form>
    </div>
  );
}
