'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getCurrentSeasonalTheme } from '@/lib/seasonDetector'
import { initBooking } from '@/lib/api'
import {
  BookingInitData,
  BookingSelection,
  BookingStepConfig,
  SeasonalTheme,
  BusinessConfig,
} from '@/lib/types'
import SeasonalDecorations from '@/components/seasonal/SeasonalDecorations'
import BookingStepper from '@/components/booking/BookingStepper'
import StepService from '@/components/booking/StepService'
import StepEmployee from '@/components/booking/StepEmployee'
import StepDateTime from '@/components/booking/StepDateTime'
import StepInfo from '@/components/booking/StepInfo'
import StepConfirmation from '@/components/booking/StepConfirmation'

const DEFAULT_STEPS: BookingStepConfig[] = [
  { id: 'employee', type: 'employee', title: 'Specialist', required: true },
  { id: 'service', type: 'service', title: 'Service', required: true },
  { id: 'datetime', type: 'datetime', title: 'Date & Time', required: true },
  { id: 'info', type: 'info', title: 'Your Info', required: true },
  { id: 'confirmation', type: 'confirmation', title: 'Confirm', required: true },
]

const INITIAL_SELECTION: BookingSelection = {
  anyPerson: false,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: '',
  notes: '',
  marketingConsent: false,
}

export default function BookingPage() {
  const params = useParams()
  const slug = params.slug as string

  const [seasonalTheme] = useState<SeasonalTheme>(() => getCurrentSeasonalTheme(new Date()))
  const [initData, setInitData] = useState<BookingInitData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [selection, setSelection] = useState<BookingSelection>(INITIAL_SELECTION)

  useEffect(() => {
    if (!slug) return
    initBooking(slug)
      .then((data) => {
        setInitData(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Business not found or unable to load configuration.')
        setLoading(false)
      })
  }, [slug])

  // Construct BusinessConfig from init data
  const config: BusinessConfig | null = initData
    ? (() => {
        const c = initData.company ?? {}
        const businessName =
          c.naziv ||
          c.bookingName ||
          c.name ||
          (c['Naziv Podjetja'] as string) ||
          slug
        return {
          slug: (c.slug as string) || (c.idPodjetja as string) || slug,
          businessName: businessName as string,
          primaryColor: initData.theme?.primaryColor || '#6366f1',
          secondaryColor: initData.theme?.secondaryColor || '#818cf8',
        }
      })()
    : null

  const steps = DEFAULT_STEPS
  const primaryColor = config?.primaryColor || '#6366f1'

  const updateSelection = useCallback((data: Partial<BookingSelection>) => {
    setSelection((prev) => ({ ...prev, ...data }))
  }, [])

  const goNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1))
  }, [steps.length])

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }, [])

  useEffect(() => {
    if (primaryColor) {
      document.documentElement.style.setProperty('--primary', primaryColor)
    }
  }, [primaryColor])

  const seasonFontClass = seasonalTheme.theme.fontClass

  const renderStep = () => {
    if (!initData || !config) return null

    const step = steps[currentStep]
    const commonProps = {
      seasonalTheme,
      businessConfig: config,
      selection,
      onUpdate: updateSelection,
      onNext: goNext,
      onBack: goBack,
    }

    switch (step.type) {
      case 'service':
        return (
          <StepService
            {...commonProps}
            services={initData.services}
            servicesByCategory={initData.servicesByCategory}
            serviceCategories={initData.serviceCategories}
          />
        )
      case 'employee':
        return (
          <StepEmployee
            {...commonProps}
            employeesUI={initData.employees_ui}
            showBack={currentStep > 0}
          />
        )
      case 'datetime':
        return <StepDateTime {...commonProps} />
      case 'info':
        return <StepInfo {...commonProps} />
      case 'confirmation':
        return <StepConfirmation {...commonProps} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <SeasonalDecorations theme={seasonalTheme} />
        <div className="relative z-10 text-center">
          <motion.div
            className="w-12 h-12 border-3 rounded-full mx-auto mb-4"
            style={{ borderColor: `${primaryColor}30`, borderTopColor: primaryColor }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-gray-400 text-sm">Loading booking page...</p>
        </div>
      </div>
    )
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <SeasonalDecorations theme={seasonalTheme} />
        <div className="relative z-10 text-center px-6">
          <div className="text-5xl mb-4">
            {seasonalTheme.season === 'winter' ? '❄️' : '😔'}
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Oops!</h1>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            {error || 'Something went wrong. Please check the link and try again.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 relative overflow-hidden ${seasonFontClass}`}>
      <SeasonalDecorations theme={seasonalTheme} />

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="pt-8 pb-4 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-2"
              style={{ backgroundColor: `${primaryColor}12`, color: primaryColor }}
            >
              <span>{getSeasonalEmoji(seasonalTheme)}</span>
              <span>{config.businessName}</span>
            </div>
          </motion.div>
        </header>

        <div className="px-4 py-2">
          <BookingStepper
            steps={steps}
            currentStep={currentStep}
            seasonalTheme={seasonalTheme}
            primaryColor={primaryColor}
          />
        </div>

        <main className="flex-1 px-4 pb-8 max-w-lg mx-auto w-full">
          <div
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8"
            style={{
              boxShadow: `0 4px 24px ${primaryColor}08, 0 1px 3px rgba(0,0,0,0.04)`,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <footer className="py-4 text-center">
          <p className="text-xs text-gray-400">
            Powered by{' '}
            <span className="font-semibold" style={{ color: primaryColor }}>
              Jedro+
            </span>
          </p>
        </footer>
      </div>
    </div>
  )
}

function getSeasonalEmoji(theme: SeasonalTheme): string {
  if (theme.holiday === 'christmas') return '🎄'
  if (theme.holiday === 'newyear') return '🎆'
  if (theme.holiday === 'valentine') return '💕'
  if (theme.holiday === 'easter') return '🐣'
  if (theme.holiday === 'halloween') return '🎃'
  if (theme.holiday === 'thanksgiving') return '🦃'
  if (theme.season === 'winter') return '❄️'
  if (theme.season === 'spring') return '🌸'
  if (theme.season === 'summer') return '☀️'
  if (theme.season === 'autumn') return '🍂'
  return '✨'
}
