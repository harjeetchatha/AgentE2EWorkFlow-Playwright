import { test, expect } from '@playwright/test';

test.describe('Checkout Information Entry Validation - AC2', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to application and login
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Add item to cart and navigate to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
  });

  test('should display error when no fields are filled', async ({ page }) => {
    // Verify we're on checkout information page
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    
    // Click Continue without filling any fields
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message displays
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required');
    
    // Verify form remains on same page
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('should display error when only First Name is filled', async ({ page }) => {
    // Fill only First Name
    await page.locator('[data-test="firstName"]').fill('John');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message displays
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Error: Last Name is required');
    
    // Verify First Name value is preserved
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('John');
  });

  test('should display error when First Name and Last Name are filled but Zip is empty', async ({ page }) => {
    // Fill First Name and Last Name
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message displays
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Error: Postal Code is required');
    
    // Verify First Name and Last Name values are preserved
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('John');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Doe');
  });

  test('should dismiss error message when X button is clicked', async ({ page }) => {
    // Click Continue without filling fields to generate error
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message is visible
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    
    // Click error dismiss button
    await page.locator('[data-test="error-button"]').click();
    
    // Verify error message is dismissed
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
    
    // Verify form remains accessible for correction
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
  });

  test('should accept valid data and proceed to overview', async ({ page }) => {
    // Fill all fields with valid data
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify successfully progresses to checkout overview
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(page.locator('[data-test="title"]')).toContainText('Checkout: Overview');
  });
});