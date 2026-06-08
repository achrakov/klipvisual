"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    // No custom cursor on touch devices: skip the rAF loop + MutationObserver entirely.
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
      dot.style.display = "none"
      return
    }

    let mouseX = 0
    let mouseY = 0
    let curX = 0
    let curY = 0
    let raf: number

    const move = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const tick = () => {
      curX += (mouseX - curX) * 0.15
      curY += (mouseY - curY) * 0.15
      dot.style.transform = `translate(${curX - dot.offsetWidth / 2}px, ${curY - dot.offsetHeight / 2}px)`
      raf = requestAnimationFrame(tick)
    }

    const onEnterLink = () => dot.classList.add("cursor-link")
    const onLeaveLink = () => dot.classList.remove("cursor-link")
    const onEnterHover = () => dot.classList.add("cursor-hover")
    const onLeaveHover = () => dot.classList.remove("cursor-hover")

    window.addEventListener("mousemove", move)
    raf = requestAnimationFrame(tick)

    const bindHovers = () => {
      document.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink)
        el.addEventListener("mouseleave", onLeaveLink)
      })
      document.querySelectorAll("[data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", onEnterHover)
        el.addEventListener("mouseleave", onLeaveHover)
      })
    }

    bindHovers()

    const observer = new MutationObserver(bindHovers)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("mousemove", move)
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
}
