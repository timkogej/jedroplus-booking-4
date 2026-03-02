'use client'

import { useEffect, useMemo, useState } from 'react'
import { useIsMobile } from '@/lib/useMediaQuery'

const flowerEmoji = ['🌸', '🌺', '🌼', '🌷', '💮']
const butterflyEmoji = ['🦋']

interface Flower {
  id: number
  x: number
  y: number
  size: number
  emoji: string
  duration: number
  delay: number
}

interface Butterfly {
  id: number
  startX: number
  startY: number
  duration: number
  delay: number
}

export default function SpringFlowers({ showButterflies = true }: { showButterflies?: boolean }) {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const flowerCount = isMobile ? 6 : 12
  const butterflyCount = isMobile ? 1 : 3

  const flowers: Flower[] = useMemo(
    () =>
      Array.from({ length: flowerCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 16 + Math.random() * 14,
        emoji: flowerEmoji[i % flowerEmoji.length],
        duration: 15 + Math.random() * 10,
        delay: Math.random() * 5,
      })),
    [flowerCount]
  )

  const butterflies: Butterfly[] = useMemo(
    () =>
      Array.from({ length: butterflyCount }, (_, i) => ({
        id: i,
        startX: -5 + Math.random() * 20,
        startY: 20 + Math.random() * 50,
        duration: 15 + Math.random() * 10,
        delay: Math.random() * 8,
      })),
    [butterflyCount]
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {/* Floating petals / flowers */}
      {flowers.map((f) => (
        <div
          key={`flower-${f.id}`}
          className="absolute"
          style={{
            left: `${f.x}%`,
            top: '-20px',
            fontSize: `${f.size}px`,
            opacity: 0.35,
            animation: `petalDrift ${f.duration}s ease-in-out ${f.delay}s infinite`,
            ['--sway' as string]: `${30 + Math.random() * 50}px`,
          }}
        >
          {f.emoji}
        </div>
      ))}

      {/* Butterflies */}
      {showButterflies &&
        butterflies.map((b) => (
          <div
            key={`butterfly-${b.id}`}
            className="absolute"
            style={{
              left: `${b.startX}%`,
              top: `${b.startY}%`,
              fontSize: '24px',
              animation: `butterflyFly ${b.duration}s ease-in-out ${b.delay}s infinite`,
            }}
          >
            {butterflyEmoji[0]}
          </div>
        ))}

      {/* Corner vine decorations */}
      <div className="absolute bottom-0 left-0 text-4xl opacity-[0.12] transform rotate-12">
        🌿
      </div>
      <div className="absolute bottom-0 right-0 text-4xl opacity-[0.12] transform -rotate-12 scale-x-[-1]">
        🌿
      </div>

      <style jsx>{`
        @keyframes petalDrift {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.35; }
          50% {
            transform: translateY(50vh) translateX(var(--sway, 40px)) rotate(180deg);
          }
          90% { opacity: 0.35; }
          100% {
            transform: translateY(105vh) translateX(calc(var(--sway, 40px) * -1)) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes butterflyFly {
          0% {
            transform: translateX(0) translateY(0) scaleX(1);
            opacity: 0;
          }
          5% { opacity: 0.6; }
          20% {
            transform: translateX(20vw) translateY(-30px) scaleX(-1);
          }
          40% {
            transform: translateX(40vw) translateY(20px) scaleX(1);
          }
          60% {
            transform: translateX(60vw) translateY(-15px) scaleX(-1);
          }
          80% {
            transform: translateX(80vw) translateY(10px) scaleX(1);
          }
          95% { opacity: 0.6; }
          100% {
            transform: translateX(110vw) translateY(-20px) scaleX(-1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
