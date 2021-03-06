describe('Basic Purchase with hosted iFrame Tokenizer', () => {
  before(() => cy.setIframeEnabled(true));

  it('Performs a basic purchase', () => {
    cy.prepareToPurchase();

    cy.setIframeCCInput('{selectall}{del}4242424242424242');

    // Complete non-iframe fields
    cy.get('#card_connect-card-expiry')
      .type('{selectall}{del}10/30');
    cy.get('#card_connect-card-cvc')
      .type('{selectall}{del}123');

    // Wait and then verify that CardConnect token is populated
    cy.wait(3000);
    cy.get('.card-connect-token').should('not.have.value', '');

    // Proceed with checkout
    cy.get('#place_order').click();
    cy.get('.woocommerce-notice').contains('Thank you. Your order has been received.');
  });
});
