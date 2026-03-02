'use client'

import { useEffect, useMemo, useState } from 'react'
import { useIsMobile } from '@/lib/useMediaQuery'

const eggEmoji = ['🥚', '🐣', '🌷', '🐰']

interface Egg {
  id: number
  x: number
  y: number
  size: number
  emoji: string
  wobbleDelay: number
}

export default function EasterElements() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const eggCount = isMobile ? 5 : 10

  const eggs: Egg[] = useMemo(
    () =>
      Array.from({ length: eggCount }, (_, i) => ({
        id: i,
        x: 3 + Math.random() * 90,
        y: 70 + Math.random() * 25,
        size: 18 + Math.random() * 14,
        emoji: eggEmoji[i % eggEmoji.length],
        wobbleDelay: Math.random() * 4,
      })),
    [eggCount]
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {/* Easter eggs scattered */}
      {eggs.map((e) => (
        <div
          key={`egg-${e.id}`}
          className="absolute"
          style={{
            left: `${e.x}%`,
            top: `${e.y}%`,
            fontSize: `${e.size}px`,
            animation: `eggWobble 3s ease-in-out ${e.wobbleDelay}s infinite`,
            opacity: 0.4,
          }}
        >
          {e.emoji}
        </div>
      ))}

      {/* Pastel overlay dots */}
      {!isMobile &&
        Array.from({ length: 6 }, (_, i) => {
          const colors = ['#FFB7C5', '#B5EAD7', '#C7CEEA', '#FFDAC1', '#E2F0CB', '#F3E5F5']
          return (
            <div
              key={`dot-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${10 + i * 15}%`,
                top: `${5 + (i % 3) * 20}%`,
                width: `${40 + Math.random() * 60}px`,
                height: `${40 + Math.random() * 60}px`,
                background: `radial-gradient(circle, ${colors[i]}20 0%, transparent 70%)`,
                animation: `pastelPulse ${4 + Math.random() * 3}s ease-in-out ${i * 0.5}s infinite`,
              }}
            />
          )
        })}

      {/* Bunny ears accent in corner */}
      <div className="absolute top-4 right-4 text-3xl opacity-[0.12]">🐰</div>

      <style jsx>{`
        @keyframes eggWobble {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes pastelPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
