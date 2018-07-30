/**
 * Configures payment gateway setting for iframe tokenizer
 * @param isEnabled {boolean}
 */
const setIframeEnabled = isEnabled => {
  const val = isEnabled ? 'yes' : 'no';
  cy.wp(`option patch update woocommerce_card_connect_settings use_iframe ${val}`);
  cy.wp('wc payment_gateway get card_connect', { user: 1, format: 'json' })
    .its('settings.use_iframe.value').should('eq', val);
};

describe('Basic Purchase with hosted iFrame Tokenizer', () => {
  // before(() => setIframeEnabled(true));

  it('Gets ready to purchase something', () => {
    cy.prepareToPurchase();
    cy.get('#card_connect-iframe').then(function ($iframe) {
      const cyFrame = cy.wrap($iframe.contents().find('body'));

      // Populate CardConnect iframe's input
      cyFrame.find('#ccnumfield')
        .type('{selectall}{del}4242424242424242');

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
    })
  });
  // after(() => setIframeEnabled(false))
});
