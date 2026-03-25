'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SeasonalTheme, BookingSelection, BusinessConfig } from '@/lib/types'

interface Props {
  seasonalTheme: SeasonalTheme
  businessConfig: BusinessConfig
  selection: BookingSelection
  onUpdate: (data: Partial<BookingSelection>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepInfo({
  seasonalTheme,
  businessConfig,
  selection,
  onUpdate,
  onNext,
  onBack,
}: Props) {
  const [firstName, setFirstName] = useState(selection.firstName)
  const [lastName, setLastName] = useState(selection.lastName)
  const [email, setEmail] = useState(selection.email)
  const [phone, setPhone] = useState(selection.phone)
  const [gender, setGender] = useState(selection.gender)
  const [notes, setNotes] = useState(selection.notes)
  const [privacyConsent, setPrivacyConsent] = useState(selection.privacyConsent)
  const [marketingConsent, setMarketingConsent] = useState(selection.marketingConsent)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const pc = businessConfig.primaryColor

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!firstName.trim()) errs.firstName = 'First name is required'
    if (!lastName.trim()) errs.lastName = 'Last name is required'
    if (!email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email'
    }
    if (!phone.trim()) errs.phone = 'Phone number is required'
    if (!privacyConsent) errs.privacyConsent = 'Za nadaljevanje se morate strinjati s politiko zasebnosti.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleContinue = () => {
    if (validate()) {
      onUpdate({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender,
        notes: notes.trim(),
        privacyConsent,
        marketingConsent,
      })
      onNext()
    }
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3.5 rounded-2xl border-2 text-gray-800 text-sm outline-none transition-all duration-200 ${
      errors[field] ? 'border-red-300 bg-red-50/50' : 'border-gray-100 focus:bg-white'
    }`

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = pc
    e.target.style.boxShadow = 'none'
  }

  const handleBlur = (field: string) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!errors[field]) {
      e.target.style.borderColor = '#f3f4f6'
      e.target.style.boxShadow = 'none'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Your Information</h2>
      <p className="text-gray-500 text-sm mb-6">We&apos;ll use this to confirm your booking</p>

      <div className="space-y-4">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
                if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }))
              }}
              className={inputClass('firstName')}
              onFocus={handleFocus}
              onBlur={handleBlur('firstName')}
              placeholder="Jane"
            />
            {errors.firstName && (
              <motion.p className="text-xs text-red-500 mt-1" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                {errors.firstName}
              </motion.p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
                if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }))
              }}
              className={inputClass('lastName')}
              onFocus={handleFocus}
              onBlur={handleBlur('lastName')}
              placeholder="Doe"
            />
            {errors.lastName && (
              <motion.p className="text-xs text-red-500 mt-1" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                {errors.lastName}
              </motion.p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
            }}
            className={inputClass('email')}
            onFocus={handleFocus}
            onBlur={handleBlur('email')}
            placeholder="jane@example.com"
          />
          {errors.email && (
            <motion.p className="text-xs text-red-500 mt-1" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }))
            }}
            className={inputClass('phone')}
            onFocus={handleFocus}
            onBlur={handleBlur('phone')}
            placeholder="+386 ..."
          />
          {errors.phone && (
            <motion.p className="text-xs text-red-500 mt-1" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
              {errors.phone}
            </motion.p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Gender</label>
          <div className="flex gap-2">
            {(['Moški', 'Ženska', 'Drugo'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex-1 py-3 rounded-2xl text-sm font-medium border-2 transition-all duration-200 ${
                  gender === g ? 'text-white' : 'border-gray-100 text-gray-600 hover:border-gray-200'
                }`}
                style={
                  gender === g
                    ? { backgroundColor: pc, borderColor: pc }
                    : {}
                }
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Notes (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 text-gray-800 text-sm outline-none transition-all duration-200 resize-none"
            onFocus={handleFocus}
            onBlur={handleBlur('')}
            placeholder="Any special requests or notes..."
          />
        </div>

        {/* Privacy consent - OBVEZEN */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => {
                  setPrivacyConsent(e.target.checked)
                  if (e.target.checked) setErrors((prev) => ({ ...prev, privacyConsent: '' }))
                }}
                className="sr-only"
              />
              <div
                className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                style={{
                  borderColor: errors.privacyConsent ? '#ef4444' : privacyConsent ? pc : '#d1d5db',
                  backgroundColor: privacyConsent ? pc : 'transparent',
                }}
              >
                {privacyConsent && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-500">
              Strinjam se z obdelavo osebnih podatkov za namen rezervacije termina.{' '}
              <a
                href="https://jedroplus.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
                style={{ color: pc }}
              >
                Preberi politiko zasebnosti
              </a>
            </span>
          </label>
          {errors.privacyConsent && (
            <motion.p className="text-xs text-red-500 mt-1 ml-8" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
              {errors.privacyConsent}
            </motion.p>
          )}
        </div>

        {/* Marketing consent - OPCIJSKI */}
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="sr-only"
            />
            <div
              className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
              style={{
                borderColor: marketingConsent ? pc : '#d1d5db',
                backgroundColor: marketingConsent ? pc : 'transparent',
              }}
            >
              {marketingConsent && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-500">
            Želim prejemati obvestila o promocijah in novostih.
          </span>
        </label>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl text-gray-600 font-semibold text-base border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <motion.button
          onClick={handleContinue}
          className="flex-[2] py-4 rounded-2xl text-white font-semibold text-base transition-all duration-200"
          style={{
            backgroundColor: pc,
            boxShadow: `0 4px 20px ${pc}30`,
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          Review Booking
        </motion.button>
      </div>
    </motion.div>
  )
}
