describe('Send New Message and Add a reply Journey', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.visit(`${Cypress.env('BASE_URL')}pop?bypass=true`)
      cy.url().then(url => {
        if (url.includes('/admin/password')) {
          cy.get('input[name="password"]').type(Cypress.env('POC_PASSWORD'))
          cy.get('button[type="submit"]').click()
          cy.url().should('not.include', '/admin/password')
        }
      })
    })
  })

  it('should complete the "Send new message" and "Add message reply" journey', () => {
    cy.visit(`${Cypress.env('BASE_URL')}pop?bypass=true`)
    cy.get('h1').contains('Welcome, Joe')

    cy.contains('Messages').click()
    cy.url().should('include', '/messages')
    cy.get('h1').contains('Messages')

    cy.get('.govuk-button').contains('Create new message').click()
    cy.url().should('include', '/new-message')
    cy.get('h1').contains('Write new message')

    cy.get('input[name="subject"]').type('Test Subject')
    cy.get('textarea[name="message"]').type('This is a test message.')
    cy.get('input[name="attachment"]').attachFile('test-medical-report.jpeg')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/messages/thread/')
    cy.get('h1').contains('Test Subject')
    cy.get('a').contains('test-medical-report.jpeg').should('have.attr', 'href').and('include', `assets/uploads/`)

    cy.get('textarea[name="message"]').type('This is a test reply.')
    cy.get('input[name="attachment"]').attachFile('test-medical-report.jpeg')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/messages/thread/')
    cy.get('h1').contains('Test Subject')
    cy.get('.moj-message-item__text').contains('This is a test reply.').should('exist')

    cy.get('textarea[name="message"]').type('This is a test reply without an attachment.')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/messages/thread/')
    cy.get('h1').contains('Test Subject')
    cy.get('.moj-message-item__text').contains('This is a test reply without an attachment.').should('exist')

    cy.get('a').contains('Back to messages').click()
    cy.url().should('include', '/messages')
    cy.get('h1').contains('Messages')

    cy.get('h3').contains('Test Subject').should('exist')
  })
})
