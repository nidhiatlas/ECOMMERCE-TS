import { Given, When, Then, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Browser, Page, chromium } from 'playwright';

let browser: Browser;
let page: Page;

BeforeAll(async () => {
  
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
});

AfterAll(async () => {
  
  if (browser) {
    await browser.close();
  }
});

Given('I open the Amazon.in homepage', async () => {
  await page.goto('https://www.amazon.in',{timeout:15000});
});

When('I navigate to the login page', async () => {
  await page.click('//span[text()="Account & Lists"]',{ timeout: 10000 }); 
});

When('I enter my username {string}', async (username: string) => {
  await page.waitForSelector('//input[@name="email"]'); 
  await page.fill('//input[@name="email"]', username); 
  await page.click('//input[@type="submit"]');
});


When('I enter my password {string}', async (password: string) => {
  await page.fill('//input[@name="password"]', password); 
});

When('I click on the "Sign In" button', async () => {
  await page.click('//input[@type="submit"]'); 
});

Then('I should see the account homepage', async () => {
await page.waitForSelector('//span[normalize-space(text())="Hello, Nidhi"]');
const isHomepageVisible = await page.isVisible('//span[normalize-space(text())="Hello, Nidhi"]');
expect(isHomepageVisible).toBeTruthy();
});

When('I search for {string}', async (product: string) => {
  await page.fill('//input[@placeholder="Search Amazon.in"]', product,{ timeout: 10000 }); 
  await page.press('//input[@placeholder="Search Amazon.in"]', 'Enter',{ timeout: 10000 }); 
  await page.waitForSelector('.s-main-slot', { timeout: 10000 }); 
});

Then('I should see results for {string}', async (product: string) => {
  await expect(page.locator('.s-main-slot'), 'Verify "Result" page').toBeVisible();
  const resultLocator = page.locator(`//span[@class='a-color-state a-text-bold']`);
  await expect(resultLocator, `Verify showing results for searched keyword "${product}"`).toContainText(product);
});

//this is to be edited

When('I apply filter by brand {string}', async (brand: string) => {
  
  await page.waitForLoadState('domcontentloaded');
  
  await page.waitForSelector(`xpath=//span[text()="${brand}"]/..//input`, { timeout: 5000 });
  
  const brandFilter = page.locator(`xpath=//span[text()="${brand}"]/..//input`);
  
  await brandFilter.waitFor({ state: 'visible', timeout: 10000 });
  
  await brandFilter.click();
});


// Apply filter by material
When('I apply filter by material {string}', async (material: string) => {
  await page.waitForSelector(`xpath=//span[text()="${material}"]/..//input`);
  const materialFilter = page.locator(`xpath=//span[text()="${material}"]/..//input`);
  await materialFilter.click();
});

// Verify brand filter applied
Then('I should see products filtered by brand {string}', async (brand: string) => {
  const filteredResults = await page.locator(`text=${brand}/..//input`).isVisible();
  expect(filteredResults).toBeTruthy();
});

// Verify material filter applied
Then('I should see products filtered by material {string}', async (material: string) => {
  const filteredResults = await page.locator(`text=${material}/..//input`).isVisible();
  expect(filteredResults).toBeTruthy();
});

//till here
When('I add the first product to the cart', async () => {
  await page.locator('.s-main-slot .s-result-item').first().click(); 
  await page.click('#add-to-cart-button'); 
});

Then('The product should be added to the cart', async () => {
  const cartCount = await page.locator('#nav-cart-count').textContent();
  expect(Number(cartCount)).toBeGreaterThan(0); 
});

When('I go to the cart', async () => {
  await page.click('#nav-cart'); 
});

Then('I should see {string} in the cart', async (product: string) => {
  const cartItem = await page.locator(`text=${product}`).isVisible();
  expect(cartItem).toBeTruthy(); 
});

Given('I search for a product {string}', (s: string) => {
 
})
