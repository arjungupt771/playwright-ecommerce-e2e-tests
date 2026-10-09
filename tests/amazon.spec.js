
const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.demoblaze.com';

const products = [
  {
    name: 'Iphone 6 32gb',
    category: 'Phones',
  },
  {
    name: 'Samsung galaxy s6',
    category: 'Phones',
  },
];

for (const product of products) {
  test(`Add ${product.name} to cart`, async ({ page }) => {
    await page.goto(BASE_URL);

    // Open the Phones category.
    await page.getByRole('link', {
      name: product.category,
      exact: true,
    }).click();

    // Select the requested product.
    await page.getByRole('link', {
      name: product.name,
      exact: true,
    }).click();

    // Verify that the correct product details are displayed.
    await expect(
      page.locator('h2.name')
    ).toHaveText(product.name);

    // Verify that a valid price is displayed.
    const priceLocator = page.locator('.price-container');

    await expect(priceLocator).toBeVisible();

    const priceText = await priceLocator.innerText();

    expect(
      priceText,
      `Expected a valid price for ${product.name}`
    ).toMatch(/\$\s*\d+(?:\.\d{1,2})?/);

    console.log(`${product.name} price: ${priceText}`);

    // Register the dialog listener BEFORE clicking Add to cart.
    const dialogPromise = page.waitForEvent('dialog');

    await page.getByRole('link', {
      name: 'Add to cart',
      exact: true,
    }).click();

    const dialog = await dialogPromise;

    try {
      expect(dialog.message()).toContain('Product added');
    } finally {
      await dialog.accept();
    }
  });
}
