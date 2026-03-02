'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SeasonalTheme, BookingSelection, BusinessConfig } from '@/lib/types'
import { createBooking } from '@/lib/api'
import SuccessAnimation from '@/components/seasonal/SuccessAnimations'

interface Props {
  seasonalTheme: SeasonalTheme
  businessConfig: BusinessConfig
  selection: BookingSelection
  onUpdate: (data: Partial<BookingSelection>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepConfirmation({
  seasonalTheme,
  businessConfig,
  selection,
  onBack,
}: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    if (confirmed) {
      const timer = setTimeout(() => setContentVisible(true), 1600)
      return () => clearTimeout(timer)
    }
  }, [confirmed])

  const pc = businessConfig.primaryColor

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await createBooking({
        companySlug: businessConfig.slug,
        date: selection.date!,
        time: selection.time!,
        serviceId: selection.serviceId!,
        employeeId: selection.anyPerson ? null : (selection.employeeId || null),
        anyPerson: selection.anyPerson,
        firstName: selection.firstName,
        lastName: selection.lastName,
        email: selection.email,
        phone: selection.phone,
        gender: selection.gender,
        notes: selection.notes,
        marketingConsent: selection.marketingConsent,
      })
      setConfirmed(true)
      setShowSuccess(true)
    } catch {
      setError('Failed to confirm booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const seasonalCheckIcon = (() => {
    if (seasonalTheme.holiday === 'christmas') return '🎄'
    if (seasonalTheme.holiday === 'valentine') return '💖'
    if (seasonalTheme.holiday === 'easter') return '🐣'
    if (seasonalTheme.holiday === 'halloween') return '🎃'
    if (seasonalTheme.season === 'summer') return '☀️'
    if (seasonalTheme.season === 'spring') return '🌸'
    if (seasonalTheme.season === 'autumn') return '🍂'
    return '✨'
  })()

  const fullName = `${selection.firstName} ${selection.lastName}`.trim()

  const handleAddToCalendar = () => {
    if (!selection.date || !selection.time) return

    const [hours, minutes] = selection.time.split(':').map(Number)
    const startDate = new Date(selection.date)
    startDate.setHours(hours, minutes, 0, 0)

    // Default 60 min duration
    const endDate = new Date(startDate)
    endDate.setMinutes(endDate.getMinutes() + 60)

    const formatGoogleDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d{3}/g, '')

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `${selection.serviceName} - ${businessConfig.businessName}`
    )}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(
      endDate
    )}&details=${encodeURIComponent(
      `Booking at ${businessConfig.businessName}\nService: ${selection.serviceName}\nSpecialist: ${selection.employeeName}`
    )}`

    window.open(googleCalendarUrl, '_blank')
  }

  const handleShare = async () => {
    const text = `Booking at ${businessConfig.businessName}\n${selection.serviceName}\n${selection.date} at ${selection.time}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Booking',
          text,
        })
      } catch {
        // Share cancelled
      }
    } else {
      await navigator.clipboard.writeText(text)
      alert('Booking details copied to clipboard!')
    }
  }

  if (confirmed) {
    return (
      <>
        <SuccessAnimation
          theme={seasonalTheme}
          show={showSuccess}
          primaryColor={pc}
        />
        {contentVisible && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <motion.div
              className="text-5xl mb-4"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              {seasonalCheckIcon}
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 text-sm mb-6">
              We&apos;ve sent a confirmation email to{' '}
              <span className="font-medium text-gray-700">{selection.email}</span>
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 text-left max-w-sm mx-auto">
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Service</span>
                  <p className="text-sm font-semibold text-gray-800">{selection.serviceName}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">With</span>
                  <p className="text-sm font-semibold text-gray-800">{selection.employeeName}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">When</span>
                  <p className="text-sm font-semibold text-gray-800">
                    {selection.date} at {selection.time}
                  </p>
                </div>
                {selection.servicePrice != null && (
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Price</span>
                    <p className="text-sm font-semibold text-gray-800">
                      €{Number(selection.servicePrice).toFixed(0)} EUR
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar & Share buttons */}
            <div className="flex gap-3 mt-6 max-w-sm mx-auto">
              <motion.button
                onClick={handleAddToCalendar}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="12" y1="14" x2="12" y2="18" />
                  <line x1="10" y1="16" x2="14" y2="16" />
                </svg>
                Add to Calendar
              </motion.button>
              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share
              </motion.button>
            </div>
          </motion.div>
        )}
      </>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Confirm Your Booking</h2>
      <p className="text-gray-500 text-sm mb-6">Please review the details below</p>

      {/* Summary card */}
      <div
        className="rounded-2xl p-6 mb-6 border-2"
        style={{ borderColor: `${pc}20`, backgroundColor: `${pc}05` }}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ backgroundColor: `${pc}15` }}
            >
              {seasonalTheme.holiday === 'christmas' ? '🎁' : '💼'}
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Service</span>
              <p className="font-semibold text-gray-800">{selection.serviceName || '—'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ backgroundColor: `${pc}15` }}
            >
              {seasonalTheme.holiday === 'christmas' ? '🎅' : '👤'}
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Specialist</span>
              <p className="font-semibold text-gray-800">{selection.employeeName || '—'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ backgroundColor: `${pc}15` }}
            >
              📅
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Date & Time</span>
              <p className="font-semibold text-gray-800">
                {selection.date} at {selection.time}
              </p>
            </div>
          </div>

          {selection.servicePrice != null && (
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ backgroundColor: `${pc}15` }}
              >
                💳
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Price</span>
                <p className="font-semibold text-gray-800">
                  €{Number(selection.servicePrice).toFixed(0)} EUR
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ backgroundColor: `${pc}15` }}
              >
                📋
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Your Details</span>
                <p className="font-semibold text-gray-800">{fullName}</p>
                <p className="text-sm text-gray-500">{selection.email}</p>
                <p className="text-sm text-gray-500">{selection.phone}</p>
                {selection.notes && (
                  <p className="text-sm text-gray-400 mt-1 italic">&ldquo;{selection.notes}&rdquo;</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl mb-4"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex-1 py-4 rounded-2xl text-gray-600 font-semibold text-base border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <motion.button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-[2] py-4 rounded-2xl text-white font-semibold text-base transition-all duration-200 disabled:opacity-70"
          style={{
            backgroundColor: pc,
            boxShadow: `0 4px 20px ${pc}30`,
          }}
          whileHover={!submitting ? { scale: 1.01 } : {}}
          whileTap={!submitting ? { scale: 0.98 } : {}}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              Confirming...
            </span>
          ) : (
            'Confirm Booking'
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
