'use client'

import { useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

interface CounterProps {
  end: number
  duration?: number
  start?: number
}

export function Counter({ end, duration = 2.5, start = 0 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(start)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!isInView || hasStarted.current) return

    hasStarted.current = true
    let animationFrameId: number

    const animate = (progress: number) => {
      const currentCount = Math.floor(start + (end - start) * progress)
      setCount(currentCount)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(() => {
          animate(Math.min(progress + 1 / (duration * 60), 1))
        })
      } else {
        setCount(end)
      }
    }

    animate(0)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isInView, end, duration, start])

  return <span ref={ref}>{count}</span>
}
