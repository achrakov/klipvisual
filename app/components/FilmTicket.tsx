"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { projects, type Project } from "../data/projects"

const CORNER_TRANSFORMS = [
  { top: 0, left: 0, transform: "translate(-50%, -50%)" },
  { top: 0, right: 0, transform: "translate(50%, -50%)" },
  { bottom: 0, left: 0, transform: "translate(-50%, 50%)" },
  { bottom: 0, right: 0, transform: "translate(50%, 50%)" },
]

interface FilmTicketProps {
  active: Project
  activeIndex: number
  onSelect: (i: number) => void
  menuOpen: boolean
  onMenuToggle: () => void
}

export function FilmTicket({ active, activeIndex, onSelect, menuOpen, onMenuToggle }: FilmTicketProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="fixed top-4 right-4 z-[8500]">
      <div
        style={{
          background: "#f5f0e8",
          borderRadius: 8,
          position: "relative",
          border: "1px solid rgba(0,0,0,0.12)",
          fontFamily: "var(--font-space-mono)",
          minWidth: 200,
        }}
      >
        {/* Corner punch holes */}
        {CORNER_TRANSFORMS.map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#080808",
              ...pos,
            }}
          />
        ))}

        {/* Main row: thumbnail + name + chevron | burger */}
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {/* Film name / dropdown trigger */}
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 hover:bg-black/5 transition-colors"
            style={{ padding: "8px 10px", flex: 1, borderRadius: "8px 0 0 0", minWidth: 0 }}
          >
            {/* Thumbnail */}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 4,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={active.cover}
                alt={active.shortTitle}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Name */}
            <span
              style={{
                fontSize: 9,
                fontWeight: "bold",
                color: "#080808",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 110,
                flex: 1,
              }}
            >
              {active.shortTitle}
            </span>

            {/* Chevron */}
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              style={{
                flexShrink: 0,
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <path d="M1 2.5L4 5.5L7 2.5" stroke="#080808" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Divider */}
          <div style={{ width: 1, background: "rgba(0,0,0,0.1)", alignSelf: "stretch" }} />

          {/* Burger button */}
          <button
            onClick={onMenuToggle}
            aria-label="Toggle menu"
            className="flex flex-col items-center justify-center gap-[3.5px] hover:bg-black/5 transition-colors"
            style={{ padding: "8px 12px", borderRadius: "0 8px 0 0" }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 15,
                  height: 1.5,
                  background: menuOpen ? "rgba(0,0,0,0.25)" : "#080808",
                  borderRadius: 1,
                  transition: "background 0.2s",
                }}
              />
            ))}
          </button>
        </div>

        {/* Metadata strip */}
        <div
          style={{
            borderTop: "1px solid rgba(0,0,0,0.08)",
            padding: "4px 12px",
            display: "flex",
            gap: 6,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 7.5, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {active.category.split("+")[0].trim()}
          </span>
          <span style={{ fontSize: 7.5, color: "rgba(0,0,0,0.2)" }}>·</span>
          <span style={{ fontSize: 7.5, color: "rgba(0,0,0,0.4)", letterSpacing: "0.1em" }}>
            {active.year}
          </span>
        </div>

        {/* Dropdown list */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                overflow: "hidden",
                borderTop: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "0 0 8px 8px",
                maxHeight: 260,
              }}
            >
              <div style={{ overflowY: "auto", maxHeight: 260 }}>
                {projects.map((p, i) => (
                  <button
                    key={p.slug}
                    onClick={() => { onSelect(i); setDropdownOpen(false) }}
                    className="w-full flex items-center gap-2 hover:bg-black/5 transition-colors text-left"
                    style={{ padding: "7px 12px" }}
                  >
                    <div style={{ width: 26, height: 26, borderRadius: 3, overflow: "hidden", flexShrink: 0 }}>
                      <img src={p.cover} alt={p.shortTitle} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <span
                      style={{
                        fontSize: 8.5,
                        color: "#080808",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontWeight: i === activeIndex ? "bold" : "normal",
                        flex: 1,
                      }}
                    >
                      {p.shortTitle}
                    </span>
                    {i === activeIndex && (
                      <span style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", flexShrink: 0 }}>•</span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
