import { Given, When, Then, BeforeAll, AfterAll, setDefaultTimeout, After, Status } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Browser, Page, chromium, BrowserContext } from 'playwright';
// import {Allure}
import * as fs from 'fs';
import * as path from 'path';
import * as allure from 'allure-js-commons';
let browser: Browser;
let context: BrowserContext;
let page: Page;
let i: number = 0;
setDefaultTimeout(20000);
BeforeAll(async () => {
  
  const allureResultsDir = path.join(__dirname, 'report', 'allure-results'); 
  browser = await chromium.launch({ headless: false, slowMo: 1000 });
  context = await browser.newContext({
    recordVideo: {
      dir: allureResultsDir,  
      size: {
        width: 1280,
        height: 720
      }
    }
  });
  page = await context.newPage();
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    // Capture screenshot and attach to the Allure report
    const screenshot = await page.screenshot();
    this.attach(screenshot, 'image/png'); 

    // Capture video and attach to the Allure report
    const video = await page.video();
    if (video) {
      const videoPath = await video.path();  
      if (videoPath) {
        const videoBuffer = fs.readFileSync(videoPath);  
        this.attach(videoBuffer, 'video/webm');  
      }
    }
  }
});
AfterAll(async () => {
  
  if (browser) {
    await browser.close();
    
  }
});

Given(`I open the Amazon.in homepage`, async () => {
 await page.goto('https://www.amazon.in',{timeout:15000});
});

When('I navigate to the login page', async () => {
  await page.click('//span[normalize-space(text())="Account & Lists"]',{ timeout: 20000 }); 
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


Given('I search for a product {string}', async (product: string) => {
  await page.fill('//input[@placeholder="Search Amazon.in"]', product,{ timeout: 10000 }); 
  await page.press('//input[@placeholder="Search Amazon.in"]', 'Enter',{ timeout: 10000 }); 
  await page.waitForSelector('.s-main-slot', { timeout: 10000 }); 
})
//filter by brand
When('I apply filter by brand {string}', async (brand: string) => {
  const brandXPath = `//span[@class='a-size-base a-color-base' and text()="${brand}"]`;
  await page.waitForSelector(brandXPath, { timeout: 20000 });
  const brandFilter = page.locator(brandXPath);
  await brandFilter.click();
});

//filter by material
When('I apply filter by material {string}', async (material: string) => {
  const materialXPath = `//span[normalize-space(text())="${material}"]`
  await page.waitForSelector(materialXPath,{timeout:10000});
  const materialFilter=page.locator(materialXPath);
  await materialFilter.click();   
});

// Verify brand filter 
Then('I should see products filtered by brand {string}', async (brand: string) => {
  const brandCheckbox = page.locator('//span[text()="Nike"]/preceding-sibling::div[contains(@class, "a-checkbox")]//input[@type="checkbox"]');
  //console.log(brandCheckbox, "brandCheckbox")
  
  const isChecked = await brandCheckbox.isChecked();
  //console.log(isChecked, "ischecked")
  expect(isChecked).toBeTruthy();  
});

Then('I should see products filtered by material {string}', async (material: string) => {
  const materialCheckbox = page.locator(`(//i[@class='a-icon a-icon-checkbox'])[47]`);
  
  // Check if the material filter checkbox is selected
  const isChecked = await materialCheckbox.isChecked();
  expect(materialCheckbox).toBeTruthy();
});

When('I add the first product to the cart', async () => {
  await page.locator(`(//div[contains(@class,'a-section aok-relative')])[1]`).click(); 
  await page.waitForTimeout(3000);
  const newTab =  context.pages()[1];
  page = newTab;
  // page = context.pages()[0];
  
  await page.click('//input[@title="Add to Shopping Cart"]'); 
});

Then('The product should be added to the cart', async () => {
  const cartCount = await page.locator('#nav-cart-count').textContent();
  expect(Number(cartCount)).toBeGreaterThan(0); 
});

When('I go to the cart', async () => {
 
  const cartIcon = page.locator('//span[@class="nav-cart-icon nav-sprite"]');
  await cartIcon.waitFor({ state: 'visible', timeout: 20000 });

  await cartIcon.click();
});


Then('I should see product in the cart', async () => {
  
  const cartItemLocator = page.locator('//div[@data-name="Active Items Header"]/following-sibling::div[1]');
  await cartItemLocator.waitFor({ state: 'visible', timeout: 20000 });

 
  const cartItemVisible = await cartItemLocator.isVisible();
  expect(cartItemVisible).toBeTruthy();
});




