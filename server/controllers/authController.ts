import { RequestHandler } from 'express'

export const renderSignInOrCreate: RequestHandler = async (req, res, next) => {
  try {
    if (req.session.is_pop_login) {
      res.redirect('/pop')
    } else {
      res.render('pages/one-login/sign-in-or-create')
    }
  } catch (error) {
    next(error)
  }
}

export const handleSignInOrCreate: RequestHandler = async (req, res, next) => {
  try {
    const { optionSelected } = req.body
    if (optionSelected === 'create') {
      res.redirect('/one-login/enter-email-address')
    } else {
      res.redirect('/one-login/enter-email-address-login')
    }
  } catch (error) {
    next(error)
  }
}

export const renderEnterEmailAddress: RequestHandler = async (req, res, next) => {
  try {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/one-login/enter-email-address', { errorMessage })
  } catch (error) {
    next(error)
  }
}

export const handleEnterEmailAddress: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email.endsWith('@example.com')) {
      req.session.errorMessage = 'You must enter a valid email address with example.com domain'
      res.redirect('/one-login/enter-email-address')
    } else {
      res.redirect(`/one-login/verify-security-code?email=${encodeURIComponent(email)}`)
    }
  } catch (error) {
    next(error)
  }
}

export const renderVerifySecurityCode: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.query
    if (!email) {
      res.redirect('/one-login/enter-email-address')
    } else {
      const { errorMessage } = req.session
      delete req.session.errorMessage
      res.render('pages/one-login/verify-security-code', { email, errorMessage })
    }
  } catch (error) {
    next(error)
  }
}

export const handleVerifySecurityCode: RequestHandler = async (req, res, next) => {
  try {
    const { code } = req.body
    const email = req.query.email || req.body.email
    if (code !== process.env.VALID_OTP) {
      req.session.errorMessage = 'Invalid OTP code. Please try again.'
      res.render('pages/one-login/verify-security-code', { email, errorMessage: req.session.errorMessage })
    } else {
      res.redirect('/one-login/create-password')
    }
  } catch (error) {
    next(error)
  }
}

export const renderCreatePassword: RequestHandler = async (req, res, next) => {
  try {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/one-login/create-password', { errorMessage })
  } catch (error) {
    next(error)
  }
}

export const handleCreatePassword: RequestHandler = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      req.session.errorMessage = 'Passwords do not match. Please try again.'
      res.redirect('/one-login/create-password')
    } else if (password.length < 8) {
      req.session.errorMessage = 'Password must be at least 8 characters long. Please try again.'
      res.redirect('/one-login/create-password')
    } else {
      res.redirect('/one-login/enter-phone-number')
    }
  } catch (error) {
    next(error)
  }
}

export const renderEnterPhoneNumber: RequestHandler = async (req, res, next) => {
  try {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/one-login/enter-phone-number', { errorMessage })
  } catch (error) {
    next(error)
  }
}

export const handleEnterPhoneNumber: RequestHandler = async (req, res, next) => {
  try {
    const { phoneNumber, hasInternationalPhoneNumber, internationalPhoneNumber } = req.body
    let errorMessage = null

    if (hasInternationalPhoneNumber && !internationalPhoneNumber) {
      errorMessage = 'You must enter an international phone number.'
    } else if (!hasInternationalPhoneNumber && !phoneNumber) {
      errorMessage = 'You must enter a UK mobile phone number.'
    }

    if (errorMessage) {
      req.session.errorMessage = errorMessage
      res.redirect('/one-login/enter-phone-number')
    } else {
      res.redirect('/one-login/get-security-code')
    }
  } catch (error) {
    next(error)
  }
}

export const renderGetSecurityCode: RequestHandler = async (req, res, next) => {
  try {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/one-login/get-security-code', { errorMessage })
  } catch (error) {
    next(error)
  }
}

export const handleGetSecurityCode: RequestHandler = async (req, res, next) => {
  try {
    const { 'choose-security-codes': chooseSecurityCodes } = req.body
    if (!chooseSecurityCodes) {
      req.session.errorMessage = 'You must choose a method to get code.'
      res.redirect('/one-login/get-security-code')
    } else {
      res.redirect('/one-login/check-phone')
    }
  } catch (error) {
    next(error)
  }
}

export const renderCheckPhone: RequestHandler = async (req, res, next) => {
  try {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/one-login/check-phone', { errorMessage })
  } catch (error) {
    next(error)
  }
}

export const handleCheckPhone: RequestHandler = async (req, res, next) => {
  try {
    const { otp } = req.body
    if (otp !== process.env.POP_LOGIN_OTP) {
      req.session.errorMessage = 'Invalid OTP code. Please try again.'
      res.redirect('/one-login/check-phone')
    } else {
      res.redirect('/one-login/account-created')
    }
  } catch (error) {
    next(error)
  }
}

export const renderAccountCreated: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/one-login/account-created')
  } catch (error) {
    next(error)
  }
}

export const handleAccountCreated: RequestHandler = async (req, res, next) => {
  try {
    req.session.is_pop_login = true
    res.redirect('/pop/verify')
  } catch (error) {
    next(error)
  }
}
