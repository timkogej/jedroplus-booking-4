'use client'

import { useEffect, useMemo, useState } from 'react'
import { useIsMobile } from '@/lib/useMediaQuery'

const confettiColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']

interface Sparkle {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  color: string
}

interface Bubble {
  id: number
  x: number
  size: number
  duration: number
  delay: number
}

export default function NewYearElements() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sparkleCount = isMobile ? 8 : 18
  const bubbleCount = isMobile ? 4 : 8

  const sparkles: Sparkle[] = useMemo(
    () =>
      Array.from({ length: sparkleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 8 + Math.random() * 14,
        duration: 8 + Math.random() * 8,
        delay: Math.random() * 6,
        color: confettiColors[i % confettiColors.length],
      })),
    [sparkleCount]
  )

  const bubbles: Bubble[] = useMemo(
    () =>
      Array.from({ length: bubbleCount }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        size: 4 + Math.random() * 8,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 4,
      })),
    [bubbleCount]
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {/* Falling confetti / sparkles */}
      {sparkles.map((s) => (
        <div
          key={`sparkle-${s.id}`}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: '-10px',
            width: `${s.size}px`,
            height: `${s.size * 0.6}px`,
            backgroundColor: s.color,
            opacity: 0.5,
            borderRadius: '1px',
            animation: `confettiFall ${s.duration}s linear ${s.delay}s infinite`,
            ['--sway' as string]: `${40 + Math.random() * 60}px`,
          }}
        />
      ))}

      {/* Rising champagne bubbles */}
      {bubbles.map((b) => (
        <div
          key={`bubble-${b.id}`}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            bottom: '-10px',
            width: `${b.size}px`,
            height: `${b.size}px`,
            border: '1px solid rgba(255,215,0,0.3)',
            background: 'rgba(255,215,0,0.08)',
            animation: `bubbleRise ${b.duration}s ease-out ${b.delay}s infinite`,
          }}
        />
      ))}

      {/* Shimmer glitter effect on background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          background:
            'repeating-conic-gradient(rgba(255,215,0,0.2) 0% 25%, transparent 0% 50%) 0 0 / 40px 40px',
          animation: 'glitterShift 3s linear infinite',
        }}
      />

      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% {
            transform: translateY(105vh) translateX(var(--sway, 50px)) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes bubbleRise {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% {
            transform: translateY(-110vh) translateX(10px);
            opacity: 0;
          }
        }
        @keyframes glitterShift {
          from { background-position: 0 0; }
          to { background-position: 40px 40px; }
        }
      `}</style>
    </div>
  )
}
