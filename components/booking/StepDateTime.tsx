'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SeasonalTheme, BookingSelection, BusinessConfig } from '@/lib/types'
import { getAvailableSlots } from '@/lib/api'
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay, getDay } from 'date-fns'

interface Props {
  seasonalTheme: SeasonalTheme
  businessConfig: BusinessConfig
  selection: BookingSelection
  onUpdate: (data: Partial<BookingSelection>) => void
  onNext: () => void
  onBack: () => void
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function StepDateTime({
  seasonalTheme,
  businessConfig,
  selection,
  onUpdate,
  onNext,
  onBack,
}: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | undefined>(selection.date)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(selection.time)
  const [slots, setSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const today = startOfDay(new Date())

  // Fetch slots when a date is selected
  useEffect(() => {
    if (!selectedDate || !selection.serviceId) return

    setLoadingSlots(true)
    setSlots([])

    getAvailableSlots({
      companySlug: businessConfig.slug,
      date: selectedDate,
      serviceId: selection.serviceId,
      employeeId: selection.anyPerson ? null : (selection.employeeId || null),
      anyPerson: selection.anyPerson,
      employeeIds: selection.anyPerson ? (selection.eligibleEmployeeIds ?? []) : undefined,
    })
      .then((data) => {
        setSlots(data.slots || [])
        setLoadingSlots(false)
      })
      .catch(() => {
        setSlots([])
        setLoadingSlots(false)
      })
  }, [selectedDate, selection.serviceId, selection.employeeId, selection.anyPerson, businessConfig.slug])

  // Calendar grid
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const firstDayOffset = (getDay(monthStart) + 6) % 7

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr)
    setSelectedTime(undefined)
    onUpdate({ date: dateStr, time: undefined })
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    onUpdate({ time })
  }

  const handleContinue = () => {
    if (selectedDate && selectedTime) onNext()
  }

  const pc = businessConfig.primaryColor

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Pick a Date & Time</h2>
      <p className="text-gray-500 text-sm mb-6">Choose when works best for you</p>

      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth((m) => addMonths(m, -1))}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
          disabled={isBefore(endOfMonth(addMonths(currentMonth, -1)), today)}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {Array.from({ length: firstDayOffset }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {daysInMonth.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const isPast = isBefore(day, today)
          const isSelected = selectedDate === dateStr
          const isToday = isSameDay(day, today)

          return (
            <button
              key={dateStr}
              onClick={() => !isPast && handleDateSelect(dateStr)}
              disabled={isPast}
              className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 relative ${
                isPast
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'hover:shadow-sm cursor-pointer'
              }`}
              style={
                isSelected
                  ? { backgroundColor: pc, color: '#fff', boxShadow: `0 2px 12px ${pc}30` }
                  : !isPast
                    ? { color: pc }
                    : {}
              }
            >
              {day.getDate()}
              {isToday && !isSelected && (
                <span
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ backgroundColor: pc }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Time slots */}
      <AnimatePresence mode="wait">
        {selectedDate && loadingSlots && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-4 text-sm text-gray-400"
          >
            Loading available times...
          </motion.div>
        )}

        {selectedDate && !loadingSlots && slots.length > 0 && (
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Available Times for {format(new Date(selectedDate + 'T00:00:00'), 'EEEE, MMM d')}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((time) => {
                const isTimeSelected = selectedTime === time
                return (
                  <motion.button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isTimeSelected
                        ? 'text-white shadow-md'
                        : 'border border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                    style={
                      isTimeSelected
                        ? { backgroundColor: pc, boxShadow: `0 2px 12px ${pc}30` }
                        : {}
                    }
                    whileTap={{ scale: 0.95 }}
                  >
                    {time}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {selectedDate && !loadingSlots && slots.length === 0 && (
          <motion.p
            key="no-slots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-gray-400 py-4"
          >
            No available times for this date. Please try another.
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl text-gray-600 font-semibold text-base border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <motion.button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className="flex-[2] py-4 rounded-2xl text-white font-semibold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: pc,
            boxShadow: selectedDate && selectedTime ? `0 4px 20px ${pc}30` : 'none',
          }}
          whileHover={selectedDate && selectedTime ? { scale: 1.01 } : {}}
          whileTap={selectedDate && selectedTime ? { scale: 0.98 } : {}}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  )
}
