Cypress.Commands.add('prepareToPurchase', () => {
  cy.clearCookies();
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
