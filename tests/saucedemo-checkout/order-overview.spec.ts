import { test, expect } from '@playwright/test';

test.describe('Order Overview Verification - AC3', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to application, login, add items, and reach overview page
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Add items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    
    // Navigate to cart and checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Fill checkout information
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
  });

  test('should display all order items with correct details', async ({ page }) => {
    // Verify checkout overview page loads successfully
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(page.locator('[data-test="title"]')).toContainText('Checkout: Overview');
    
    // Verify all ordered items are listed with QTY and Description
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Fleece Jacket' })).toBeVisible();
    
    // Verify individual prices are displayed
    const backpackItem = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Backpack' });
    await expect(backpackItem.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
    
    const bikeLightItem = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Bike Light' });
    await expect(bikeLightItem.locator('[data-test="inventory-item-price"]')).toHaveText('$9.99');
    
    const jacketItem = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Fleece Jacket' });
    await expect(jacketItem.locator('[data-test="inventory-item-price"]')).toHaveText('$49.99');
  });

  test('should display correct payment and shipping information', async ({ page }) => {
    // Verify payment information
    await expect(page.locator('[data-test="payment-info-value"]')).toContainText('SauceCard #31337');
    
    // Verify shipping information
    await expect(page.locator('[data-test="shipping-info-value"]')).toContainText('Free Pony Express Delivery');
  });

  test('should display accurate price calculations', async ({ page }) => {
    // Verify item total (29.99 + 9.99 + 49.99 = 89.97)
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText('Item total: $89.97');
    
    // Verify tax calculation (8% of 89.97 = 7.20)
    await expect(page.locator('[data-test="tax-label"]')).toContainText('Tax: $7.20');
    
    // Verify total amount (89.97 + 7.20 = 97.17)
    await expect(page.locator('[data-test="total-label"]')).toContainText('Total: $97.17');
  });

  test('should have functional Cancel button', async ({ page }) => {
    // Click Cancel button
    await page.locator('[data-test="cancel"]').click();
    
    // Verify navigates back to products page
    await expect(page).toHaveURL(/.*inventory\.html/);
    
    // Verify cart is preserved
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
  });

  test('should have functional Finish button', async ({ page }) => {
    // Click Finish button
    await page.locator('[data-test="finish"]').click();
    
    // Verify navigates to order confirmation page
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(page.locator('[data-test="title"]')).toContainText('Checkout: Complete!');
  });
});