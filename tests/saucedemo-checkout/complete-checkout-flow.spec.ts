import { test, expect } from '@playwright/test';

test.describe('Complete Checkout Flow - Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to application
    await page.goto('https://www.saucedemo.com');
  });

  test('should complete end-to-end checkout process successfully', async ({ page }) => {
    // Step 1: Login with standard_user credentials
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Verify successful login and products page display
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toContainText('Products');

    // Step 2: Add multiple products to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    
    // Verify cart badge shows correct item count
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
    
    // Verify buttons changed to Remove
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-fleece-jacket"]')).toBeVisible();

    // Step 3: Navigate to cart page
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify cart page displays all added items
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.locator('[data-test="title"]')).toContainText('Your Cart');
    
    // Verify each item shows name, description, price, quantity
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Fleece Jacket' })).toBeVisible();
    
    // Verify navigation buttons are visible
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();

    // Step 4: Click Checkout button
    await page.locator('[data-test="checkout"]').click();
    
    // Verify checkout information page loads
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(page.locator('[data-test="title"]')).toContainText('Checkout: Your Information');
    
    // Verify form fields are present
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
    await expect(page.locator('[data-test="continue"]')).toBeVisible();

    // Step 5: Fill in checkout information
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Verify no validation errors appear
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();

    // Step 6: Click Continue to proceed to overview
    await page.locator('[data-test="continue"]').click();
    
    // Verify checkout overview page loads
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(page.locator('[data-test="title"]')).toContainText('Checkout: Overview');
    
    // Verify all ordered items are displayed
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Fleece Jacket' })).toBeVisible();
    
    // Verify payment and shipping information
    await expect(page.locator('[data-test="payment-info-value"]')).toContainText('SauceCard #31337');
    await expect(page.locator('[data-test="shipping-info-value"]')).toContainText('Free Pony Express Delivery');
    
    // Verify price breakdown
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText('Item total: $89.97');
    await expect(page.locator('[data-test="tax-label"]')).toContainText('Tax: $7.20');
    await expect(page.locator('[data-test="total-label"]')).toContainText('Total: $97.17');

    // Step 7: Click Finish to complete order
    await page.locator('[data-test="finish"]').click();
    
    // Verify order confirmation page displays
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(page.locator('[data-test="title"]')).toContainText('Checkout: Complete!');
    
    // Verify success message and dispatch message
    await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!');
    await expect(page.locator('[data-test="complete-text"]')).toContainText('dispatched');
    
    // Verify Back Home button is present
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();

    // Step 8: Click Back Home button
    await page.locator('[data-test="back-to-products"]').click();
    
    // Verify returns to products page
    await expect(page).toHaveURL(/.*inventory\.html/);
    
    // Verify cart badge is cleared/removed
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    
    // Verify all products show Add to cart buttons
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')).toBeVisible();
  });
});