import { Before, After, Given, When, Then, setDefaultTimeout, World } from "@cucumber/cucumber";
import { chromium, Page, Browser, expect } from "@playwright/test";
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'allure-playwright',
});

Given('I navigate to {string}', function (string) {
           
          
        });

   

When('I enter valid username {string} and password {string}', function (string, string2) {     
           
           
         });

   

When('I click on the login button', function () {
           
         });

   

Then('I should be redirected to the homepage', function () {
          
         });