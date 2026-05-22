"use client"

import { useEffect, useRef, useState } from "react"

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&?*+="

interface ScrambleTextProps {
  text: string
  trigger: number
  className?: string
  style?: React.CSSProperties
}

export function ScrambleText({ text, trigger, className, style }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text)
  const rafRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    frameRef.current = 0
    const chars = text.split("")
    // Each char locks in left-to-right: char i locks at frame (6 + i*2)
    const lockAt = chars.map((ch, i) => (ch === " " ? 0 : 6 + i * 2))
    const totalFrames = (lockAt[lockAt.length - 1] ?? 6) + 8

    const tick = () => {
      frameRef.current++
      const f = frameRef.current

      const next = chars.map((ch, i) => {
        if (ch === " " || ch === "×" || ch === "—") return ch
        if (f >= lockAt[i]) return ch
        return CHARSET[Math.floor(Math.random() * CHARSET.length)]
      })

      setDisplay(next.join(""))

      if (f < totalFrames) {
        timerRef.current = setTimeout(() => {
          rafRef.current = requestAnimationFrame(tick)
        }, 45)
      } else {
        setDisplay(text)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [trigger, text])

  return (
    <span className={className} style={style}>
      {display}
    </span>
  )
}
