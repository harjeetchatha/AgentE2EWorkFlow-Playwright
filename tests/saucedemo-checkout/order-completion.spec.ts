import { test, expect } from '@playwright/test';

test.describe('Order Completion Confirmation - AC4', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to application and complete full checkout flow
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Add items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Navigate through checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
  });

  test('should display order confirmation page with success messaging', async ({ page }) => {
    // Verify order confirmation page loads
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(page.locator('[data-test="title"]')).toContainText('Checkout: Complete!');
    
    // Verify success message is displayed
    await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!');
    
    // Verify order dispatch message confirms delivery
    await expect(page.locator('[data-test="complete-text"]')).toContainText('dispatched');
    await expect(page.locator('[data-test="complete-text"]')).toContainText('pony');
    
    // Verify Pony Express image/icon is shown
    await expect(page.locator('[data-test="pony-express"]')).toBeVisible();
  });

  test('should clear cart after order completion', async ({ page }) => {
    // Verify cart badge is no longer visible (cart cleared)
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    
    // Navigate to cart to verify it's empty
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
  });

  test('should have functional Back Home button', async ({ page }) => {
    // Verify Back Home button is present
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    
    // Click Back Home button
    await page.locator('[data-test="back-to-products"]').click();
    
    // Verify returns to products page
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toContainText('Products');
    
    // Verify all products show Add to cart buttons (not Remove)
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toBeVisible();
    
    // Verify user can start new shopping session
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });
});