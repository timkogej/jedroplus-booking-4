'use client'

import { useEffect, useMemo, useState } from 'react'
import { useIsMobile } from '@/lib/useMediaQuery'

const heartEmoji = ['💕', '💖', '💗', '❤️', '💘']

interface Heart {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  sway: number
  emoji: string
  opacity: number
}

export default function FloatingHearts() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const count = isMobile ? 8 : 15

  const hearts: Heart[] = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 16,
        duration: 12 + Math.random() * 10,
        delay: Math.random() * 8,
        sway: 20 + Math.random() * 40,
        emoji: heartEmoji[i % heartEmoji.length],
        opacity: 0.25 + Math.random() * 0.35,
      })),
    [count]
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.left}%`,
            bottom: '-30px',
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            animation: `heartFloat ${h.duration}s ease-in-out ${h.delay}s infinite`,
            ['--sway' as string]: `${h.sway}px`,
          }}
        >
          {h.emoji}
        </div>
      ))}
      <style jsx>{`
        @keyframes heartFloat {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          50% {
            transform: translateY(-55vh) translateX(var(--sway, 30px)) rotate(15deg);
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-110vh) translateX(calc(var(--sway, 30px) * -1)) rotate(-15deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
