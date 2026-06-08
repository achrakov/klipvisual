"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LoadingIntroProps {
  onComplete: () => void
}

export function LoadingIntro({ onComplete }: LoadingIntroProps) {
  const [visible, setVisible] = useState(true)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (entered) {
      const t = setTimeout(() => setVisible(false), 600)
      return () => clearTimeout(t)
    }
  }, [entered])

  const handleEnter = () => {
    if (entered) return
    setEntered(true)
    setTimeout(onComplete, 500)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9000] overflow-hidden bg-[#080808]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Full-screen video — object-fit: cover fills every pixel */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            src="/logo%20opener/KLIP_Opener.mp4"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />

          {/* Vignette bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(8,8,8,0.75) 0%, transparent 50%)",
            }}
          />

          {/* ENTER button — bottom center */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={handleEnter}
              disabled={entered}
              className="group flex items-stretch overflow-hidden disabled:opacity-40"
              style={{
                border: "1px solid rgba(240,237,232,0.5)",
                backdropFilter: "blur(4px)",
              }}
            >
              <span className="relative overflow-hidden px-14 py-[18px]">
                <span
                  className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ background: "#f0ede8" }}
                />
                <span
                  className="relative z-10 group-hover:text-[#080808] transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: "0.5em",
                    color: "#f0ede8",
                  }}
                >
                  {entered ? "Loading…" : "Enter"}
                </span>
              </span>

              <span
                className="flex-shrink-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{ width: 1, background: "rgba(240,237,232,0.4)" }}
              />

              <span className="relative overflow-hidden px-8 py-[18px] flex items-center justify-center">
                <span
                  className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ background: "#f0ede8" }}
                />
                <span
                  className="relative z-10 group-hover:text-[#080808] transition-colors duration-300 text-lg leading-none"
                  style={{ color: "#f0ede8" }}
                >
                  →
                </span>
              </span>
            </button>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px]"
            style={{ background: "#E8181C" }}
            initial={{ width: "0%" }}
            animate={{ width: entered ? "100%" : "0%" }}
            transition={{ duration: entered ? 0.9 : 0, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
