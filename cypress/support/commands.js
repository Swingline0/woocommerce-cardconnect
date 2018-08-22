Cypress.Commands.add('wp', (command, args) => cy.task('wpCli', { command, args }));

Cypress.Commands.add('prepareToPurchase', (resetSession = true) => {
  if (resetSession) {
    cy.clearCookies();
  }
  // Go to shop page
  cy.visit(`?post_type=product`);
  cy.get('title').contains('Products – Test Site');
  cy.wait(1000);
  // Add each test product to cart
  cy.get('.post-8 > .button').click();
  cy.get('.post-9 > .button').click();
  cy.get('.post-10 > .button').click();
  cy.wait(1000);
  cy.get('.post-8').contains('View cart');
  cy.get('.post-9').contains('View cart');
  cy.get('.post-10').contains('View cart');
  // Go to cart page & verify items are in cart
  cy.visit('?page_id=5');
  cy.get('.cart_item').should('have.length', 3);
  cy.wait(1000);
  // Proceed to checkout and complete billing info
  cy.visit('?page_id=6');
  cy.get('#billing_first_name')
    .type('{selectall}{del}Test');
  cy.get('#billing_last_name')
    .type('{selectall}{del}User');
  cy.get('#billing_address_1')
    .type('{selectall}{del}123 Fake Street');
  cy.get('#billing_city')
    .type('{selectall}{del}Testville');
  cy.get('#billing_postcode')
    .type('{selectall}{del}12345');
  cy.get('#billing_phone')
    .type('{selectall}{del}123-456-7890');
  cy.get('#billing_email')
    .type('{selectall}{del}test@example.com');
});

/**
 * Configures payment gateway setting for iframe tokenizer
 * @param isEnabled {boolean}
 */
Cypress.Commands.add('setIframeEnabled', isEnabled => {
  const val = isEnabled ? 'yes' : 'no';
  cy.wp(`option patch update woocommerce_card_connect_settings use_iframe ${val}`);
  cy.wp('wc payment_gateway get card_connect', { user: 1, format: 'json' })
    .its('settings.use_iframe.value').should('eq', val);
});

/**
 * Configures store to allow saved cards
 * @param isEnabled {boolean}
 */
Cypress.Commands.add('setSavedCardsEnabled', isEnabled => {
  const val = isEnabled ? 'yes' : 'no';
  cy.wp(`option update woocommerce_enable_signup_and_login_from_checkout ${val}`);
  cy.wp(`option patch update woocommerce_card_connect_settings enable_profiles ${val}`);
});

/**
 * Sets iframe input to the value provided
 * @param ccInput {string}
 */
Cypress.Commands.add('setIframeCCInput', ccInput =>
  cy.get('#card_connect-iframe').then(function ($iframe) {
    const cyFrame = cy.wrap($iframe.contents().find('body'));

    // Populate CardConnect iframe's input
    cyFrame.find('#ccnumfield')
      .type(ccInput);
  })
);
