import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'

govukFrontend.initAll()
mojFrontend.initAll()

function togglePasswordVisibility(passwordFieldId, toggleButtonElement) {
  const passwordField = document.getElementById(passwordFieldId)
  const isPasswordVisible = passwordField.type === 'text'
  passwordField.type = isPasswordVisible ? 'password' : 'text'

  const newTextContent = isPasswordVisible ? 'Show' : 'Hide'
  const ariaLabel = isPasswordVisible ? 'Show password' : 'Hide password'

  const updatedToggleButton = toggleButtonElement
  updatedToggleButton.textContent = newTextContent
  updatedToggleButton.setAttribute('aria-label', ariaLabel)
}

document.querySelectorAll('.govuk-show-password__toggle').forEach(button => {
  button.addEventListener('click', function handlePasswordToggle() {
    const passwordFieldId = this.getAttribute('aria-controls')
    togglePasswordVisibility(passwordFieldId, this)
  })
})
