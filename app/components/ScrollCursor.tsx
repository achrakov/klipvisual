"use client"

import { useEffect, useRef } from "react"

interface ScrollCursorProps {
  containerRef: React.RefObject<HTMLElement | null>
  label?: string
}

export function ScrollCursor({ containerRef, label = "SCROLL" }: ScrollCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const visible = useRef(false)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const dot = dotRef.current
    if (!container || !dot) return

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onEnter = () => {
      visible.current = true
      dot.style.opacity = "1"
    }

    const onLeave = () => {
      visible.current = false
      dot.style.opacity = "0"
    }

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18
      pos.current.y += (target.current.y - pos.current.y) * 0.18
      if (visible.current) {
        dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`
      }
      raf.current = requestAnimationFrame(animate)
    }

    container.addEventListener("mousemove", onMove)
    container.addEventListener("mouseenter", onEnter)
    container.addEventListener("mouseleave", onLeave)
    raf.current = requestAnimationFrame(animate)

    return () => {
      container.removeEventListener("mousemove", onMove)
      container.removeEventListener("mouseenter", onEnter)
      container.removeEventListener("mouseleave", onLeave)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [containerRef])

  return (
    <div
      ref={dotRef}
      className="absolute top-0 left-0 pointer-events-none z-30"
      style={{ opacity: 0, transition: "opacity 0.25s ease", willChange: "transform" }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.55)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(2px)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: 8,
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.8)",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
