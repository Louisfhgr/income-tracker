// cypress/e2e/income.spec.js

describe('Income Page', () => {
  before(() => {
    cy.visit('http://localhost:3000/login')

    // Anmelden
    cy.get('input[type="email"]').type('testuser@example.com')
    cy.get('input[type="password"]').type('password')
    cy.get('button[type="submit"]').click()
  })

  it('should display the income page after login', () => {
    cy.visit('http://localhost:3000/income')

    // Überprüfen Sie, ob die Seite geladen wurde
    cy.contains('Einkommen')
    cy.contains('Angemeldet als: testuser@example.com')
  })

  it('should add a new income entry', () => {
    cy.visit('http://localhost:3000/income')

    // Fügen Sie neue Einkommensdaten hinzu
    cy.get('input[placeholder="Betrag"]').type('1000')
    cy.get('input[placeholder="Quelle"]').type('Freelancing')
    cy.get('button[type="submit"]').click()

    // Überprüfen Sie, ob die neuen Einkommensdaten angezeigt werden
    cy.contains('1000')
    cy.contains('Freelancing')
  })
})
// cypress/e2e/income.spec.js

describe('Income Page', () => {
  before(() => {
    cy.visit('http://localhost:3000/login')

    // Anmelden
    cy.get('input[type="email"]').type('testuser@example.com')
    cy.get('input[type="password"]').type('password')
    cy.get('button[type="submit"]').click()
  })

  it('should display the income page after login', () => {
    cy.visit('http://localhost:3000/income')

    // Überprüfen Sie, ob die Seite geladen wurde
    cy.contains('Einkommen')
    cy.contains('Angemeldet als: testuser@example.com')
  })

  it('should add a new income entry', () => {
    cy.visit('http://localhost:3000/income')

    // Fügen Sie neue Einkommensdaten hinzu
    cy.get('input[placeholder="Betrag"]').type('1000')
    cy.get('input[placeholder="Quelle"]').type('Freelancing')
    cy.get('button[type="submit"]').click()

    // Überprüfen Sie, ob die neuen Einkommensdaten angezeigt werden
    cy.contains('1000')
    cy.contains('Freelancing')
  })
})
