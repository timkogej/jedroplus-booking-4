'use client'

import { useEffect, useMemo, useState } from 'react'
import { useIsMobile } from '@/lib/useMediaQuery'

const harvestEmoji = ['🌽', '🦃', '🌾', '🥧', '🍎']
const leafEmoji = ['🍂', '🍁', '🍃', '🍂', '🍁', '🍁']

export default function ThanksgivingElements() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const leafCount = isMobile ? 10 : 20
  const harvestCount = isMobile ? 3 : 6

  const leaves = useMemo(
    () =>
      Array.from({ length: leafCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 16 + Math.random() * 14,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 8,
        sway: 40 + Math.random() * 80,
        emoji: leafEmoji[i % leafEmoji.length],
        opacity: 0.3 + Math.random() * 0.3,
      })),
    [leafCount]
  )

  const harvests = useMemo(
    () =>
      Array.from({ length: harvestCount }, (_, i) => ({
        id: i,
        x: 5 + (i / harvestCount) * 85,
        y: 82 + Math.random() * 12,
        size: 20 + Math.random() * 12,
        emoji: harvestEmoji[i % harvestEmoji.length],
      })),
    [harvestCount]
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {/* Extra-heavy falling leaves */}
      {leaves.map((l) => (
        <div
          key={`leaf-${l.id}`}
          className="absolute"
          style={{
            left: `${l.left}%`,
            top: '-30px',
            fontSize: `${l.size}px`,
            opacity: l.opacity,
            animation: `tgLeafFall ${l.duration}s ease-in-out ${l.delay}s infinite`,
            ['--sway' as string]: `${l.sway}px`,
          }}
        >
          {l.emoji}
        </div>
      ))}

      {/* Harvest elements along bottom */}
      {harvests.map((h) => (
        <div
          key={`harvest-${h.id}`}
          className="absolute"
          style={{
            left: `${h.x}%`,
            top: `${h.y}%`,
            fontSize: `${h.size}px`,
            opacity: 0.3,
          }}
        >
          {h.emoji}
        </div>
      ))}

      {/* Warm amber glow overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,140,0,0.15) 0%, transparent 60%)',
        }}
      />

      <style jsx>{`
        @keyframes tgLeafFall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.4; }
          25% {
            transform: translateY(25vh) translateX(var(--sway, 50px)) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(calc(var(--sway, 50px) * -0.5)) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(var(--sway, 50px)) rotate(270deg);
          }
          90% { opacity: 0.4; }
          100% {
            transform: translateY(105vh) translateX(calc(var(--sway, 50px) * -1)) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
