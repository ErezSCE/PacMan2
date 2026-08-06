import { test, expect } from '@playwright/test';

/**
 * Integration test to verify that the game works offline after the first load.
 * It loads the page, ensures the service worker is registered, then goes offline
 * and reloads the page. The start screen should still be visible.
 */

test('game works offline after first load', async ({ page }) => {
  // Navigate to the app (assumes dev server is running at localhost:5173).
  await page.goto('http://localhost:5173');

  // Wait for the service worker to be ready.
  const sw = await page.context().serviceWorker();
  expect(sw).not.toBeNull();

  // Ensure the start screen title is present.
  const title = page.locator('h1', { hasText: 'Pac‑Man' });
  await expect(title).toBeVisible();

  // Simulate offline mode.
  await page.context().setOffline(true);

  // Reload the page while offline.
  await page.reload();

  // The start screen should still be visible from cache.
  await expect(title).toBeVisible();
});
