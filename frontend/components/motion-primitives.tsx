'use client'

import { motion, useInView } from 'motion/react'
import { useRef, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'section' | 'li' | 'span'
}

export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-pretty font-display text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </Reveal>
  )
}
