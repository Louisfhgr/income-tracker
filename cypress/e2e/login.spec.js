// cypress/e2e/login.spec.js

describe('Login Page', () => {
  it('should allow a user to login', () => {
    cy.visit('http://localhost:3000/login')

    // Geben Sie hier die Anmeldedaten ein
    cy.get('input[type="email"]').type('testuser@example.com')
    cy.get('input[type="password"]').type('password')

    cy.get('button[type="submit"]').click()

    // Überprüfen Sie, ob der Benutzer angemeldet ist
    cy.contains('Angemeldet als: testuser@example.com')
  })
})
