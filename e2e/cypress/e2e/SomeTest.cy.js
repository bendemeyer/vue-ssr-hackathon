describe('some test', () => {
  it('should try?', () => {
    cy.request('/').then((response) => {
      console.log('hi body', request.body);
    });
  });

  it('should pass', () => {
    cy.visit('/');

    cy.get('.root').should('contain', 'Brandon & co');
  });
});
