Feature: User Login in Amazon

  Background: Open Amazon homepage
    Given I navigate to "https://www.amazon.com/"

  @smoke
  Scenario: Login with valid credentials
    When I enter valid username "testuser" and password "password123"
    And I click on the login button
    Then I should be redirected to the homepage

  @data
  Scenario Outline: Login with invalid credentials
    When I enter username "<username>" and password "<password>"
    And I click on the login button
    Then I should see the error message "<error_message>"

    Examples:
      | username  | password    | error_message               |
      | wronguser | wrongpass   | "Invalid credentials"       |
      | user123   | passwrong   | "Invalid username or password" |

  @regression
  Scenario: Verify login form fields
    Given I am on the login page
    Then I should see the username field
    And I should see the password field
    And I should see the login button

  @regression
  Scenario Outline: User Login with multiple credentials
    When I enter username "<username>" and password "<password>"
    And I click on the login button
    Then I should be redirected to the homepage

    Examples:
      | username  | password    |
      | user1     | pass1       |
      | user2     | pass2       |

  @data
  Scenario: Check error on empty credentials
    When I leave both username and password empty
    And I click on the login button
    Then I should see the error message "Fields cannot be empty"
