'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getCurrentSeasonalTheme } from '@/lib/seasonDetector'
import SeasonalDecorations from '@/components/seasonal/SeasonalDecorations'

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">
      {children}
    </span>
  )
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}

function TrendingUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  )
}

function PaletteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  )
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M3 5h4"/>
      <path d="M19 17v4"/><path d="M17 19h4"/>
    </svg>
  )
}

const cards = [
  {
    icon: <CalendarIcon />,
    title: 'Book in a few clicks',
    body: (
      <>
        Schedule an appointment in a few clicks —{' '}
        <GradientText>anywhere</GradientText>, <GradientText>anytime</GradientText>.{' '}
        Simple for clients, powerful for your business.
      </>
    ),
  },
  {
    icon: <TrendingUpIcon />,
    title: 'Grow effortlessly',
    body: <>Fewer calls. More bookings. 24/7 scheduling. Professional impression.</>,
  },
  {
    icon: <PaletteIcon />,
    title: 'Your brand, your design',
    body: (
      <>
        Choose your <GradientText>style</GradientText>. Set{' '}
        <GradientText>colors</GradientText> that match your{' '}
        <GradientText>brand</GradientText> — and let the platform handle the rest.
      </>
    ),
  },
  {
    icon: <SparklesIcon />,
    title: 'Built for conversion',
    body: (
      <>
        Create a booking <GradientText>experience</GradientText> that brings your
        clients from discovery to reservation — seamlessly.
      </>
    ),
  },
]

export default function HomePage() {
  const [theme] = useState(() => getCurrentSeasonalTheme(new Date()))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex items-center justify-center">
      <SeasonalDecorations theme={theme} />
      {/* Glow effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-2xl w-full py-16 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero */}
          <h1 className="text-5xl md:text-7xl font-bold mb-5 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Jedro+
            </span>{' '}
            <span className="text-white">booking platform</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/70 mb-12 font-normal">
            A modern appointment scheduling platform for your business.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-4 text-left">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm"
              >
                <div className="text-violet-400 mb-3">{card.icon}</div>
                <h3 className="font-semibold text-white mb-2 text-sm">{card.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 text-xs text-white/30"
        >
          Powered by{' '}
          <a
            href="https://jedroplus.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white/50 hover:text-white/80 transition-colors"
          >
            Jedro+
          </a>
        </motion.p>
      </div>
    </div>
  )
}
