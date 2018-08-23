describe('Payment gateway configuration', () => {
  it('is enabled', () => {
    cy.wp('wc payment_gateway get card_connect', { user: 1, format: 'json' })
      .its('enabled').should('eq', true) ;
  })
});
