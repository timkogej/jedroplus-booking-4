'use client'

import { useEffect, useMemo, useState } from 'react'
import { useIsMobile } from '@/lib/useMediaQuery'

const leafEmoji = ['🍂', '🍁', '🍃', '🍂', '🍁']

interface Leaf {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  sway: number
  emoji: string
  opacity: number
}

export default function FallingLeaves() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const count = isMobile ? 8 : 16

  const leaves: Leaf[] = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 16 + Math.random() * 14,
        duration: 10 + Math.random() * 10,
        delay: Math.random() * 8,
        sway: 40 + Math.random() * 80,
        emoji: leafEmoji[i % leafEmoji.length],
        opacity: 0.35 + Math.random() * 0.35,
      })),
    [count]
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {leaves.map((l) => (
        <div
          key={l.id}
          className="absolute"
          style={{
            left: `${l.left}%`,
            top: '-30px',
            fontSize: `${l.size}px`,
            opacity: l.opacity,
            animation: `leafFall ${l.duration}s ease-in-out ${l.delay}s infinite`,
            ['--sway' as string]: `${l.sway}px`,
          }}
        >
          {l.emoji}
        </div>
      ))}
      <style jsx>{`
        @keyframes leafFall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          25% {
            transform: translateY(25vh) translateX(var(--sway, 50px)) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(calc(var(--sway, 50px) * -0.5)) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(var(--sway, 50px)) rotate(270deg);
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(105vh) translateX(calc(var(--sway, 50px) * -1)) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
