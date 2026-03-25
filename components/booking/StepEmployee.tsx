'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { EmployeeUI, SeasonalTheme, BookingSelection, BusinessConfig } from '@/lib/types'

interface Props {
  seasonalTheme: SeasonalTheme
  businessConfig: BusinessConfig
  selection: BookingSelection
  employeesUI: EmployeeUI[]
  eligibleEmployeeIds: string[]
  showBack?: boolean
  onUpdate: (data: Partial<BookingSelection>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepEmployee({
  seasonalTheme,
  businessConfig,
  selection,
  employeesUI,
  eligibleEmployeeIds,
  showBack = true,
  onUpdate,
  onNext,
  onBack,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(
    selection.anyPerson ? 'any' : (selection.employeeId ? String(selection.employeeId) : null)
  )

  // Auto-select if only one eligible employee (guard: skip only on first visit, not when navigating back)
  useEffect(() => {
    if (employeesUI.length === 1 && !selection.employeeId && !selection.anyPerson) {
      onUpdate({
        employeeId: employeesUI[0].id,
        employeeName: employeesUI[0].label,
        anyPerson: false,
        eligibleEmployeeIds,
      })
      onNext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeesUI])

  const handleSelect = (emp: EmployeeUI | 'any') => {
    if (emp === 'any') {
      setSelectedId('any')
      onUpdate({ employeeId: null, employeeName: 'Any Available', anyPerson: true, eligibleEmployeeIds })
    } else {
      setSelectedId(String(emp.id))
      onUpdate({ employeeId: emp.id, employeeName: emp.label, anyPerson: false, eligibleEmployeeIds })
    }
  }

  const handleContinue = () => {
    if (selectedId) onNext()
  }

  const pc = businessConfig.primaryColor

  const avatarDecoration = (() => {
    if (seasonalTheme.holiday === 'christmas') return '🎅'
    if (seasonalTheme.holiday === 'easter') return '🐰'
    if (seasonalTheme.holiday === 'halloween') return '🎃'
    return null
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Choose Your Specialist</h2>
      <p className="text-gray-500 text-sm mb-6">
        Select who you&apos;d like to see, or choose any available
      </p>

      {/* Empty state */}
      {employeesUI.length === 0 && (
        <p className="text-sm text-gray-500 py-4">Za to storitev ni na voljo nobenega osebja.</p>
      )}

      <div className="space-y-3">
        {/* Any available option — only when there are eligible employees */}
        {employeesUI.length > 0 && <motion.button
          onClick={() => handleSelect('any')}
          className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
            selectedId === 'any'
              ? 'shadow-lg'
              : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
          }`}
          style={
            selectedId === 'any'
              ? {
                  borderColor: pc,
                  backgroundColor: `${pc}08`,
                  boxShadow: `0 4px 20px ${pc}15`,
                }
              : {}
          }
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: `${pc}15`, color: pc }}
            >
              {seasonalTheme.holiday === 'easter' ? '🐰' : '✨'}
            </div>
            <div>
              <span className="font-semibold text-gray-800">Any Available</span>
              <p className="text-xs text-gray-400">Find the best appointment for me</p>
            </div>
          </div>
        </motion.button>}

        {employeesUI.map((emp) => {
          const isSelected = selectedId === String(emp.id)
          return (
            <motion.button
              key={emp.id}
              onClick={() => handleSelect(emp)}
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
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: pc }}
                  >
                    {emp.initials}
                  </div>
                  {avatarDecoration && (
                    <span className="absolute -top-1.5 -right-1.5 text-sm transform rotate-12">
                      {avatarDecoration}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{emp.label}</span>
                  {emp.subtitle && (
                    <p className="text-xs text-gray-400">{emp.subtitle}</p>
                  )}
                </div>
                <div
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
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

      <div className="flex gap-3 mt-8">
        {showBack && (
          <button
            onClick={onBack}
            className="flex-1 py-4 rounded-2xl text-gray-600 font-semibold text-base border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        )}
        <motion.button
          onClick={handleContinue}
          disabled={!selectedId || employeesUI.length === 0}
          className="flex-[2] py-4 rounded-2xl text-white font-semibold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: pc,
            boxShadow: selectedId && employeesUI.length > 0 ? `0 4px 20px ${pc}30` : 'none',
          }}
          whileHover={selectedId && employeesUI.length > 0 ? { scale: 1.01 } : {}}
          whileTap={selectedId && employeesUI.length > 0 ? { scale: 0.98 } : {}}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  )
}
