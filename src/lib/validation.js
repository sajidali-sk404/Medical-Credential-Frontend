// lib/validate.js

const VALID_SPECIALTIES = [
  "Cardiology", "Radiology", "Pediatrics", "Surgery",
  "Neurology", "Oncology", "Orthopedics", "Dermatology",
  "Hematology", "Psychiatry", "Ophthalmology", "Urology",
  "Gynecology", "Endocrinology", "Nephrology", "Pulmonology",
]

// ── Field-level validators ─────────────────────────────────────────
export const rules = {
  name: (v) => {
    if (!v?.trim())            return "Name is required"
    if (v.trim().length < 2)   return "Name must be at least 2 characters"
    if (v.trim().length > 100) return "Name must be under 100 characters"
    return null
  },

  email: (v) => {
    if (!v?.trim())            return "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email format"
    return null
  },

  password: (v) => {
    if (!v)             return "Password is required"
    if (v.length < 8)   return "Password must be at least 8 characters"
    if (!/[A-Za-z]/.test(v)) return "Password must contain a letter"
    if (!/[0-9]/.test(v))    return "Password must contain a number"
    return null
  },

  company_name: (v) => {
    if (!v?.trim())            return "Company name is required"
    if (v.trim().length < 2)   return "At least 2 characters required"
    return null
  },

  provider_name: (v) => {
    if (!v?.trim())            return "Provider name is required"
    if (v.trim().length < 3)   return "At least 3 characters required"
    if (v.trim().length > 100) return "Must be under 100 characters"
    if (!/^[a-zA-Z\s.\-']+$/.test(v.trim()))
      return "Only letters, spaces, dots, hyphens allowed"
    return null
  },

  specialty: (v) => {
    if (!v?.trim())                    return "Specialty is required"
    if (!VALID_SPECIALTIES.includes(v)) return "Please select a valid specialty"
    return null
  },

  notes: (v) => {
    if (v && v.length > 1000) return "Notes must be under 1000 characters"
    return null
  },

  subject: (v) => {
    if (!v?.trim())            return "Subject is required"
    if (v.trim().length < 5)   return "At least 5 characters required"
    if (v.trim().length > 200) return "Must be under 200 characters"
    return null
  },

  message: (v) => {
    if (!v?.trim())             return "Message is required"
    if (v.trim().length < 10)   return "At least 10 characters required"
    if (v.trim().length > 2000) return "Must be under 2000 characters"
    return null
  },
}

// ── Form-level validators (return object of field errors) ──────────
export const validateLoginForm = ({ email, password }) => {
  const errors = {}
  const e = rules.email(email);       if (e) errors.email    = e
  const p = rules.password(password); if (p) errors.password = p
  return errors
}

export const validateRegisterForm = ({ name, email, password, company_name }) => {
  const errors = {}
  const n = rules.name(name);               if (n) errors.name         = n
  const e = rules.email(email);             if (e) errors.email        = e
  const p = rules.password(password);       if (p) errors.password     = p
  const c = rules.company_name(company_name); if (c) errors.company_name = c
  return errors
}

export const validateRequestForm = ({ provider_name, specialty, notes }) => {
  const errors = {}
  const pn = rules.provider_name(provider_name); if (pn) errors.provider_name = pn
  const sp = rules.specialty(specialty);          if (sp) errors.specialty     = sp
  const nt = rules.notes(notes);                  if (nt) errors.notes         = nt
  return errors
}

export const validateTicketForm = ({ subject, message }) => {
  const errors = {}
  const s = rules.subject(subject); if (s) errors.subject = s
  const m = rules.message(message); if (m) errors.message = m
  return errors
}

// ── Helper: is the form valid? ─────────────────────────────────────
export const isValid = (errors) => Object.keys(errors).length === 0