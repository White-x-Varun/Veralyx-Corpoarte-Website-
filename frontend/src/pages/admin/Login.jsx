import { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import Seo from '@/components/Seo';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import BrandLogo from '@/components/brand/BrandLogo';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const { login, isAuthenticated, loading, getLoginError } = useAuth();
  const { companyName } = useSettings();
  const location = useLocation();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data) => {
    setError('');
    setSubmitting(true);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError(getLoginError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Admin Login" noIndex />

      <div className="admin-login-page relative flex min-h-screen items-center justify-center overflow-hidden bg-hero-gradient p-4 sm:p-8">
        <div className="admin-login-layout relative grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1fr_0.88fr] lg:gap-20">
          <div className="admin-login-intro hidden lg:block">
            <BrandLogo className="admin-login-logo" />
            <p className="admin-login-overline">Growth workspace / 01</p>
            <h1 className="mt-5 max-w-xl font-display text-5xl font-medium leading-[1.04] tracking-tight text-white xl:text-6xl">
              Strategy starts with a clear view.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-300">
              Sign in to manage the Veralyx website, opportunities, and insights.
            </p>
            <div className="admin-login-lines" aria-hidden="true"><i /><i /><i /></div>
          </div>

          <Card className="admin-login-card w-full max-w-md justify-self-center">
          <CardHeader className="text-left">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
              <Lock className="h-6 w-6 text-brand-light" aria-hidden="true" />
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Authorized access</p>
            <CardTitle className="text-2xl">{companyName} Admin</CardTitle>
            <CardDescription>Welcome back. Sign in to manage your website.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                required
                {...register('email')}
                error={errors.email?.message}
              />
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                required
                {...register('password')}
                error={errors.password?.message}
              />
              <Button type="submit" className="w-full" loading={submitting}>
                Sign in
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              <Link to="/" className="text-brand-light hover:text-white">
                Back to website
              </Link>
            </p>
          </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
