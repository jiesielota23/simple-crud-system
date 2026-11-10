// Required field
export const requiredValidator = value => {
  return !!String(value ?? '').trim() || 'This field is required'
}

// Email format
export const emailValidator = value => {
  if (!value) return true

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    || 'Please enter a valid email address'
}

// Minimum length
export const minLengthValidator = min => value => {
  if (!value) return true

  return String(value).length >= min
    || `Minimum ${min} characters required`
}

// Maximum length
export const maxLengthValidator = max => value => {
  if (!value) return true

  return String(value).length <= max
    || `Maximum ${max} characters allowed`
}

// Confirm password
export const confirmedValidator = getPassword => value => {
  return value === getPassword()
    || 'Passwords do not match'
}
