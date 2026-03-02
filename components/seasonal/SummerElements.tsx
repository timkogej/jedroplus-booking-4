'use client'

import { useEffect, useState } from 'react'
import { useIsMobile } from '@/lib/useMediaQuery'

export default function SummerElements() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {/* Sun rays from top-right corner */}
      <div
        className="absolute -top-20 -right-20 w-60 h-60 opacity-[0.06]"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, rgba(255,200,50,0.4) 10deg, transparent 20deg, transparent 30deg, rgba(255,200,50,0.3) 40deg, transparent 50deg, transparent 60deg, rgba(255,200,50,0.4) 70deg, transparent 80deg, transparent 90deg, rgba(255,200,50,0.3) 100deg, transparent 110deg, transparent 120deg, rgba(255,200,50,0.4) 130deg, transparent 140deg, transparent 150deg, rgba(255,200,50,0.3) 160deg, transparent 170deg, transparent 180deg, rgba(255,200,50,0.4) 190deg, transparent 200deg, transparent 210deg, rgba(255,200,50,0.3) 220deg, transparent 230deg, transparent 240deg, rgba(255,200,50,0.4) 250deg, transparent 260deg, transparent 270deg, rgba(255,200,50,0.3) 280deg, transparent 290deg, transparent 300deg, rgba(255,200,50,0.4) 310deg, transparent 320deg, transparent 330deg, rgba(255,200,50,0.3) 340deg, transparent 350deg, transparent 360deg)',
          animation: 'rotateSun 60s linear infinite',
          borderRadius: '50%',
        }}
      />

      {/* Warm sun circle */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, #FFD54F 0%, #FFA726 40%, transparent 70%)',
          boxShadow: '0 0 60px 30px rgba(255,213,79,0.05)',
        }}
      />

      {/* Subtle wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 opacity-[0.05]">
        <svg
          viewBox="0 0 1440 100"
          className="w-full h-full"
          preserveAspectRatio="none"
          style={{ animation: 'waveMove 8s ease-in-out infinite' }}
        >
          <path
            d="M0,60 C180,20 360,80 540,50 C720,20 900,80 1080,50 C1260,20 1440,80 1440,60 L1440,100 L0,100 Z"
            fill="rgba(59,130,246,0.4)"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-[0.04]">
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-full"
          preserveAspectRatio="none"
          style={{ animation: 'waveMove 10s ease-in-out infinite reverse' }}
        >
          <path
            d="M0,40 C200,10 400,60 600,30 C800,0 1000,60 1200,30 C1400,0 1440,40 1440,40 L1440,80 L0,80 Z"
            fill="rgba(59,130,246,0.5)"
          />
        </svg>
      </div>

      {/* Heat shimmer / sparkle dots */}
      {!isMobile &&
        Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-yellow-300/30"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${10 + Math.random() * 60}%`,
              animation: `shimmerDot ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 3}s infinite`,
            }}
          />
        ))}

      <style jsx>{`
        @keyframes rotateSun {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes waveMove {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-20px); }
        }
        @keyframes shimmerDot {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.8); }
        }
      `}</style>
    </div>
  )
}
