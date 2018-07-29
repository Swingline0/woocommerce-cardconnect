describe('Basic Purchase', () => {

  // This block will run before every test. It ensure that there are items in the cart and
  // the custom billing info is completed. Skip to the first function `it(...` to see a test.
  beforeEach(() => {
    cy.prepareToPurchase();
  });

  it('Makes a purchase with a single blur', () => {
    cy.get('#card_connect-card-number')
      .type('{selectall}{del}4242424242424242');
    cy.get('#card_connect-card-expiry')
      .type('{selectall}{del}10/30');
    cy.get('#card_connect-card-cvc')
      .type('{selectall}{del}123');
    cy.get('#card_connect-card-number').focus().blur();
    cy.wait(3000);
    cy.get('.card-connect-token').should('have.length', 1);
    cy.get('#place_order').click({ force: true });
    cy.get('.woocommerce-notice').contains('Thank you. Your order has been received.');
  });

  it('Makes a purchase with multiple blurs', () => {
    cy.get('#card_connect-card-number')
      .type('{selectall}{del}4242424242424242');
    cy.get('#card_connect-card-expiry')
      .type('{selectall}{del}10/30');
    cy.get('#card_connect-card-cvc')
      .type('{selectall}{del}123');
    cy.get('#card_connect-card-number').focus().blur();
    cy.get('#card_connect-card-number').focus().blur();
    cy.get('#card_connect-card-number').focus().blur();
    cy.wait(3000);
    cy.get('.card-connect-token').should('have.length', 1);
    cy.get('#place_order').click({ force: true });
    cy.get('.woocommerce-notice').contains('Thank you. Your order has been received.');
  });

  it('Rejects submission if invalid card entered', () => {
    cy.get('#card_connect-card-number')
      .type('{selectall}{del}4242424242424242');
    cy.get('#card_connect-card-expiry')
      .type('{selectall}{del}10/30');
    cy.get('#card_connect-card-cvc')
      .type('{selectall}{del}123');
    cy.get('#card_connect-card-number')
      .type('{selectall}{del}Test').blur();
    cy.wait(3000);
    cy.get('.card-connect-token').should('have.length', 0);
    cy.get('#place_order').click({ force: true });
    cy.get('.woocommerce-error > li').contains('Please enter a credit card number');
  });

  it('Tokenizes credit card on submit if it hadn\'t been before', () => {
    cy.get('#card_connect-card-expiry')
      .type('{selectall}{del}10/30');
    cy.get('#card_connect-card-cvc')
      .type('{selectall}{del}123');
    cy.get('#card_connect-card-number')
      .type('{selectall}{del}4242424242424242');
    cy.wait(3000);
    cy.get('.card-connect-token').should('have.length', 0);
    cy.get('#place_order').click({ force: true });
    cy.get('.woocommerce-notice').contains('Thank you. Your order has been received.');
  });
});
