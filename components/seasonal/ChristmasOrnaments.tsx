'use client'

import { useEffect, useMemo, useState } from 'react'
import { useIsMobile } from '@/lib/useMediaQuery'

const ornamentColors = ['#C41E3A', '#FFD700', '#0F5132', '#E8272C', '#B8860B']
const ornamentEmoji = ['🎄', '⭐', '🎁', '🔔', '✨']

interface Ornament {
  id: number
  x: number
  y: number
  size: number
  color: string
  emoji: string
  swingDuration: number
  delay: number
}

export default function ChristmasOrnaments() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const count = isMobile ? 6 : 12

  const ornaments: Ornament[] = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,
        y: -2 + Math.random() * 6,
        size: 18 + Math.random() * 14,
        color: ornamentColors[i % ornamentColors.length],
        emoji: ornamentEmoji[i % ornamentEmoji.length],
        swingDuration: 2 + Math.random() * 2,
        delay: Math.random() * 2,
      })),
    [count]
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {/* Hanging ornaments from top */}
      {ornaments.map((o) => (
        <div
          key={o.id}
          className="absolute"
          style={{
            left: `${o.x}%`,
            top: `${o.y}%`,
            fontSize: `${o.size}px`,
            transformOrigin: 'top center',
            animation: `ornamentSwing ${o.swingDuration}s ease-in-out ${o.delay}s infinite`,
          }}
        >
          <div className="flex flex-col items-center">
            <div
              className="w-px bg-gray-400/30"
              style={{ height: `${10 + Math.random() * 20}px` }}
            />
            <span style={{ filter: `drop-shadow(0 2px 4px ${o.color}40)` }}>
              {o.emoji}
            </span>
          </div>
        </div>
      ))}

      {/* Corner garland decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M0,0 Q50,30 100,0"
            fill="none"
            stroke="#0F5132"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M0,0 Q50,30 100,0"
            fill="none"
            stroke="#C41E3A"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes ornamentSwing {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
      `}</style>
    </div>
  )
}
