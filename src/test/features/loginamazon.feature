Feature: User Login in Amazon

  Background: Given User should be on e-com website url "https://www.demoblaze.com/"
    When User to click on login button

@tag1
Scenario: Testing signing feature for E-commerce website
    Then login dialog box should be displayed.

@tag1
Scenario Outline: 
    And User to enter valid <user_name> and <passwrd>
    And Click on Login
    Then User must be on "#nameofuser"

    Examples: 
      | user_name | passwrd  |
      | jamie1    | jam      |
      | tithi980  | Tithi980 |
      | Te&2231   | 4235ar!  |
  

