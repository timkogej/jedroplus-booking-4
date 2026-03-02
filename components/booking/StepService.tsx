'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Service,
  ServiceCategory,
  ServicesByCategory,
  SeasonalTheme,
  BookingSelection,
  BusinessConfig,
} from '@/lib/types'

interface Props {
  seasonalTheme: SeasonalTheme
  businessConfig: BusinessConfig
  selection: BookingSelection
  services: Service[]
  servicesByCategory: ServicesByCategory
  serviceCategories: ServiceCategory[]
  onUpdate: (data: Partial<BookingSelection>) => void
  onNext: () => void
  onBack: () => void
}

function getServiceName(s: Service): string {
  return s.naziv || s.name || '—'
}

function getServiceDesc(s: Service): string | undefined {
  return s.opis || s.description
}

function getServiceDuration(s: Service): number | undefined {
  return s.trajanjeMin || s.duration
}

function getServicePrice(s: Service): number | undefined {
  const p = s.cena ?? s.price
  if (p == null) return undefined
  const n = Number(p)
  return isNaN(n) ? undefined : n
}

export default function StepService({
  seasonalTheme,
  businessConfig,
  selection,
  services,
  servicesByCategory,
  serviceCategories,
  onUpdate,
  onNext,
  onBack,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | undefined>(selection.serviceId)

  const handleSelect = (service: Service) => {
    setSelectedId(String(service.id))
    onUpdate({ serviceId: String(service.id), serviceName: getServiceName(service), servicePrice: getServicePrice(service) })
  }

  const handleContinue = () => {
    if (selectedId) onNext()
  }

  const pc = businessConfig.primaryColor

  const seasonIcon = (() => {
    if (seasonalTheme.holiday === 'christmas') return '🎁'
    if (seasonalTheme.holiday === 'halloween') return '🎃'
    if (seasonalTheme.holiday === 'valentine') return '💖'
    if (seasonalTheme.holiday === 'easter') return '🥚'
    if (seasonalTheme.season === 'summer') return '☀️'
    return null
  })()

  // Use servicesByCategory if available, otherwise use flat services list
  const hasCategories =
    serviceCategories &&
    serviceCategories.length > 0 &&
    servicesByCategory &&
    Object.keys(servicesByCategory).length > 0

  const categoryEntries: [string, Service[]][] = hasCategories
    ? serviceCategories.map((cat) => [cat.name, servicesByCategory[cat.id] || []])
    : [['Services', services]]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Choose a Service</h2>
      <p className="text-gray-500 text-sm mb-6">Select the service you&apos;d like to book</p>

      <div className="space-y-6">
        {categoryEntries.map(([catName, items]) => (
          <div key={catName}>
            {categoryEntries.length > 1 && (
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {catName}
              </h3>
            )}
            <div className="space-y-3">
              {items.map((service) => {
                const isSelected = selectedId === String(service.id)
                const name = getServiceName(service)
                const desc = getServiceDesc(service)
                const dur = getServiceDuration(service)
                const price = getServicePrice(service)

                return (
                  <motion.button
                    key={service.id}
                    onClick={() => handleSelect(service)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'shadow-lg'
                        : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: pc,
                            backgroundColor: `${pc}08`,
                            boxShadow: `0 4px 20px ${pc}15`,
                          }
                        : {}
                    }
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {seasonIcon && (
                            <span className="text-sm opacity-60">{seasonIcon}</span>
                          )}
                          <span className="font-semibold text-gray-800">{name}</span>
                        </div>
                        {desc && (
                          <p className="text-sm text-gray-500 mt-1">{desc}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          {dur != null && <span>{dur} min</span>}
                          {price != null && (
                            <span className="font-semibold" style={{ color: isSelected ? pc : undefined }}>
                              €{Number(price).toFixed(0)} EUR
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ml-4"
                        style={{
                          borderColor: isSelected ? pc : '#d1d5db',
                          backgroundColor: isSelected ? pc : 'transparent',
                        }}
                      >
                        {isSelected && (
                          <motion.svg
                            className="w-3.5 h-3.5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        )}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
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
          disabled={!selectedId}
          className="flex-[2] py-4 rounded-2xl text-white font-semibold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: pc,
            boxShadow: selectedId ? `0 4px 20px ${pc}30` : 'none',
          }}
          whileHover={selectedId ? { scale: 1.01 } : {}}
          whileTap={selectedId ? { scale: 0.98 } : {}}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  )
}
