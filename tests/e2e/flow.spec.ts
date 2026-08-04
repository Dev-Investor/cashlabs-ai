import { test, expect } from '@playwright/test';

test('landing page has title and CTA', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/CashLabsAI/);

  // Check for the main CTA button
  const getStarted = page.getByRole('button', { name: /Comenzar Ahora/i });
  await expect(getStarted).toBeVisible();
});

test('navigation to auth form', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Comenzar Ahora/i }).first().click();
  
  // Should see the login form
  await expect(page.getByText(/Iniciar Sesión/i)).toBeVisible();
});
