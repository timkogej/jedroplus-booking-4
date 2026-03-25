export function sanitizeInput(value: string): string {
  return value.trim().replace(/[<>]/g, '')
}

export function isHoneypotFilled(data: { website?: string }): boolean {
  return !!data.website && data.website.trim().length > 0
}

interface ValidationResult {
  success: boolean
  errors?: Record<string, string>
}

export function validateBookingForm(data: unknown): ValidationResult {
  const errors: Record<string, string> = {}
  const d = data as Record<string, unknown>

  if (!d.firstName || typeof d.firstName !== 'string' || !d.firstName.trim())
    errors.firstName = 'Ime je obvezno'
  if (!d.lastName || typeof d.lastName !== 'string' || !d.lastName.trim())
    errors.lastName = 'Priimek je obvezen'
  if (!d.email || typeof d.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
    errors.email = 'Vnesite veljaven e-poštni naslov'
  if (!d.phone || typeof d.phone !== 'string' || !d.phone.trim())
    errors.phone = 'Telefonska številka je obvezna'
  if (!d.privacyConsent)
    errors.privacyConsent = 'Za oddajo rezervacije se morate strinjati s politiko zasebnosti.'

  return Object.keys(errors).length === 0 ? { success: true } : { success: false, errors }
}
