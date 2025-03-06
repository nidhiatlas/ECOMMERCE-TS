Feature: Amazon.in End-to-End Shopping Journey
  
  Background:
    Given I open the Amazon.in homepage

  Scenario: Login to Amazon.in
    When I navigate to the login page
    And I enter my username "jaiswalnidhi675@gmail.com"
    And I enter my password "nidhi.27"
    And I click on the "Sign In" button
    Then I should see the account homepage

  Scenario: Search for a product
    When I search for "Shoes"
    Then I should see results for "Shoes"

  Scenario: Apply filters for a product
    Given I search for a product "Shoes"
    When I apply filter by brand "Nike"
    And I apply filter by material "Leather"
    Then I should see products filtered by brand "Nike"
    And I should see products filtered by material "Leather"

  Scenario: Add the first product to the cart
    Given I search for a product "Nike Shoes"
    When I add the first product to the cart
    Then The product should be added to the cart

  Scenario: Verify the product in the cart
    Given I search for a product "Nike Shoes"
    And I add the first product to the cart
    When I go to the cart
    Then I should see "Nike Shoes" in the cart
