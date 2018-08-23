describe('Basic Purchases with validation errors', () => {

  before(() => cy.setIframeEnabled(false));

  // This block will run before every test. It ensure that there are items in the cart and
  // the custom billing info is completed. Skip to the first function `it(...` to see a test.
  beforeEach(() => {
    cy.prepareToPurchase();
  });

  it('Makes a purchase with a single blur', () => {

    // Intentionally empty city field to cause validation error
    cy.get('#billing_city')
      .type('{selectall}{del}');

    cy.get('#card_connect-card-number')
      .type('{selectall}{del}4242424242424242');
    cy.get('#card_connect-card-expiry')
      .type('{selectall}{del}10/30');
    cy.get('#card_connect-card-cvc')
      .type('{selectall}{del}123');
    cy.wait(3000);
    cy.get('.card-connect-token').should('have.length', 1);
    cy.get('#place_order').click();

    cy.get('body').contains('Billing Town / City is a required field.');

    // Intentionally empty city field to cause validation error
    cy.get('#billing_city')
      .type('{selectall}{del}Testville');

    cy.get('#place_order').click();

    cy.get('.woocommerce-notice').contains('Thank you. Your order has been received.');
  });

});
