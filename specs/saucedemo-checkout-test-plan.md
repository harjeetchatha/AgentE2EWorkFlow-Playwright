# SCRUM-101 - E-commerce Checkout Process Test Plan

## Application Overview

Comprehensive test plan for the SauceDemo e-commerce checkout process covering all user flows from cart review through order completion. Tests include positive scenarios, validation handling, navigation flows, and edge cases across the complete customer purchase journey.

**Application URL**: https://www.saucedemo.com
**Credentials**: Username: `standard_user` / Password: `secret_sauce`
**User Story**: As a customer, I want to complete my purchase through a checkout process so that I can order products online.

---

## Application Interface (Discovered via Exploration)

### Pages and URLs
| Page | URL Pattern | Data-Test Selectors (Key) |
|---|---|---|
| Login | `/` | `username`, `password`, `login-button` |
| Products | `/inventory.html` | `title`, `shopping-cart-badge`, `shopping-cart-link`, `add-to-cart-*`, `remove-*` |
| Cart | `/cart.html` | `title`, `inventory-item`, `inventory-item-name`, `inventory-item-desc`, `inventory-item-price`, `continue-shopping`, `checkout`, `remove-*` |
| Checkout Step 1 | `/checkout-step-one.html` | `title`, `firstName`, `lastName`, `postalCode`, `cancel`, `continue`, `error`, `error-button` |
| Checkout Step 2 | `/checkout-step-two.html` | `title`, `inventory-item`, `payment-info-value`, `shipping-info-value`, `subtotal-label`, `tax-label`, `total-label`, `cancel`, `finish` |
| Checkout Complete | `/checkout-complete.html` | `title`, `complete-header`, `complete-text`, `pony-express`, `back-to-products` |

### Known Product Catalog
| Product | Price | Add-to-Cart Selector |
|---|---|---|
| Sauce Labs Backpack | $29.99 | `add-to-cart-sauce-labs-backpack` |
| Sauce Labs Bike Light | $9.99 | `add-to-cart-sauce-labs-bike-light` |
| Sauce Labs Bolt T-Shirt | $15.99 | `add-to-cart-sauce-labs-bolt-t-shirt` |
| Sauce Labs Fleece Jacket | $49.99 | `add-to-cart-sauce-labs-fleece-jacket` |
| Sauce Labs Onesie | $7.99 | `add-to-cart-sauce-labs-onesie` |
| Test.allTheThings() T-Shirt (Red) | $15.99 | `add-to-cart-test.allthethings()-t-shirt-(red)` |

### Static Checkout Values
- **Payment Information**: SauceCard #31337
- **Shipping Information**: Free Pony Express Delivery!
- **Tax Rate**: ~8% (8% of item total, rounded to 2 decimal places)

---

## Test Scenarios

### 1. Checkout Process E2E Tests

**Seed:** `tests/seed.spec.ts`

---

#### 1.1. Complete Checkout Flow - Happy Path

**File:** `tests/saucedemo-checkout/complete-checkout-flow.spec.ts`

**Assumption**: Fresh browser session, no prior login or cart state.

**Steps:**
1. Navigate to `https://www.saucedemo.com` (login page)
   - expect: Login page is displayed with username field, password field, and login button
2. Enter `standard_user` in the username field and `secret_sauce` in the password field, then click Login
   - expect: User is successfully logged in
   - expect: URL changes to `/inventory.html`
   - expect: Page title shows "Products"
3. Click "Add to cart" for Sauce Labs Backpack ($29.99), Sauce Labs Bike Light ($9.99), and Sauce Labs Fleece Jacket ($49.99)
   - expect: Cart badge shows "3"
   - expect: Each "Add to cart" button changes to a "Remove" button
   - expect: Cart icon in the header updates dynamically
4. Click the shopping cart icon/badge in the header
   - expect: URL changes to `/cart.html`
   - expect: Page title shows "Your Cart"
   - expect: All 3 items are listed (Backpack, Bike Light, Fleece Jacket)
   - expect: Each item shows name, description, quantity (1), and price
   - expect: "Continue Shopping" and "Checkout" buttons are visible
5. Click the "Checkout" button
   - expect: URL changes to `/checkout-step-one.html`
   - expect: Page title shows "Checkout: Your Information"
   - expect: First Name, Last Name, and Zip/Postal Code fields are displayed
   - expect: "Cancel" and "Continue" buttons are present
6. Enter "John" in First Name, "Doe" in Last Name, "12345" in Zip/Postal Code
   - expect: All three fields accept the input without error
   - expect: No validation error messages are shown
7. Click the "Continue" button
   - expect: URL changes to `/checkout-step-two.html`
   - expect: Page title shows "Checkout: Overview"
   - expect: All 3 ordered items are listed (Backpack, Bike Light, Fleece Jacket)
   - expect: Payment Information label shows "SauceCard #31337"
   - expect: Shipping Information label shows "Free Pony Express Delivery!"
   - expect: Item total shows "$89.97" (29.99 + 9.99 + 49.99)
   - expect: Tax shows "$7.20"
   - expect: Total shows "$97.17"
   - expect: "Cancel" and "Finish" buttons are present
8. Click the "Finish" button
   - expect: URL changes to `/checkout-complete.html`
   - expect: Page title shows "Checkout: Complete!"
   - expect: Header text shows "Thank you for your order!"
   - expect: Body text confirms the order has been dispatched via Pony Express
   - expect: Pony Express image/graphic is displayed
   - expect: "Back Home" button is visible
   - expect: Cart badge is no longer visible (cart has been cleared)
9. Click the "Back Home" button
   - expect: URL changes back to `/inventory.html`
   - expect: Products page is displayed
   - expect: Cart badge is absent (cart remains empty)
   - expect: All products show "Add to cart" buttons (not "Remove")

**Success Criteria**: All 9 steps pass, order is completed and cart is cleared.
**Failure Conditions**: Any step fails to navigate to the correct page, any expected text is missing, cart is not cleared after completion.

---

#### 1.2. Cart Review Functionality - AC1

**File:** `tests/saucedemo-checkout/cart-review.spec.ts`

**Assumption**: Fresh session; user logs in fresh for each test.

##### 1.2.1. Display All Cart Items with Correct Details

**Steps:**
1. Login as `standard_user`
   - expect: Products page is displayed
2. Add Sauce Labs Backpack, Sauce Labs Bike Light, and Sauce Labs Onesie to cart
   - expect: Cart badge shows "3"
3. Navigate to cart via the cart icon
   - expect: URL is `/cart.html`, title shows "Your Cart"
4. Inspect item details for each product in the cart
   - expect: "Sauce Labs Backpack" name displayed, description contains "carry.allTheThings()", price shows "$29.99", quantity is "1"
   - expect: "Sauce Labs Bike Light" name displayed, price shows "$9.99", quantity is "1"
   - expect: "Sauce Labs Onesie" name displayed, price shows "$7.99", quantity is "1"

**Success Criteria**: All item names, descriptions, prices, and quantities match the expected values.
**Failure Conditions**: Any field is blank, incorrect, or missing for any item.

##### 1.2.2. Continue Shopping Preserves Cart State

**Steps:**
1. Login, add Backpack and Bike Light to cart, navigate to cart
   - expect: Cart shows 2 items, badge shows "2"
2. Click "Continue Shopping"
   - expect: URL changes to `/inventory.html`
   - expect: Cart badge still shows "2"
   - expect: "Remove" buttons are shown for Backpack and Bike Light (not "Add to cart")

**Success Criteria**: Cart state is fully preserved after returning to products.
**Failure Conditions**: Cart badge resets, items are removed, or product button states are incorrect.

##### 1.2.3. Remove Item from Cart Updates Count and Product State

**Steps:**
1. Login, add Backpack, Bike Light, and Fleece Jacket to cart; navigate to cart
   - expect: Cart badge shows "3"
2. Click "Remove" for Sauce Labs Bike Light
   - expect: Bike Light item disappears from the cart list
   - expect: Cart badge updates to "2"
3. Click "Continue Shopping" and return to products page
   - expect: Backpack and Fleece Jacket still show "Remove" buttons
   - expect: Bike Light now shows "Add to cart" button

**Success Criteria**: Item is removed, count is decremented, product state is corrected.
**Failure Conditions**: Item remains visible, badge count is wrong, or product button state does not reset.

##### 1.2.4. Checkout Button Navigates to Checkout Information Page

**Steps:**
1. Login, add Backpack to cart, navigate to cart
2. Click the "Checkout" button
   - expect: URL changes to `/checkout-step-one.html`
   - expect: Page title shows "Checkout: Your Information"

**Success Criteria**: Correct page loads after clicking Checkout.
**Failure Conditions**: Navigation does not occur or incorrect page loads.

---

#### 1.3. Checkout Information Entry Validation - AC2

**File:** `tests/saucedemo-checkout/checkout-information-validation.spec.ts`

**Assumption**: Fresh session per test; beforeEach logs in, adds 1 item to cart, and navigates to the checkout information page (`/checkout-step-one.html`).

##### 1.3.1. Error When All Fields Are Empty

**Steps:**
1. Arrive on `/checkout-step-one.html` with an item in cart (via beforeEach)
2. Click "Continue" without entering any data
   - expect: Error message is visible: "Error: First Name is required"
   - expect: URL remains `/checkout-step-one.html`
   - expect: Red error indicator(s) appear on the empty fields

**Success Criteria**: Correct validation error is shown, navigation is blocked.
**Failure Conditions**: No error shown, wrong error text, or user is allowed to proceed.

##### 1.3.2. Error When Only First Name Is Filled

**Steps:**
1. Arrive on checkout information page
2. Enter "John" in First Name, leave Last Name and Postal Code empty
3. Click "Continue"
   - expect: Error message: "Error: Last Name is required"
   - expect: URL remains `/checkout-step-one.html`
   - expect: First Name field retains value "John"

**Success Criteria**: Correct field-specific error is displayed, previously entered data is not cleared.
**Failure Conditions**: Wrong error message, form clears input, or user progresses to next page.

##### 1.3.3. Error When First Name and Last Name Are Filled, Zip Is Empty

**Steps:**
1. Arrive on checkout information page
2. Enter "John" in First Name, "Doe" in Last Name, leave Postal Code empty
3. Click "Continue"
   - expect: Error message: "Error: Postal Code is required"
   - expect: URL remains `/checkout-step-one.html`
   - expect: First Name retains "John", Last Name retains "Doe"

**Success Criteria**: Correct third-field error fires; prior inputs are preserved.
**Failure Conditions**: Error fires out of sequence, data is lost, or navigation occurs.

##### 1.3.4. Error Message Can Be Dismissed

**Steps:**
1. Arrive on checkout information page
2. Click "Continue" without filling fields
   - expect: Error message is visible
3. Click the error close (X) button
   - expect: Error message disappears
   - expect: Form fields (First Name, Last Name, Postal Code) remain visible and editable

**Success Criteria**: Error is dismissed cleanly without side effects on the form.
**Failure Conditions**: Error persists, form fields become inaccessible, or page navigates.

##### 1.3.5. Valid Data Proceeds to Checkout Overview

**Steps:**
1. Arrive on checkout information page
2. Enter "John" in First Name, "Doe" in Last Name, "12345" in Postal Code
3. Click "Continue"
   - expect: URL changes to `/checkout-step-two.html`
   - expect: Page title shows "Checkout: Overview"

**Success Criteria**: Valid data accepted; overview page loads.
**Failure Conditions**: Error message shown for valid data, or navigation does not occur.

##### 1.3.6. Cancel Button Returns to Cart

**Steps:**
1. Arrive on checkout information page
2. Click the "Cancel" button
   - expect: URL changes to `/cart.html`
   - expect: Cart items are preserved (badge count unchanged)

**Success Criteria**: Cancel correctly navigates back to cart without data loss.
**Failure Conditions**: Navigates to a different page, or cart contents are cleared.

---

#### 1.4. Order Overview Verification - AC3

**File:** `tests/saucedemo-checkout/order-overview.spec.ts`

**Assumption**: Fresh session per test; beforeEach logs in, adds Backpack ($29.99), Bike Light ($9.99), and Fleece Jacket ($49.99) to cart, proceeds through cart and information entry (John Doe / 12345) to the overview page (`/checkout-step-two.html`).

##### 1.4.1. All Order Items Displayed with Correct Details

**Steps:**
1. Arrive on `/checkout-step-two.html` (via beforeEach)
   - expect: Page title shows "Checkout: Overview"
2. Inspect item list
   - expect: Sauce Labs Backpack is listed with price "$29.99"
   - expect: Sauce Labs Bike Light is listed with price "$9.99"
   - expect: Sauce Labs Fleece Jacket is listed with price "$49.99"
   - expect: Each item shows a quantity (QTY) value

**Success Criteria**: All 3 items visible with accurate names and prices.
**Failure Conditions**: Item missing, wrong price displayed, or quantity absent.

##### 1.4.2. Correct Payment and Shipping Information Displayed

**Steps:**
1. Arrive on overview page
   - expect: Payment information field shows "SauceCard #31337"
   - expect: Shipping information field shows "Free Pony Express Delivery!"

**Success Criteria**: Both static info labels show exact expected values.
**Failure Conditions**: Either field is blank, shows wrong value, or is missing.

##### 1.4.3. Accurate Price Calculations

**Steps:**
1. Arrive on overview page with 3 items totaling $89.97
   - expect: Item total label shows "Item total: $89.97"
   - expect: Tax label shows "Tax: $7.20"
   - expect: Total label shows "Total: $97.17"

**Success Criteria**: All three price values are mathematically correct and correctly formatted ($ symbol, 2 decimal places).
**Failure Conditions**: Any value is wrong, formatting is missing, or labels are absent.

##### 1.4.4. Cancel Button from Overview Returns to Products Page with Cart Preserved

**Steps:**
1. Arrive on overview page with 3 items in cart
2. Click "Cancel"
   - expect: URL changes to `/inventory.html`
   - expect: Cart badge still shows "3" (cart contents preserved)

**Success Criteria**: Cancel from overview returns to products page without clearing cart.
**Failure Conditions**: Cart is cleared, navigates to wrong page, or badge is absent.

##### 1.4.5. Finish Button Navigates to Confirmation Page

**Steps:**
1. Arrive on overview page
2. Click "Finish"
   - expect: URL changes to `/checkout-complete.html`
   - expect: Page title shows "Checkout: Complete!"

**Success Criteria**: Finish button correctly completes the order and loads the confirmation page.
**Failure Conditions**: Navigation does not occur or wrong page loads.

---

#### 1.5. Order Completion Confirmation - AC4

**File:** `tests/saucedemo-checkout/order-completion.spec.ts`

**Assumption**: Fresh session per test; beforeEach logs in, adds Backpack and Bike Light to cart, completes the entire checkout flow through clicking "Finish", landing on `/checkout-complete.html`.

##### 1.5.1. Order Confirmation Page Success Messaging

**Steps:**
1. Arrive on `/checkout-complete.html` (via beforeEach)
   - expect: URL is `/checkout-complete.html`
   - expect: Page title shows "Checkout: Complete!"
   - expect: Large header text shows "Thank you for your order!"
   - expect: Body text confirms order has been dispatched (contains "dispatched" and "pony")
   - expect: Pony Express image/graphic element is visible

**Success Criteria**: All success messaging elements are present and correct.
**Failure Conditions**: Any text is missing, image is absent, or page title is wrong.

##### 1.5.2. Cart Is Cleared After Order Completion

**Steps:**
1. Arrive on order confirmation page
   - expect: Cart badge is not visible in the header
2. Click the shopping cart icon to navigate to cart page
   - expect: URL changes to `/cart.html`
   - expect: No inventory items are present in the cart (count is 0)

**Success Criteria**: Cart is fully cleared; no items remain.
**Failure Conditions**: Cart badge still shows a count, or previously ordered items still appear in the cart.

##### 1.5.3. Back Home Button Returns to Products and Enables New Shopping

**Steps:**
1. Arrive on order confirmation page
   - expect: "Back Home" button is visible
2. Click "Back Home"
   - expect: URL changes to `/inventory.html`
   - expect: Page title shows "Products"
   - expect: All products show "Add to cart" buttons (not "Remove")
   - expect: Cart badge is absent
3. Click "Add to cart" for Backpack to verify a new session can start
   - expect: Cart badge appears showing "1"

**Success Criteria**: Navigation back to products is clean; a new shopping session can begin immediately.
**Failure Conditions**: Button is missing, wrong page loads, products still show "Remove", or new items cannot be added to cart.

---

#### 1.6. Error Handling and Edge Cases - AC5

**File:** `tests/saucedemo-checkout/error-handling-edge-cases.spec.ts`

**Assumption**: Fresh session per test; each test logs in, adds at least one item to cart, and navigates to the checkout information page.

##### 1.6.1. Special Characters Accepted in Form Fields

**Steps:**
1. Arrive on checkout information page
2. Enter "@#$%" in First Name, "Test!" in Last Name, "!@#45" in Postal Code
3. Click "Continue"
   - expect: No character-level validation error fires
   - expect: URL changes to `/checkout-step-two.html` (form accepts special characters)

**Success Criteria**: Application does not block submission of special characters — it only validates that fields are non-empty.
**Failure Conditions**: An unexpected validation error blocks submission of special characters.

##### 1.6.2. Very Long Text Input in Form Fields

**Steps:**
1. Arrive on checkout information page
2. Enter a 200-character string in First Name, Last Name, and Postal Code fields
3. Click "Continue"
   - expect: No system error or crash occurs
   - expect: Application either accepts the long input or handles it gracefully (truncation is acceptable)
   - expect: User can continue to the overview page

**Success Criteria**: Application handles long input without crashing or throwing uncaught errors.
**Failure Conditions**: Application throws a JavaScript error, crashes, freezes, or shows an unhandled exception.

##### 1.6.3. Error Message Validation Is Sequential (Field-by-Field)

**Steps:**
1. Arrive on checkout information page
2. Leave all fields empty, click "Continue"
   - expect: Error message is "Error: First Name is required"
3. Dismiss error, enter First Name only, click "Continue"
   - expect: Error message is "Error: Last Name is required"
4. Dismiss error, also enter Last Name, click "Continue"
   - expect: Error message is "Error: Postal Code is required"
5. Enter Postal Code, click "Continue"
   - expect: Navigates to overview page (no errors)

**Success Criteria**: Validation fires in First Name > Last Name > Postal Code order, one error at a time.
**Failure Conditions**: Multiple errors shown simultaneously, wrong field sequence, or all-fields-valid does not progress.

##### 1.6.4. Rapid/Double-Click on Continue and Finish Buttons

**Steps:**
1. Arrive on checkout information page with valid data pre-entered ("Jane", "Smith", "99999")
2. Double-click the "Continue" button rapidly
   - expect: Navigation occurs once to `/checkout-step-two.html`
   - expect: No duplicate page loads or JavaScript errors
3. On overview page, double-click the "Finish" button rapidly
   - expect: Navigation occurs once to `/checkout-complete.html`
   - expect: No duplicate order submission errors

**Success Criteria**: Rapid clicking does not cause duplicate processing or visual glitches.
**Failure Conditions**: Application navigates twice, shows errors, or throws an exception.

##### 1.6.5. Browser Back Button Behavior During Checkout

**Steps:**
1. Login, add 2 items to cart, navigate to cart, click Checkout, fill information form, click Continue to reach overview
2. Press browser Back button from the overview page
   - expect: Navigates back to checkout information page (or cart — behavior should be predictable)
   - expect: Cart contents are preserved
3. Press browser Back button from the information page
   - expect: Navigates back to the cart page
   - expect: Cart badge and items are still present

**Success Criteria**: Browser back navigation is predictable and cart state is maintained throughout.
**Failure Conditions**: Cart is cleared, user is logged out, or application navigates to an unexpected URL.

---

#### 1.7. Navigation Flow Testing

**File:** `tests/saucedemo-checkout/navigation-flows.spec.ts`

**Assumption**: Fresh session per test; user logs in and sets up cart state before each test.

##### 1.7.1. Cancel from Checkout Information Returns to Cart

**Steps:**
1. Login, add Backpack to cart, navigate to cart, click Checkout
   - expect: On `/checkout-step-one.html`
2. Click "Cancel"
   - expect: URL changes to `/cart.html`
   - expect: Cart badge shows "1", Backpack is still in the cart

**Success Criteria**: Cancel at step 1 returns to cart with full cart preserved.

##### 1.7.2. Cancel from Checkout Overview Returns to Products with Cart Preserved

**Steps:**
1. Login, add Backpack and Bike Light to cart, proceed through cart and information page to overview
   - expect: On `/checkout-step-two.html`, cart badge shows "2"
2. Click "Cancel"
   - expect: URL changes to `/inventory.html`
   - expect: Cart badge still shows "2"
   - expect: Cart contents are intact (navigating to cart shows both items)

**Success Criteria**: Cancel at step 2 returns to products page without clearing cart.

##### 1.7.3. Continue Shopping at Various Cart States

**Steps:**
1. Login and navigate to cart with an empty cart (no items added)
   - expect: Cart page shows no items, "Continue Shopping" button is visible
2. Click "Continue Shopping"
   - expect: Returns to `/inventory.html`
3. Add 3 items to cart and navigate back to cart
   - expect: Cart shows 3 items
4. Click "Continue Shopping" again
   - expect: Returns to `/inventory.html`, cart badge shows "3"

**Success Criteria**: Continue Shopping always returns to products; cart state is preserved regardless of item count.

##### 1.7.4. Full Navigation Loop Without Completing Purchase

**Steps:**
1. Login, add Backpack and Bike Light to cart
2. Navigate to cart -> click Checkout -> fill form -> click Continue -> reach overview
3. Click Cancel from overview (returns to products)
4. Navigate to cart again via cart icon
   - expect: Both items are still in the cart (badge shows "2")
5. Click Checkout again -> fill the form again -> Continue -> Finish the order
   - expect: Order completes successfully on `/checkout-complete.html`

**Success Criteria**: A full abandon-and-restart loop works without data corruption; the second checkout completes successfully.

##### 1.7.5. Cart Integrity Across All Checkout Pages

**Steps:**
1. Login and add all 6 products to cart (Backpack, Bike Light, Bolt T-Shirt, Fleece Jacket, Onesie, Red T-Shirt)
   - expect: Cart badge shows "6"
2. Navigate through cart, checkout information (valid data), and overview pages
   - expect: Cart badge shows "6" on all pages
   - expect: All 6 items appear in the overview item list
3. Navigate back to products via Cancel from overview
   - expect: Cart badge still shows "6"

**Success Criteria**: All 6 items persist throughout the entire checkout navigation journey.

---

#### 1.8. Price Calculation and Tax Verification

**File:** `tests/saucedemo-checkout/price-calculations.spec.ts`

**Assumption**: Fresh session per test; user logs in and adds specified products before navigating to the overview page.

##### 1.8.1. Single Item Price Calculation

**Steps:**
1. Login, add only Sauce Labs Onesie ($7.99) to cart
2. Complete checkout through to the overview page (any valid info form data)
   - expect: Item total shows "$7.99"
   - expect: Tax shows "$0.64" (8% of $7.99 = $0.6392, rounded to $0.64)
   - expect: Total shows "$8.63"

**Success Criteria**: Single-item tax and total calculated correctly.

##### 1.8.2. Multiple Items with Different Prices

**Steps:**
1. Login, add Backpack ($29.99), Bike Light ($9.99), Fleece Jacket ($49.99) to cart
2. Complete checkout through to overview
   - expect: Item total shows "$89.97" (29.99 + 9.99 + 49.99)
   - expect: Tax shows "$7.20"
   - expect: Total shows "$97.17"

**Success Criteria**: Multi-item sum, tax, and total are all mathematically correct.

##### 1.8.3. All 6 Products in Cart

**Steps:**
1. Login, add all 6 products (Backpack $29.99, Bike Light $9.99, Bolt T-Shirt $15.99, Fleece Jacket $49.99, Onesie $7.99, Red T-Shirt $15.99) to cart
2. Complete checkout through to overview
   - expect: Item total shows "$129.94" (29.99 + 9.99 + 15.99 + 49.99 + 7.99 + 15.99)
   - expect: Tax shows "$10.40"
   - expect: Total shows "$140.34"
   - expect: All 6 items are listed individually

**Success Criteria**: Maximum cart scenario calculates correctly without rounding errors.

##### 1.8.4. Monetary Formatting Consistency

**Steps:**
1. Login, add Backpack and Bike Light to cart, proceed to checkout overview
2. Inspect all price fields on the overview page
   - expect: All prices start with "$" symbol
   - expect: All prices show exactly 2 decimal places
   - expect: Item subtotal, tax, and total all follow this format
3. Note the individual item prices on the overview
   - expect: Individual prices also show "$" and 2 decimal places

**Success Criteria**: All monetary values across the overview page are consistently formatted.
**Failure Conditions**: Any price missing "$" symbol, showing more or fewer than 2 decimal places, or showing raw unformatted numbers.

---

#### 1.9. Cross-Browser Compatibility Testing

**File:** `tests/saucedemo-checkout/cross-browser-compatibility.spec.ts`

**Assumption**: Same test suite executed against each target browser via Playwright project configuration. Each browser starts with a fresh context.

##### 1.9.1. Complete Checkout Flow in Chrome (Chromium)

**Steps:**
1. Execute the full happy-path checkout flow (steps from scenario 1.1) in a Chromium browser
   - expect: All pages load correctly
   - expect: Form validation works as expected
   - expect: All navigation transitions occur
   - expect: Order completes successfully on confirmation page

**Success Criteria**: No Chrome-specific rendering or functionality issues.

##### 1.9.2. Complete Checkout Flow in Firefox

**Steps:**
1. Execute the full happy-path checkout flow (steps from scenario 1.1) in a Firefox browser
   - expect: Identical functionality to Chrome
   - expect: Form fields accept input and validate identically
   - expect: Navigation and URL patterns match

**Success Criteria**: Firefox behavior is consistent with Chrome; no Firefox-specific bugs.

##### 1.9.3. Complete Checkout Flow in Safari (WebKit)

**Steps:**
1. Execute the full happy-path checkout flow (steps from scenario 1.1) using WebKit/Safari engine
   - expect: All features function as expected
   - expect: No Safari-specific CSS/rendering issues with form fields or buttons
   - expect: User experience is consistent with other browsers

**Success Criteria**: Safari/WebKit behavior is consistent with other browsers.

##### 1.9.4. Validation Errors Consistent Across All Browsers

**Steps:**
1. In each browser (Chrome, Firefox, Safari), navigate to the checkout information page with an item in cart
2. Click Continue without filling any fields
   - expect: Error message "Error: First Name is required" appears in all three browsers
   - expect: Error styling (red color, X close button) is consistent across browsers

**Success Criteria**: Validation behavior and error presentation are identical across all target browsers.

---

#### 1.10. Mobile Responsiveness Testing

**File:** `tests/saucedemo-checkout/mobile-responsiveness.spec.ts`

**Assumption**: Tests run with Playwright viewport configuration set to mobile/tablet dimensions. Each test starts with a fresh session.

##### 1.10.1. Checkout Flow on Mobile Viewport (iPhone SE: 375x667)

**Steps:**
1. Set viewport to 375x667 (iPhone SE dimensions)
2. Login and add one product to cart
3. Navigate to cart page
   - expect: Cart items, "Continue Shopping", and "Checkout" buttons are all visible and not clipped
4. Proceed to checkout information page
   - expect: All three form fields are visible and tappable
   - expect: Virtual keyboard does not obscure form fields when focused
5. Fill in form and proceed to overview
   - expect: Item list, payment/shipping info, and price summary are visible without horizontal scrolling
6. Tap "Finish" and verify confirmation page
   - expect: Success message and "Back Home" button are visible and accessible

**Success Criteria**: All checkout elements are accessible and usable on a 375px wide screen.
**Failure Conditions**: Buttons are cut off, forms are unusable, or horizontal scroll is required.

##### 1.10.2. Checkout Flow on Tablet Viewport (iPad: 768x1024)

**Steps:**
1. Set viewport to 768x1024 (iPad portrait dimensions)
2. Execute the complete checkout flow from login to order confirmation
   - expect: Layout adapts appropriately (wider layout may show more content per row)
   - expect: All interactive elements remain accessible
   - expect: Touch targets for buttons are appropriately sized

**Success Criteria**: Full checkout flow completes successfully on tablet dimensions.

##### 1.10.3. Form Interactions on Mobile — Keyboard and Scrolling Behavior

**Steps:**
1. Set viewport to 375x667 (mobile)
2. Navigate to checkout information page with an item in cart
3. Tap the First Name field
   - expect: Field receives focus and is scrolled into view
   - expect: Input is captured correctly
4. Tab/tap through all three form fields
   - expect: Each field is accessible after the previous is filled
5. Tap "Continue"
   - expect: Submit behavior is the same as desktop (validation or navigation)

**Success Criteria**: Form is fully usable on mobile without fields being hidden behind the keyboard.

##### 1.10.4. Mobile Navigation and Back Button Behavior

**Steps:**
1. Set viewport to 375x667 (mobile)
2. Login, add item, navigate to cart, tap Checkout, fill form, tap Continue
3. Use the mobile browser's native back button/gesture from the overview page
   - expect: Navigates back to checkout information page or cart predictably
4. Use mobile back button from the information page
   - expect: Navigates back to cart
   - expect: Cart state is preserved

**Success Criteria**: Mobile browser navigation gestures work consistently with expected checkout flow behavior.

---

## Business Rules Coverage Matrix

| Business Rule | Covered By Scenario(s) |
|---|---|
| BR1: All checkout form fields are mandatory | 1.3.1, 1.3.2, 1.3.3, 1.6.3 |
| BR2: Users must be logged in to access checkout | 1.1 (login is prerequisite for all scenarios) |
| BR3: Cart cannot be empty when proceeding to checkout | Implicit in all scenarios (all add at least 1 item) |
| BR4: Order confirmation should clear the cart | 1.5.2 |
| BR5: Users can cancel checkout at any step and return | 1.7.1 (cancel from info page), 1.7.2 (cancel from overview) |

## Acceptance Criteria Coverage Matrix

| Acceptance Criteria | Covered By Scenario(s) |
|---|---|
| AC1: Cart Review | 1.1, 1.2.1, 1.2.2, 1.2.3, 1.2.4 |
| AC2: Checkout Information Entry | 1.1, 1.3.1–1.3.6 |
| AC3: Order Overview | 1.1, 1.4.1–1.4.5, 1.8.1–1.8.4 |
| AC4: Order Completion | 1.1, 1.5.1–1.5.3 |
| AC5: Error Handling | 1.3.1–1.3.5, 1.6.1–1.6.5 |
