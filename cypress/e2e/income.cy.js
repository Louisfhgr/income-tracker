// cypress/integration/income.spec.js
describe('Income Tracker', () => {
    it('should allow a user to log in', () => {
      cy.visit('/login')
      cy.get('input[type="email"]').type('user@example.com')
      cy.get('input[type="password"]').type('password')
      cy.get('button[type="submit"]').click()
      cy.url().should('include', '/income')
    })
  
    it('should allow a user to add and view income', () => {
      cy.visit('/income')
      cy.get('input[placeholder="Betrag"]').type('1000')
      cy.get('input[placeholder="Quelle"]').type('Salary')
      cy.get('button[type="submit"]').click()
      cy.contains('td', '1000')
      cy.contains('td', 'Salary')
    })
  })
  