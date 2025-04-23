describe('Did Not Attend Appointment Journey', () => {
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

  it('should complete the "Did not attend appointment" journey', () => {
    cy.visit(`${Cypress.env('BASE_URL')}pop?bypass=true`)
    cy.get('h1').contains('Welcome, Joe')

    cy.contains('appointments').click()
    cy.url().should('include', '/appointments')
    cy.get('h1').contains('Appointments')

    cy.contains('a', /^View$/)
      .first()
      .click()
    cy.url().should('include', '/view-appointment')
    cy.get('h1').contains('View upcoming appointment')

    cy.contains('tell your probation practitioner').click()
    cy.url().should('include', '/appointment-notify')
    cy.get('h1').contains('Why are you unable to attend?')
    cy.get('input[name="cancellationReason"][value="health"]').check({ force: true })
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/appointment-notify-upload-evidence')
    cy.get('h1').contains('upload supporting evidence')

    cy.get('input[name="attachments"]').attachFile('test-medical-report.jpeg')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/appointment-notify-upload-evidence')
    cy.contains('Uploaded files')
    cy.contains('test-medical-report.jpeg')

    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/appointments?submittedEvidence=true')

    cy.get('h1').contains('Appointments')
    cy.contains('You told us you cannot attend')
  })
})
