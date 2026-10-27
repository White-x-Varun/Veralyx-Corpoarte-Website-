import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import Seo from '@/components/Seo';
import { useSettings } from '@/context/SettingsContext';
import { useToast } from '@/context/ToastContext';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { getErrorMessage } from '@/utils/format';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import PageHero from '@/components/brand/PageHero';
import { BRAND, isPlaceholderValue, resolveEmail } from '@/content/brand';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  inquiryType: z.string().optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please confirm we may use this information to respond.' }) }),
  website: z.string().optional(),
});

export default function Contact() {
  const { settings } = useSettings();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const email = resolveEmail(settings);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { inquiryType: 'general', website: '', consent: false },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await client.post(endpoints.contact, data);
      toast.success('Message sent successfully! We will get back to you soon.');
      setSubmitted(true);
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to send message.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Contact" description={`Get in touch with ${BRAND.name}.`} path="/contact" />

      <PageHero
        eyebrow={BRAND.name}
        title="Contact us"
        subtitle={`For digital marketing consulting, business consulting, or life coaching enquiries, email ${email} or connect on WhatsApp.`}
      />

      <section className="section-padding bg-surface/20">
        <div className="container-app grid gap-12 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-light">Talk to Veralyx</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white">Let&apos;s discuss your next step</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">Tell us whether you&apos;re exploring consulting or coaching, and we&apos;ll respond about an appropriate next step.</p>
            </div>
            <Card className="border-white/[0.07] bg-surface-elevated/45 transition hover:border-brand/30">
              <CardContent className="flex items-start gap-4 pt-6">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <h3 className="font-medium text-white">Email</h3>
                  <a href={`mailto:${email}`} className="text-sm text-muted hover:text-brand-light">
                    {email}
                  </a>
                  <p className="mt-2 text-xs text-muted">
                    Use this Veralyx email for all enquiries.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/[0.07] bg-surface-elevated/45 transition hover:border-brand/30">
              <CardContent className="flex items-start gap-4 pt-6">
                <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <h3 className="font-medium text-white">WhatsApp</h3>
                  <a
                    href={BRAND.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted hover:text-brand-light"
                  >
                    Connect with Veralyx
                  </a>
                </div>
              </CardContent>
            </Card>
            {!isPlaceholderValue(settings.phone) && (
              <Card className="border-white/[0.07] bg-surface-elevated/45 transition hover:border-brand/30">
                <CardContent className="flex items-start gap-4 pt-6">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium text-white">Phone</h3>
                    <a href={`tel:${settings.phone}`} className="text-sm text-muted hover:text-brand-light">
                      {settings.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
            {!isPlaceholderValue(settings.address) && (
              <Card className="border-white/[0.07] bg-surface-elevated/45 transition hover:border-brand/30">
                <CardContent className="flex items-start gap-4 pt-6">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium text-white">Address</h3>
                    <p className="text-sm text-muted">{settings.address}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card className="border-white/10 bg-surface-elevated/45 shadow-2xl shadow-black/10">
              <CardHeader className="px-6 py-5 sm:px-8">
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                {submitted && (
                  <Alert variant="success" title="Thank you!" className="mb-6">
                    Your message has been received. We will respond as soon as we can.
                  </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Full name"
                      required
                      {...register('name')}
                      error={errors.name?.message}
                    />
                    <Input
                      label="Email"
                      type="email"
                      required
                      {...register('email')}
                      error={errors.email?.message}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Company"
                      {...register('company')}
                      error={errors.company?.message}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      {...register('phone')}
                      error={errors.phone?.message}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Select label="Inquiry type" {...register('inquiryType')}>
                      <option value="general">General inquiry</option>
                      <option value="digital-marketing-consulting">Digital marketing consulting</option>
                      <option value="business-consulting">Business consulting</option>
                      <option value="life-coaching">Life coaching</option>
                      <option value="project">Project discussion</option>
                      <option value="careers">Careers or collaboration enquiry</option>
                      <option value="partnership">Partnership</option>
                    </Select>
                  </div>
                  <Input
                    label="Subject"
                    required
                    {...register('subject')}
                    error={errors.subject?.message}
                  />
                  <Textarea
                    label="Message"
                    required
                    rows={6}
                    {...register('message')}
                    error={errors.message?.message}
                  />
                  <div className="hidden" aria-hidden="true">
                    <Input label="Website" tabIndex={-1} autoComplete="off" {...register('website')} />
                  </div>
                  <label className="flex items-start gap-2 text-sm text-slate-300">
                    <input type="checkbox" className="mt-1" {...register('consent')} />
                    <span>I agree that {BRAND.name} may use this information to respond to my enquiry.</span>
                  </label>
                  {errors.consent?.message && (
                    <p className="text-xs text-red-400" role="alert">{errors.consent.message}</p>
                  )}
                  <Button type="submit" loading={submitting}>
                    Send message
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
