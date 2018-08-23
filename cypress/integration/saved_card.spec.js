const testEmail = `test+saved-cards-${Date.now()}@example.com`;

describe('Purchases with Saved Cards feature enabled', () => {

  before(() => {
    cy.setIframeEnabled(true);
    cy.setSavedCardsEnabled(true);
  });

  it('Performs an initial purchase, saves a card profile, then re-uses it for a second purchase', () => {
    cy.prepareToPurchase();

    // Ensure unique email is used for test run
    cy.get('#billing_email').type('{selectall}{del}' + testEmail);

    cy.get('#createaccount').click();
    cy.get('#card_connect-save-card').click();
    cy.get('#card_connect-new-card-alias').type('Test Card');

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

    // Prepare second purchase, ensure same email is set
    cy.prepareToPurchase(false);
    cy.get('#billing_email').type('{selectall}{del}' + testEmail);

    // Select card from previous purchase to re-use, enter CVC
    cy.get('#card_connect-cards').select('1');
    cy.get('#card_connect-card-cvc')
      .type('{selectall}{del}123');

    // Proceed with second checkoutcheckout
    cy.get('#place_order').click();
    cy.get('.woocommerce-notice').contains('Thank you. Your order has been received.');
  });

  after(() => {
    cy.setSavedCardsEnabled(false);
  });
});
