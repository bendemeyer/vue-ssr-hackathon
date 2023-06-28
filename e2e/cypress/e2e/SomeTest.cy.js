describe('some test', () => {
  it('should pass', () => {
    cy.visit('/');

    cy.get('.root').should('contain', 'Brandon & co');
  });
});
