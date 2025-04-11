describe('POP Routes', () => {
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

  it('should render the Index page or handle password redirection', () => {
    cy.visit(`${Cypress.env('BASE_URL')}pop?bypass=true`)
    cy.url().then(url => {
      if (url.includes('/admin/password')) {
        cy.get('input[name="password"]').type(Cypress.env('POC_PASSWORD'))
        cy.get('button[type="submit"]').click()

        cy.url().then(redirectedUrl => {
          const normalizedUrl = redirectedUrl.replace(/^https?:\/\//, '')
          const expectedUrl = Cypress.env('BASE_URL').replace(/^https?:\/\//, '')
          expect(normalizedUrl).to.eq(expectedUrl)
        })
      } else {
        cy.get('h1').contains('Welcome, Joe')
      }
    })
  })

  it('should access the POP Index page', () => {
    cy.visit(`${Cypress.env('BASE_URL')}pop?bypass=true`)
    cy.get('h1').contains('Welcome, Joe')
  })

  it('should navigate to the "Your Details" page from the POP Index page', () => {
    cy.visit(`${Cypress.env('BASE_URL')}pop?bypass=true`)
    cy.get('h1').contains('Welcome, Joe')

    cy.contains('details').click()

    cy.url().should('include', '/your-details')
    cy.get('h1').contains('Your details')

    cy.go('back')
    cy.get('h1').contains('Welcome, Joe')
  })

  it('should navigate to the "Your Progress" page from the POP Index page', () => {
    cy.visit(`${Cypress.env('BASE_URL')}pop?bypass=true`)
    cy.get('h1').contains('Welcome, Joe')

    cy.contains('progress').click()

    cy.url().should('include', '/your-progress')
    cy.get('h1').contains('Your progress')

    cy.go('back')
    cy.get('h1').contains('Welcome, Joe')
  })

  it('should navigate to the "Past and upcoming appointments" page from the POP Index page', () => {
    cy.visit(`${Cypress.env('BASE_URL')}pop?bypass=true`)
    cy.get('h1').contains('Welcome, Joe')

    cy.contains('appointments').click()

    cy.url().should('include', '/appointments')
    cy.get('h1').contains('Appointments')

    cy.go('back')
    cy.get('h1').contains('Welcome, Joe')
  })

  it('should navigate to the "Messages" page from the POP Index page', () => {
    cy.visit(`${Cypress.env('BASE_URL')}pop?bypass=true`)
    cy.get('h1').contains('Welcome, Joe')

    cy.contains('Messages').click()

    cy.url().should('include', '/messages')
    cy.get('h1').contains('Messages')

    cy.go('back')
    cy.get('h1').contains('Welcome, Joe')
  })

  it('should navigate to the "Your Conditions" page from the POP Index page', () => {
    cy.visit(`${Cypress.env('BASE_URL')}pop?bypass=true`)
    cy.get('h1').contains('Welcome, Joe')

    cy.contains('conditions').click()

    cy.url().should('include', '/conditions')
    cy.get('h1').contains('Your conditions')
    cy.go('back')
    cy.get('h1').contains('Welcome, Joe')
  })
})
