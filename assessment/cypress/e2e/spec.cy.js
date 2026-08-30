describe("Country App Tests", () => {
  
  // Test for the Presence of the Search Input Field
  it("UI Elements - should have an input field for searching", () => {
    cy.visit("http://13.235.9.213:8081/");
    cy.get('input[type="text"]').should("exist");
  });

  // Test API Call for Success
  it("API Calls - should call API and handle success", () => {
    cy.intercept("GET", "https://countries-search-data-prod-812920491762.asia-south1.run.app/countries").as(
      "getCountries"
    );
    cy.visit("http://13.235.9.213:8081/");
    cy.wait("@getCountries").its("response.statusCode").should("eq", 200);
  });

  // Test for error handling
  it("API Error Handling - logs an error to the console on API failure", () => {
    // Spy on both console.log and console.error
    cy.on("window:before:load", (win) => {
      cy.spy(win.console, "log").as("consoleLog");
      cy.spy(win.console, "error").as("consoleError");
    });

    // Intercept the API request and force a network error
    cy.intercept("GET", "https://countries-search-data-prod-812920491762.asia-south1.run.app/countries", {
      forceNetworkError: true,
    }).as("getFailedCountries");

    // Visit the application
    cy.visit("http://13.235.9.213:8081/");

    // Wait for the intercepted API call
    cy.wait("@getFailedCountries");

    // Wait for any asynchronous operations to complete
    cy.wait(500);

    // Check if either console.log or console.error was called
    cy.get("@consoleLog").then((consoleLog) => {
      cy.get("@consoleError").then((consoleError) => {
        expect(consoleLog.called || consoleError.called).to.be.true;
      });
    });
  });

  // Test for the Presence of Country Containers
  it("Display of Country Containers - should have containers with country flag and name", () => {
    cy.visit("http://13.235.9.213:8081/");
    cy.wait(500); // Adjust based on response time
    cy.get('.countryCard').each(($el) => {
      cy.wrap($el).find("img").should("exist");
      cy.wrap($el).find("h2, p, span, div").should("exist");
    });
  });

  // Test Search Functionality and Clearing Search
  it("Search Functionality - should filter countries based on search and show results accordingly", () => {
    cy.visit("http://13.235.9.213:8081/");
    const searchTerm = "Canada";
    cy.get('input[type="text"]').type(searchTerm);
    cy.get('.countryCard').should(
      "contain",
      searchTerm
    );

    cy.get('input[type="text"]').clear();
    cy.get('.countryCard').should(
      "have.length.at.least",
      249
    );
  });

  // Test for No Results on Search
  it("Search Functionality - should show no results when no matching countries are found", () => {
    cy.visit("http://13.235.9.213:8081/");
    cy.get('input[type="text"]').type("xyz123");
    cy.get('.countryCard').should("have.length", 0);
  });

  // Test for Specific Search Result
  it('Search Functionality - should show 3 containers when searching for "ind"', () => {
    cy.intercept('GET', 'https://countries-search-data-prod-812920491762.asia-south1.run.app/countries').as('getCountries');
    cy.visit("http://13.235.9.213:8081/");
    cy.wait('@getCountries');
    cy.get('input[type="text"]').type("ind");
    cy.get('.countryCard').should("have.length", 3);
  });
});