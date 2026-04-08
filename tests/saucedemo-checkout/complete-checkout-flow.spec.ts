import { test, expect } from '@playwright/test';

test.describe('Checkout Process E2E Tests', () => {
  test('Complete Checkout Flow - Happy Path', async ({ page }) => {
    // Step 1: Navigate to https://www.saucedemo.com (login page)
    // expect: Login page is displayed with username field, password field, and login button
    await page.goto('https://www.saucedemo.com');
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();

    // Step 2: Enter standard_user in the username field and secret_sauce in the password field, then click Login
    // expect: User is successfully logged in
    // expect: URL changes to /inventory.html
    // expect: Page title shows "Products"
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    // Step 3: Click "Add to cart" for Sauce Labs Backpack ($29.99), Sauce Labs Bike Light ($9.99), and Sauce Labs Fleece Jacket ($49.99)
    // expect: Cart badge shows "3"
    // expect: Each "Add to cart" button changes to a "Remove" button
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-fleece-jacket"]')).toBeVisible();

    // Step 4: Click the shopping cart icon/badge in the header
    // expect: URL changes to /cart.html
    // expect: Page title shows "Your Cart"
    // expect: All 3 items are listed (Backpack, Bike Light, Fleece Jacket)
    // expect: Each item shows name, description, quantity (1), and price
    // expect: "Continue Shopping" and "Checkout" buttons are visible
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    const backpackCartItem = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Backpack' });
    await expect(backpackCartItem.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await expect(backpackCartItem.locator('[data-test="inventory-item-desc"]')).toBeVisible();
    await expect(backpackCartItem.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
    await expect(backpackCartItem.locator('.cart_quantity')).toHaveText('1');
    const bikeLightCartItem = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Bike Light' });
    await expect(bikeLightCartItem.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Bike Light');
    await expect(bikeLightCartItem.locator('[data-test="inventory-item-desc"]')).toBeVisible();
    await expect(bikeLightCartItem.locator('[data-test="inventory-item-price"]')).toHaveText('$9.99');
    await expect(bikeLightCartItem.locator('.cart_quantity')).toHaveText('1');
    const fleeceCartItem = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Fleece Jacket' });
    await expect(fleeceCartItem.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Fleece Jacket');
    await expect(fleeceCartItem.locator('[data-test="inventory-item-desc"]')).toBeVisible();
    await expect(fleeceCartItem.locator('[data-test="inventory-item-price"]')).toHaveText('$49.99');
    await expect(fleeceCartItem.locator('.cart_quantity')).toHaveText('1');
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();

    // Step 5: Click the "Checkout" button
    // expect: URL changes to /checkout-step-one.html
    // expect: Page title shows "Checkout: Your Information"
    // expect: First Name, Last Name, and Zip/Postal Code fields are displayed
    // expect: "Cancel" and "Continue" buttons are present
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
    await expect(page.locator('[data-test="continue"]')).toBeVisible();

    // Step 6: Enter "John" in First Name, "Doe" in Last Name, "12345" in Zip/Postal Code
    // expect: All three fields accept the input without error
    // expect: No validation error messages are shown
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('John');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Doe');
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue('12345');
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();

    // Step 7: Click the "Continue" button
    // expect: URL changes to /checkout-step-two.html
    // expect: Page title shows "Checkout: Overview"
    // expect: All 3 ordered items are listed (Backpack, Bike Light, Fleece Jacket)
    // expect: Payment Information label shows "SauceCard #31337"
    // expect: Shipping Information label shows "Free Pony Express Delivery!"
    // expect: Item total shows "$89.97" (29.99 + 9.99 + 49.99)
    // expect: Tax shows "$7.20"
    // expect: Total shows "$97.17"
    // expect: "Cancel" and "Finish" buttons are present
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Fleece Jacket' })).toBeVisible();
    await expect(page.locator('[data-test="payment-info-value"]')).toContainText('SauceCard #31337');
    await expect(page.locator('[data-test="shipping-info-value"]')).toContainText('Free Pony Express Delivery!');
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText('Item total: $89.97');
    await expect(page.locator('[data-test="tax-label"]')).toContainText('Tax: $7.20');
    await expect(page.locator('[data-test="total-label"]')).toContainText('Total: $97.17');
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
    await expect(page.locator('[data-test="finish"]')).toBeVisible();

    // Step 8: Click the "Finish" button
    // expect: URL changes to /checkout-complete.html
    // expect: Page title shows "Checkout: Complete!"
    // expect: Header text shows "Thank you for your order!"
    // expect: Body text confirms the order has been dispatched via Pony Express
    // expect: Pony Express image/graphic is displayed
    // expect: "Back Home" button is visible
    // expect: Cart badge is no longer visible (cart has been cleared)
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="complete-text"]')).toContainText('dispatched');
    await expect(page.locator('[data-test="complete-text"]')).toContainText('pony');
    await expect(page.locator('[data-test="pony-express"]')).toBeVisible();
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();

    // Step 9: Click the "Back Home" button
    // expect: URL changes back to /inventory.html
    // expect: Products page is displayed
    // expect: Cart badge is absent (cart remains empty)
    // expect: All products show "Add to cart" buttons (not "Remove")
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).not.toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).not.toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-fleece-jacket"]')).not.toBeVisible();
  });
});
