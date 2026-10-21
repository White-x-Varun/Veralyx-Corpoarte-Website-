<<<<<<< HEAD
import { test, expect } from '@playwright/test';

test('home page renders hero', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /marketing is an investment/i,
    }),
  ).toBeVisible();
});

test('admin login is reachable', async ({ page }) => {
  await page.goto('/admin/login');
  await expect(page.getByRole('heading', { name: /admin/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
});
=======
import { test, expect } from '@playwright/test';

test('home page renders hero', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /marketing is an investment/i,
    }),
  ).toBeVisible();
});

test('admin login is reachable', async ({ page }) => {
  await page.goto('/admin/login');
  await expect(page.getByRole('heading', { name: /admin/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
});
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
