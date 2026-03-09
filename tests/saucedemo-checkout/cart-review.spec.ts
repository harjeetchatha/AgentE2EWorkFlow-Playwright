import { test, expect } from '@playwright/test';

test.describe('Cart Review Functionality - AC1', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to application and login
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('should display all cart items with correct details', async ({ page }) => {
    // Add items with different prices to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    
    // Navigate to cart page
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify cart page is displayed
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.locator('[data-test="title"]')).toContainText('Your Cart');
    
    // Verify all items show correct name, description, price
    const backpackItem = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Backpack' });
    await expect(backpackItem.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await expect(backpackItem.locator('[data-test="inventory-item-desc"]')).toContainText('carry.allTheThings()');
    await expect(backpackItem.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
    
    const bikeLightItem = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Bike Light' });
    await expect(bikeLightItem.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Bike Light');
    await expect(bikeLightItem.locator('[data-test="inventory-item-price"]')).toHaveText('$9.99');
    
    const onesieItem = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Onesie' });
    await expect(onesieItem.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Onesie');
    await expect(onesieItem.locator('[data-test="inventory-item-price"]')).toHaveText('$7.99');
  });

  test('should have functional Continue Shopping button preserving cart', async ({ page }) => {
    // Add items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Click Continue Shopping
    await page.locator('[data-test="continue-shopping"]').click();
    
    // Verify returns to products page
    await expect(page).toHaveURL(/.*inventory\.html/);
    
    // Verify cart contents are preserved
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    
    // Verify product states reflect cart contents
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
  });

  test('should have functional Remove button updating cart count', async ({ page }) => {
    // Add items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify initial cart count
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
    
    // Remove one item
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    
    // Verify item is removed from cart
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Bike Light' })).not.toBeVisible();
    
    // Verify cart count updates
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    
    // Navigate back to products
    await page.locator('[data-test="continue-shopping"]').click();
    
    // Verify product button changed back to Add to cart
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toBeVisible();
  });

  test('should have functional Checkout button', async ({ page }) => {
    // Add items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Click Checkout button
    await page.locator('[data-test="checkout"]').click();
    
    // Verify navigates to checkout information page
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(page.locator('[data-test="title"]')).toContainText('Checkout: Your Information');
  });
});