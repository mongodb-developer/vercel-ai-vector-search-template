// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

describe('sample test', () => {
    beforeEach(() => {
      cy.visit('/')
    })
  
    it('displays the history', () => {
      cy.get('a')
      .contains('Go to Admin Page for Context Upload');
    })
 

    
  })

  describe('Chat message sending and response check', () => {
    beforeEach(() => {
        cy.visit('/');

        // Listen for console errors and fail the test if one occurs
        cy.on('window:console', (msg) => {
            expect(msg.type()).not.to.eq('error');
        });
    });

    it('should send a message and check for a response without console errors', () => {
        const testMessage = 'Hello, how are you?';

        cy.get('input')
          .type(testMessage);
        // press enter to send the message
        cy.get('input').type('{enter}');
        cy.wait(3000);
        cy.get('.whitespace-pre-wrap')
          .should('contain', testMessage);
        cy.get('b').should('contain', 'AI:');
        // Additional assertions or actions can be performed here
    });
});