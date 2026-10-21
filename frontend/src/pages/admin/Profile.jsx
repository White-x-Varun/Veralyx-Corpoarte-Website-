import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { getErrorMessage } from '@/utils/format';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function Profile() {
  const { user, checkAuth } = useAuth();
  const toast = useToast();
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data) => {
    setSubmittingProfile(true);
    try {
      await client.put(endpoints.adminProfile, data);
      toast.success('Profile updated');
      checkAuth();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmittingProfile(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setSubmittingPassword(true);
    try {
      await client.put(endpoints.adminProfile, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated');
      passwordForm.reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-white">Profile</h2>
      <p className="text-sm text-muted">Manage your admin account.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Account details</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <Input
                label="Name"
                {...profileForm.register('name')}
                error={profileForm.formState.errors.name?.message}
              />
              <Input
                label="Email"
                type="email"
                {...profileForm.register('email')}
                error={profileForm.formState.errors.email?.message}
              />
              <Button type="submit" loading={submittingProfile}>Save profile</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Change password</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <Input
                label="Current password"
                type="password"
                {...passwordForm.register('currentPassword')}
                error={passwordForm.formState.errors.currentPassword?.message}
              />
              <Input
                label="New password"
                type="password"
                {...passwordForm.register('newPassword')}
                error={passwordForm.formState.errors.newPassword?.message}
              />
              <Input
                label="Confirm password"
                type="password"
                {...passwordForm.register('confirmPassword')}
                error={passwordForm.formState.errors.confirmPassword?.message}
              />
              <Button type="submit" loading={submittingPassword}>Update password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
