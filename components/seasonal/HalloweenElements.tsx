'use client'

import { useEffect, useMemo, useState } from 'react'
import { useIsMobile } from '@/lib/useMediaQuery'

interface Ghost {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

interface Bat {
  id: number
  startX: number
  startY: number
  duration: number
  delay: number
}

interface Pumpkin {
  id: number
  x: number
  y: number
  size: number
  glowDelay: number
}

export default function HalloweenElements() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const ghostCount = isMobile ? 3 : 5
  const batCount = isMobile ? 2 : 4
  const pumpkinCount = isMobile ? 2 : 4

  const ghosts: Ghost[] = useMemo(
    () =>
      Array.from({ length: ghostCount }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 70,
        size: 28 + Math.random() * 20,
        duration: 4 + Math.random() * 3,
        delay: Math.random() * 4,
      })),
    [ghostCount]
  )

  const bats: Bat[] = useMemo(
    () =>
      Array.from({ length: batCount }, (_, i) => ({
        id: i,
        startX: -10,
        startY: 5 + Math.random() * 30,
        duration: 8 + Math.random() * 6,
        delay: Math.random() * 10,
      })),
    [batCount]
  )

  const pumpkins: Pumpkin[] = useMemo(
    () =>
      Array.from({ length: pumpkinCount }, (_, i) => ({
        id: i,
        x: i === 0 ? 2 : i === 1 ? 88 : 5 + Math.random() * 85,
        y: 85 + Math.random() * 10,
        size: 24 + Math.random() * 12,
        glowDelay: Math.random() * 3,
      })),
    [pumpkinCount]
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {/* Floating Ghosts */}
      {ghosts.map((g) => (
        <div
          key={`ghost-${g.id}`}
          className="absolute"
          style={{
            left: `${g.x}%`,
            top: `${g.y}%`,
            fontSize: `${g.size}px`,
            animation: `ghostFloat ${g.duration}s ease-in-out ${g.delay}s infinite`,
          }}
        >
          👻
        </div>
      ))}

      {/* Flying Bats */}
      {bats.map((b) => (
        <div
          key={`bat-${b.id}`}
          className="absolute"
          style={{
            left: `${b.startX}%`,
            top: `${b.startY}%`,
            fontSize: '22px',
            animation: `batFly ${b.duration}s linear ${b.delay}s infinite`,
          }}
        >
          🦇
        </div>
      ))}

      {/* Pumpkins */}
      {pumpkins.map((p) => (
        <div
          key={`pumpkin-${p.id}`}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            animation: `pumpkinGlow 3s ease-in-out ${p.glowDelay}s infinite`,
          }}
        >
          🎃
        </div>
      ))}

      {/* Spider web corners */}
      <div className="absolute top-0 left-0 w-24 h-24 opacity-[0.12]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M0,0 L30,0 Q15,15 0,30 Z" fill="none" stroke="#888" strokeWidth="0.5" />
          <path d="M0,0 L50,0 Q25,25 0,50 Z" fill="none" stroke="#888" strokeWidth="0.5" />
          <path d="M0,0 L70,0 Q35,35 0,70 Z" fill="none" stroke="#888" strokeWidth="0.5" />
          <path d="M0,0 L100,0 Q50,50 0,100 Z" fill="none" stroke="#888" strokeWidth="0.5" />
          {[15, 30, 45, 60, 75, 90].map((r) => (
            <circle key={r} cx="0" cy="0" r={r} fill="none" stroke="#888" strokeWidth="0.3" />
          ))}
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.12] scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M0,0 L30,0 Q15,15 0,30 Z" fill="none" stroke="#888" strokeWidth="0.5" />
          <path d="M0,0 L50,0 Q25,25 0,50 Z" fill="none" stroke="#888" strokeWidth="0.5" />
          <path d="M0,0 L70,0 Q35,35 0,70 Z" fill="none" stroke="#888" strokeWidth="0.5" />
          <path d="M0,0 L100,0 Q50,50 0,100 Z" fill="none" stroke="#888" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Subtle spooky moon */}
      <div
        className="absolute top-6 right-8 w-16 h-16 rounded-full opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, #FFD700 0%, #FFA500 40%, transparent 70%)',
          boxShadow: '0 0 40px 20px rgba(255,165,0,0.08)',
        }}
      />

      <style jsx>{`
        @keyframes ghostFloat {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.25;
          }
          25% {
            transform: translateY(-15px) translateX(10px);
            opacity: 0.45;
          }
          50% {
            transform: translateY(-5px) translateX(-10px);
            opacity: 0.35;
          }
          75% {
            transform: translateY(-20px) translateX(5px);
            opacity: 0.45;
          }
        }
        @keyframes batFly {
          0% {
            transform: translateX(0) translateY(0) scaleX(1);
            opacity: 0;
          }
          5% { opacity: 0.6; }
          25% {
            transform: translateX(30vw) translateY(-30px) scaleX(-1);
          }
          50% {
            transform: translateX(60vw) translateY(20px) scaleX(1);
          }
          75% {
            transform: translateX(90vw) translateY(-20px) scaleX(-1);
          }
          95% { opacity: 0.6; }
          100% {
            transform: translateX(115vw) translateY(10px) scaleX(1);
            opacity: 0;
          }
        }
        @keyframes pumpkinGlow {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(255,102,0,0.3));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(255,102,0,0.6));
          }
        }
      `}</style>
    </div>
  )
}
