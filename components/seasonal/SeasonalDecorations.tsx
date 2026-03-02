'use client'

import { SeasonalTheme } from '@/lib/types'
import dynamic from 'next/dynamic'

const FallingSnowflakes = dynamic(() => import('./FallingSnowflakes'), { ssr: false })
const FloatingHearts = dynamic(() => import('./FloatingHearts'), { ssr: false })
const FallingLeaves = dynamic(() => import('./FallingLeaves'), { ssr: false })
const ChristmasOrnaments = dynamic(() => import('./ChristmasOrnaments'), { ssr: false })
const HalloweenElements = dynamic(() => import('./HalloweenElements'), { ssr: false })
const SpringFlowers = dynamic(() => import('./SpringFlowers'), { ssr: false })
const SummerElements = dynamic(() => import('./SummerElements'), { ssr: false })
const EasterElements = dynamic(() => import('./EasterElements'), { ssr: false })
const NewYearElements = dynamic(() => import('./NewYearElements'), { ssr: false })
const ThanksgivingElements = dynamic(() => import('./ThanksgivingElements'), { ssr: false })

export default function SeasonalDecorations({ theme }: { theme: SeasonalTheme }) {
  return (
    <>
      {/* Season overlay tint */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundColor: theme.theme.overlayColor }}
      />

      {/* Seasonal decoration layers */}
      {theme.theme.snowflakes && <FallingSnowflakes />}
      {theme.theme.hearts && <FloatingHearts />}
      {theme.theme.leaves && !theme.theme.harvest && <FallingLeaves />}
      {theme.theme.ornaments && <ChristmasOrnaments />}
      {theme.theme.pumpkins && <HalloweenElements />}
      {theme.theme.flowers && !theme.holiday && <SpringFlowers showButterflies={theme.theme.butterflies} />}
      {theme.theme.sunRays && <SummerElements />}
      {theme.holiday === 'easter' && <EasterElements />}
      {theme.holiday === 'newyear' && <NewYearElements />}
      {theme.holiday === 'thanksgiving' && <ThanksgivingElements />}
      {theme.holiday === 'valentine' && <SpringFlowers showButterflies={false} />}
    </>
  )
}
