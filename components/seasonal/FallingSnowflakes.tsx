'use client'

import { useEffect, useMemo, useState } from 'react'
import { useIsMobile } from '@/lib/useMediaQuery'

interface Flake {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  sway: number
  opacity: number
}

export default function FallingSnowflakes() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const count = isMobile ? 10 : 20

  const flakes: Flake[] = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 12,
        duration: 10 + Math.random() * 12,
        delay: Math.random() * 8,
        sway: 30 + Math.random() * 60,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    [count]
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {flakes.map((f) => (
        <div
          key={f.id}
          className="absolute snowflake"
          style={{
            left: `${f.left}%`,
            top: '-20px',
            fontSize: `${f.size}px`,
            opacity: f.opacity,
            animation: `snowfall ${f.duration}s linear ${f.delay}s infinite`,
            ['--sway' as string]: `${f.sway}px`,
          }}
        >
          ❄
        </div>
      ))}
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--opacity, 0.5);
          }
          90% {
            opacity: var(--opacity, 0.5);
          }
          100% {
            transform: translateY(105vh) translateX(var(--sway, 40px)) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
