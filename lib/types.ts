// ─── Season & Theme Types ───────────────────────────────────────────────────

export type Season = 'winter' | 'spring' | 'summer' | 'autumn'

export type Holiday =
  | 'christmas'
  | 'newyear'
  | 'valentine'
  | 'easter'
  | 'halloween'
  | 'thanksgiving'

export interface SeasonalThemeConfig {
  name: string
  snowflakes?: boolean
  flowers?: boolean
  leaves?: boolean
  sunRays?: boolean
  waves?: boolean
  santaHats?: boolean
  ornaments?: boolean
  hearts?: boolean
  eggs?: boolean
  pumpkins?: boolean
  ghosts?: boolean
  bats?: boolean
  spiderWebs?: boolean
  butterflies?: boolean
  fireworks?: boolean
  confettiAccents?: boolean
  harvest?: boolean
  accentColor: string
  overlayColor: string
  particleColor: string
  fontClass: string
}

export interface SeasonalTheme {
  season: Season
  holiday?: Holiday
  theme: SeasonalThemeConfig
}

// ─── n8n API Response Types ─────────────────────────────────────────────────

export interface ApiTheme {
  primaryColor: string
  secondaryColor: string
  bgFrom: string
  bgTo: string
}

export interface Company {
  id?: string
  idPodjetja?: string
  name?: string
  naziv?: string
  slug?: string
  bookingName?: string
  'Naziv Podjetja'?: string
  naziv_podjetja?: string
  [key: string]: unknown
}

export interface Employee {
  id: string
  name?: string
  [key: string]: unknown
}

export interface EmployeeUI {
  id: string
  label: string
  subtitle: string
  initials: string
}

export interface Service {
  id: string
  // API returns Slovenian field names
  naziv: string
  opis?: string
  trajanjeMin?: number
  cena?: number
  kategorija?: string
  category_id?: string
  // Fallback English names
  name?: string
  description?: string
  duration?: number
  price?: number
}

export interface ServiceCategory {
  id: string
  name: string
  service_count: number
  icon?: string
  description?: string
}

export interface ServicesByCategory {
  [categoryId: string]: Service[]
}

export interface UIConfig {
  employeeSelection: {
    mode: 'single' | 'multi'
  }
}

export interface BookingInitData {
  company: Company
  employees: Employee[]
  employees_ui: EmployeeUI[]
  services: Service[]
  serviceCategories: ServiceCategory[]
  servicesByCategory: ServicesByCategory
  employeesByServiceId?: Record<string, (string | number)[]>
  ui: UIConfig
  theme: ApiTheme
}

export interface BookingConfirmation {
  success: boolean
  message: string
  storitev?: string
  datum?: string
  cas?: string
}

export interface SlotsResponse {
  slots: string[]
}

export const DEFAULT_THEME: ApiTheme = {
  primaryColor: '#8B5CF6',
  secondaryColor: '#A78BFA',
  bgFrom: '#7C3AED',
  bgTo: '#4F46E5',
}

// ─── App State Types ────────────────────────────────────────────────────────

export interface BusinessConfig {
  slug: string
  businessName: string
  primaryColor: string
  secondaryColor: string
}

export interface BookingStepConfig {
  id: string
  type: 'service' | 'employee' | 'datetime' | 'info' | 'confirmation'
  title: string
  subtitle?: string
  required: boolean
}

export interface BookingSelection {
  serviceId?: string
  serviceName?: string
  servicePrice?: number
  employeeId?: string | null
  employeeName?: string
  anyPerson: boolean
  eligibleEmployeeIds?: string[]
  date?: string
  time?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: string
  notes: string
  privacyConsent: boolean
  marketingConsent: boolean
}
