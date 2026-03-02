import { BookingInitData, SlotsResponse, BookingConfirmation, DEFAULT_THEME } from './types'

const BASE_URL = 'https://tikej.app.n8n.cloud/webhook/booking'

// ── action: "init" (GET) ────────────────────────────────────────────────────
export async function initBooking(slug: string): Promise<BookingInitData> {
  const response = await fetch(`${BASE_URL}?action=init&companySlug=${slug}`)

  if (!response.ok) {
    throw new Error(`Failed to initialize booking: ${response.statusText}`)
  }

  const raw = await response.json()

  // API sometimes returns a double-serialised JSON string — unwrap it
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw

  // Apply default theme if not provided
  if (!data.theme) {
    data.theme = DEFAULT_THEME
  } else {
    data.theme = { ...DEFAULT_THEME, ...data.theme }
  }

  // Normalise company name from Slovenian field "naziv"
  if (data.company) {
    const c = data.company
    if (!c.name && !c.bookingName) {
      c.name = c.naziv || c['Naziv Podjetja'] || c['naziv_podjetja'] || ''
    }
    if (!c.slug) {
      c.slug = c.idPodjetja || ''
    }
  }

  return data as BookingInitData
}

// ── action: "slots" (POST) ──────────────────────────────────────────────────
export async function getAvailableSlots(params: {
  companySlug: string
  date: string
  serviceId: string
  employeeId: string | null
  anyPerson: boolean
}): Promise<SlotsResponse> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'slots',
      companySlug: params.companySlug,
      date: params.date,
      serviceId: params.serviceId,
      employeeId: params.employeeId,
      any_person: params.anyPerson,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch available slots: ${response.statusText}`)
  }

  const data = await response.json()

  // Backend returns array of { date, slots } objects
  if (Array.isArray(data) && data.length > 0) {
    const dateSlots = data.find((item: { date: string; slots: string[] }) => item.date === params.date)
    return { slots: dateSlots?.slots || [] }
  }

  // Fallback for direct { slots: [] } format
  if (data.slots) {
    return data
  }

  return { slots: [] }
}

// ── action: "create" (POST) ─────────────────────────────────────────────────
export async function createBooking(params: {
  companySlug: string
  date: string
  time: string
  serviceId: string
  employeeId: string | null
  anyPerson: boolean
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: string
  notes: string
  marketingConsent: boolean
}): Promise<BookingConfirmation> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create',
      companySlug: params.companySlug,
      date: params.date,
      time: params.time,
      serviceId: params.serviceId,
      employeeId: params.employeeId,
      any_person: params.anyPerson,
      firstName: params.firstName,
      lastName: params.lastName,
      customerName: `${params.firstName} ${params.lastName}`,
      customerEmail: params.email,
      customerPhone: params.phone,
      customerGender: params.gender,
      customerNote: params.notes,
      gdprSendMarketing: params.marketingConsent,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create booking: ${response.statusText}`)
  }

  return response.json()
}
