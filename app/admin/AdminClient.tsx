"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

/* ── Types ─────────────────────────────────────────────── */
type ThemeMedia = { cover?: string | null; images?: string[] }
type ImagePos = { x: number; y: number; scale?: number; panX?: number; panY?: number }
type MediaEntry = {
  cover?: string
  poster?: string
  posters?: string[]
  gallery?: string[]
  stills?: string[]
  albums?: string[][]
  themes?: ThemeMedia[]
  reels?: Array<{ videoId?: string; cover?: string }>
  recipeReels?: Array<{ videoId?: string; cover?: string }>
  videoCovers?: string[]
  videoIds?: string[]
  pitchDecks?: Array<{ cover?: string; client?: string; industry?: string; year?: string; slides?: string[] }>
  videoUrl?: string
  creditsCover?: string
  workCover?: string
  resultsBg?: string
  results?: Array<{ stat: string; label: string }>
  imagePositions?: Record<string, ImagePos>
}
type MediaState = Record<string, MediaEntry>

type ProjectMeta = {
  slug: string
  shortTitle: string
  cover: string
  category: string
  year: string
  albumLabels?: string[]
  themeNames?: string[]
  themeAspectRatios?: string[]
  reelCount?: number
  recipeReelCount?: number
  videoTalents?: Array<{ talent: string; role: string; cover: string }>
  pitchDeckNames?: string[]
  hasMainVideo?: boolean
  hasGallery?: boolean
  galleryLandscape?: boolean
  concertLayout?: boolean
  editorialLayout?: boolean
  hasPoster?: boolean
  hasPosters?: boolean
  hasResults?: boolean
  defaultResults?: Array<{ stat: string; label: string }>
}

/* ── Helpers ────────────────────────────────────────────── */
function slugSection(section: string, idx?: number) {
  return idx !== undefined ? `${section}-${idx}` : section
}

/* ── Concert slot metadata (mirrors CONCERT_GRID in ProjectClient) ── */
const CONCERT_SLOTS = [
  { label: "Wide 16:9",  shape: "W", aspectRatio: "5/2"  },
  { label: "Landscape",  shape: "L", aspectRatio: "6/5"  },
  { label: "Landscape",  shape: "L", aspectRatio: "4/3"  },
  { label: "Landscape",  shape: "L", aspectRatio: "4/3"  },
  { label: "Landscape",  shape: "L", aspectRatio: "4/3"  },
  { label: "Landscape",  shape: "L", aspectRatio: "6/5"  },
  { label: "Wide 16:9",  shape: "W", aspectRatio: "5/2"  },
  { label: "Full Width", shape: "W", aspectRatio: "21/4" },
  { label: "Portrait",   shape: "P", aspectRatio: "9/10" },
  { label: "Portrait",   shape: "P", aspectRatio: "9/10" },
  { label: "Portrait",   shape: "P", aspectRatio: "9/10" },
  { label: "Full Width", shape: "W", aspectRatio: "21/4" },
]

/* ── ConcertGridMap ─────────────────────────────────────── */
function ConcertGridMap({ filled }: { filled: number }) {
  const cells = [
    { col: "1 / 3", row: "1", slot: 1 },
    { col: "3",     row: "1", slot: 2 },
    { col: "1",     row: "2", slot: 3 },
    { col: "2",     row: "2", slot: 4 },
    { col: "3",     row: "2", slot: 5 },
    { col: "1",     row: "3", slot: 6 },
    { col: "2 / 4", row: "3", slot: 7 },
    { col: "1 / 4", row: "4", slot: 8 },
    { col: "1",     row: "5", slot: 9 },
    { col: "2",     row: "5", slot: 10 },
    { col: "3",     row: "5", slot: 11 },
    { col: "1 / 4", row: "6", slot: 12 },
  ]
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
        Grid Layout — upload order matches slot numbers
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(6, 20px)", gap: 2, width: 180 }}>
        {cells.map(({ col, row, slot }) => {
          const done = slot <= filled
          return (
            <div
              key={slot}
              style={{
                gridColumn: col, gridRow: row,
                background: done ? "rgba(232,24,28,0.25)" : "#1a1a1a",
                border: done ? "1px solid rgba(232,24,28,0.5)" : "1px solid #2a2a2a",
                borderRadius: 2,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 7, color: done ? "#E8181C" : "#3a3a3a" }}>{slot}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── ImageGrid ──────────────────────────────────────────── */
function ImageGrid({
  images,
  onUpload,
  onReorder,
  onDelete,
  onPosition,
  positions,
  slotLabels,
}: {
  images: string[]
  onUpload: (files: FileList) => void
  onReorder: (next: string[]) => void
  onDelete: (i: number) => void
  onPosition?: (src: string, aspectRatio?: string) => void
  positions?: Record<string, ImagePos>
  slotLabels?: Array<{ label: string; shape: string; aspectRatio?: string }>
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const finishDrag = useCallback(() => {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      const next = [...images]
      const [item] = next.splice(dragIdx, 1)
      next.splice(overIdx, 0, item)
      onReorder(next)
    }
    setDragIdx(null)
    setOverIdx(null)
  }, [dragIdx, overIdx, images, onReorder])

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: 6,
      }}
    >
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          draggable
          onDragStart={() => setDragIdx(i)}
          onDragEnter={(e) => { e.preventDefault(); setOverIdx(i) }}
          onDragOver={(e) => e.preventDefault()}
          onDragEnd={finishDrag}
          style={{
            position: "relative",
            aspectRatio: "1",
            background: "#111",
            border: overIdx === i && dragIdx !== i
              ? "2px solid #E8181C"
              : "1px solid #1e1e1e",
            opacity: dragIdx === i ? 0.35 : 1,
            cursor: "grab",
            overflow: "hidden",
            borderRadius: 4,
          }}
        >
          <img
            src={src}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: positions?.[src] ? `${positions[src].x}% ${positions[src].y}%` : "center", display: "block" }}
            draggable={false}
          />
          {/* Focal point indicator dot */}
          {positions?.[src] && (
            <div style={{ position: "absolute", left: `${positions[src].x}%`, top: `${positions[src].y}%`, width: 6, height: 6, borderRadius: "50%", border: "1.5px solid #E8181C", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
          )}
          {/* Slot label badge */}
          {slotLabels?.[i] && (
            <div style={{ position: "absolute", top: 5, left: 5, display: "flex", flexDirection: "column", gap: 1, pointerEvents: "none" }}>
              <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 7, letterSpacing: "0.05em", color: "#fff", background: "rgba(0,0,0,0.75)", padding: "1px 4px", borderRadius: 2, lineHeight: 1.5 }}>
                #{i + 1}
              </span>
              <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 7, letterSpacing: "0.05em", color: "#E8181C", background: "rgba(0,0,0,0.75)", padding: "1px 4px", borderRadius: 2, lineHeight: 1.5 }}>
                {slotLabels[i].label}
              </span>
            </div>
          )}
          {/* Drag dots */}
          <div style={{ position: "absolute", bottom: 5, left: 5, display: "flex", gap: 2, pointerEvents: "none" }}>
            {[0, 1].map((col) => (
              <div key={col} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[0, 1, 2].map((row) => (
                  <div key={row} style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "rgba(255,255,255,0.45)" }} />
                ))}
              </div>
            ))}
          </div>
          {/* Focal point button */}
          {onPosition && (
            <button
              onClick={(e) => { e.stopPropagation(); onPosition(src, slotLabels?.[i]?.aspectRatio) }}
              title="Adjust focal point"
              style={{
                position: "absolute", bottom: 5, right: 5,
                width: 20, height: 20, borderRadius: 3,
                background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.7)",
                fontSize: 11, lineHeight: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer",
              }}
            >
              ⊹
            </button>
          )}
          {/* Delete */}
          <button
            onClick={() => onDelete(i)}
            style={{
              position: "absolute", top: 5, right: 5,
              width: 20, height: 20, borderRadius: "50%",
              background: "rgba(232,24,28,0.9)", color: "#fff",
              fontSize: 14, lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", cursor: "pointer",
              fontWeight: 300,
            }}
          >
            ×
          </button>
        </div>
      ))}

      {/* Add button */}
      <button
        onClick={() => inputRef.current?.click()}
        style={{
          aspectRatio: "1",
          border: "1px dashed #2a2a2a",
          background: "transparent",
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          cursor: "pointer",
          color: "#444",
          transition: "border-color 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8181C"; (e.currentTarget as HTMLButtonElement).style.color = "#E8181C" }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLButtonElement).style.color = "#444" }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 7, textTransform: "uppercase", letterSpacing: "0.25em" }}>
          Add
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => e.target.files && onUpload(e.target.files)}
      />
    </div>
  )
}

/* ── PositionEditor ─────────────────────────────────────── */
function PositionEditor({
  src,
  aspectRatio,
  initial,
  onSave,
  onClose,
}: {
  src: string
  aspectRatio: string
  initial: ImagePos
  onSave: (pos: ImagePos) => void
  onClose: () => void
}) {
  // objX/objY = objectPosition 0-100, scale = zoom multiplier ≥1
  const [objX, setObjX] = useState(initial.x ?? 50)
  const [objY, setObjY] = useState(initial.y ?? 50)
  const [scale, setScale] = useState(initial.scale ?? 1)
  const [dragging, setDragging] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const lastPt = useRef<{ x: number; y: number } | null>(null)
  const scaleRef = useRef(scale)
  scaleRef.current = scale

  /* Pan — drag adjusts objectPosition (works at any zoom level) */
  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => {
      if (!lastPt.current || !frameRef.current) return
      const rect = frameRef.current.getBoundingClientRect()
      const dx = e.clientX - lastPt.current.x
      const dy = e.clientY - lastPt.current.y
      lastPt.current = { x: e.clientX, y: e.clientY }
      const sensitivity = 1 / scaleRef.current
      setObjX(v => Math.min(100, Math.max(0, v - (dx / rect.width) * 100 * sensitivity)))
      setObjY(v => Math.min(100, Math.max(0, v - (dy / rect.height) * 100 * sensitivity)))
    }
    const onUp = () => { setDragging(false); lastPt.current = null }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp) }
  }, [dragging])

  /* Scroll-to-zoom */
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      setScale(prev => Math.min(4, Math.max(1, parseFloat((prev - e.deltaY * 0.003).toFixed(3)))))
    }
    frame.addEventListener("wheel", onWheel, { passive: false })
    return () => frame.removeEventListener("wheel", onWheel)
  }, [])

  /* Keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    document.body.classList.add("overlay-open")
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.classList.remove("overlay-open")
    }
  }, [onClose])

  const btnStyle = (color = "#555"): React.CSSProperties => ({
    fontFamily: "var(--font-space-mono)", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase",
    padding: "8px 14px", border: "1px solid #2a2a2a", background: "transparent", color, cursor: "pointer", borderRadius: 3,
  })

  const stepScale = (delta: number) => {
    setScale(prev => Math.min(4, Math.max(1, parseFloat((prev + delta).toFixed(2)))))
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.93)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ width: "100%", maxWidth: 680, display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 48px)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexShrink: 0 }}>
          <div>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, color: "#E8181C", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 4 }}>
              Reposition Image
            </p>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#444", letterSpacing: "0.12em" }}>
              Scroll to zoom · Drag to pan
            </p>
          </div>
          <button onClick={onClose} style={{ color: "#555", background: "none", border: "none", fontSize: 22, cursor: "pointer", lineHeight: 1, fontWeight: 300 }}>×</button>
        </div>

        {/* Frame */}
        <div
          ref={frameRef}
          onMouseDown={(e) => {
            e.preventDefault()
            setDragging(true)
            lastPt.current = { x: e.clientX, y: e.clientY }
          }}
          className={`pos-editor-frame${dragging ? " dragging" : ""}`}
          style={{ aspectRatio, overflow: "hidden", borderRadius: 6, border: "1px solid #2a2a2a", userSelect: "none", position: "relative", maxHeight: "calc(100vh - 180px)", width: "100%", flexShrink: 1 }}
        >
          <img
            src={src}
            alt=""
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: `${objX.toFixed(2)}% ${objY.toFixed(2)}%`,
              transform: scale !== 1 ? `scale(${scale})` : undefined,
              transformOrigin: `${objX.toFixed(2)}% ${objY.toFixed(2)}%`,
              display: "block",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, flexShrink: 0 }}>
          {/* Pan + zoom display */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#444", letterSpacing: "0.1em" }}>
              {`x ${Math.round(objX)}% · y ${Math.round(objY)}%`}
            </p>
            <div style={{ width: 1, height: 10, background: "#2a2a2a" }} />
            <button onClick={() => stepScale(-0.1)} style={{ ...btnStyle(), padding: "4px 9px", fontSize: 12 }}>−</button>
            <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#555", minWidth: 36, textAlign: "center" }}>{Math.round(scale * 100)}%</span>
            <button onClick={() => stepScale(0.1)} style={{ ...btnStyle(), padding: "4px 9px", fontSize: 12 }}>+</button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setObjX(50); setObjY(50); setScale(1) }} style={btnStyle()}>Reset</button>
            <button onClick={onClose} style={btnStyle("#888")}>Cancel</button>
            <button
              onClick={() => {
                onSave({ x: Math.round(objX * 10) / 10, y: Math.round(objY * 10) / 10, scale: parseFloat(scale.toFixed(2)) })
                onClose()
              }}
              style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", padding: "8px 18px", border: "none", background: "#E8181C", color: "#fff", cursor: "pointer", borderRadius: 3 }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── SectionCard ────────────────────────────────────────── */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #1e1e1e",
        borderRadius: 8,
        padding: "20px 22px",
        marginBottom: 16,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: 9,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#555",
          marginBottom: 14,
        }}
      >
        {title}
      </p>
      {children}
    </div>
  )
}

/* ── SingleImageSlot ────────────────────────────────────── */
function SingleImageSlot({
  current,
  label,
  sublabel,
  onUpload,
  onClear,
  onPosition,
  position,
}: {
  current?: string | null
  label: string
  sublabel?: string
  onUpload: (files: FileList) => void
  onClear: () => void
  onPosition?: () => void
  position?: ImagePos
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {/* Preview / upload zone */}
      <div
        onClick={() => !current && inputRef.current?.click()}
        style={{
          width: 100,
          height: 70,
          borderRadius: 6,
          overflow: "hidden",
          border: current ? "1px solid #2a2a2a" : "1px dashed #2a2a2a",
          flexShrink: 0,
          position: "relative",
          cursor: current ? "default" : "pointer",
          background: "#0f0f0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {current ? (
          <>
            <img src={current} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position ? `${position.x}% ${position.y}%` : "center" }} />
            <button
              onClick={(e) => { e.stopPropagation(); onClear() }}
              style={{ position: "absolute", top: 4, right: 4, width: 18, height: 18, borderRadius: "50%", background: "rgba(232,24,28,0.9)", color: "#fff", fontSize: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >×</button>
            {onPosition && (
              <button
                onClick={(e) => { e.stopPropagation(); onPosition() }}
                title="Adjust focal point"
                style={{ position: "absolute", bottom: 4, right: 4, width: 18, height: 18, borderRadius: 3, background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.7)", fontSize: 10, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >⊹</button>
            )}
          </>
        ) : (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10h12" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Labels + swap button */}
      <div>
        <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, color: "#f0ede8", letterSpacing: "0.05em", marginBottom: 3 }}>
          {label}
        </p>
        {sublabel && (
          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 7.5, color: "#555", letterSpacing: "0.08em", marginBottom: 8 }}>
            {sublabel}
          </p>
        )}
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: 7.5,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "4px 10px",
            border: "1px solid #2a2a2a",
            background: "transparent",
            color: "#888",
            cursor: "pointer",
            borderRadius: 3,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8181C"; (e.currentTarget as HTMLButtonElement).style.color = "#E8181C" }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLButtonElement).style.color = "#888" }}
        >
          {current ? "Replace" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => e.target.files && onUpload(e.target.files)}
        />
      </div>
    </div>
  )
}

/* ── Main AdminClient ────────────────────────────────────── */
export default function AdminClient({
  projects,
  initialMedia,
}: {
  projects: ProjectMeta[]
  initialMedia: Record<string, unknown>
}) {
  const [selected, setSelected] = useState(projects[0]?.slug ?? "")
  const [media, setMedia] = useState<MediaState>(initialMedia as MediaState)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<Record<string, number>>({})
  const [posEditor, setPosEditor] = useState<{ src: string; aspectRatio: string } | null>(null)

  const project = projects.find((p) => p.slug === selected)!
  const pm = media[selected] ?? {}

  /* Save to server */
  const persist = useCallback(async (next: MediaState) => {
    setMedia(next)
    await fetch("/api/admin/media", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }, [])

  /* Upload files */
  const upload = useCallback(async (
    files: FileList,
    slug: string,
    section: string,
    sectionIdx?: number,
  ) => {
    setUploading(true)
    const paths: string[] = []
    for (const file of Array.from(files)) {
      const form = new FormData()
      form.append("file", file)
      form.append("slug", slug)
      form.append("section", slugSection(section, sectionIdx))
      const res = await fetch("/api/admin/upload", { method: "POST", body: form })
      const { path } = await res.json()
      paths.push(path)
    }
    setUploading(false)

    const current: MediaState = { ...media, [slug]: { ...media[slug] } }
    if (section === "gallery") {
      current[slug].gallery = [...(current[slug].gallery ?? []), ...paths]
    } else if (section === "stills") {
      current[slug].stills = [...(current[slug].stills ?? []), ...paths]
    } else if (section === "album" && sectionIdx !== undefined) {
      const albums = [...(current[slug].albums ?? [])]
      while (albums.length <= sectionIdx) albums.push([])
      albums[sectionIdx] = [...(albums[sectionIdx] ?? []), ...paths]
      current[slug].albums = albums
    } else if (section === "theme" && sectionIdx !== undefined) {
      const themes = [...(current[slug].themes ?? [])]
      while (themes.length <= sectionIdx) themes.push({})
      themes[sectionIdx] = { ...themes[sectionIdx], images: [...(themes[sectionIdx]?.images ?? []), ...paths] }
      current[slug].themes = themes
    } else if (section === "theme-cover" && sectionIdx !== undefined) {
      const themes = [...(current[slug].themes ?? [])]
      while (themes.length <= sectionIdx) themes.push({})
      themes[sectionIdx] = { ...themes[sectionIdx], cover: paths[0] }
      current[slug].themes = themes
    } else if (section === "reel-cover" && sectionIdx !== undefined) {
      const reels = [...(current[slug].reels ?? [])]
      while (reels.length <= sectionIdx) reels.push({})
      reels[sectionIdx] = { ...reels[sectionIdx], cover: paths[0] }
      current[slug].reels = reels
    } else if (section === "recipe-reel-cover" && sectionIdx !== undefined) {
      const rr = [...(current[slug].recipeReels ?? [])]
      while (rr.length <= sectionIdx) rr.push({})
      rr[sectionIdx] = { ...rr[sectionIdx], cover: paths[0] }
      current[slug].recipeReels = rr
    } else if (section === "poster") {
      current[slug].poster = paths[0]
    } else if (section === "posters") {
      current[slug].posters = [...(current[slug].posters ?? []), ...paths]
    }

    await persist(current)
  }, [media, persist])

  /* Reorder */
  const reorder = useCallback(async (
    slug: string,
    section: string,
    sectionIdx: number | undefined,
    next: string[],
  ) => {
    const current: MediaState = { ...media, [slug]: { ...media[slug] } }
    if (section === "gallery") {
      current[slug].gallery = next
    } else if (section === "stills") {
      current[slug].stills = next
    } else if (section === "album" && sectionIdx !== undefined) {
      const albums = [...(current[slug].albums ?? [])]
      albums[sectionIdx] = next
      current[slug].albums = albums
    } else if (section === "theme" && sectionIdx !== undefined) {
      const themes = [...(current[slug].themes ?? [])]
      themes[sectionIdx] = { ...themes[sectionIdx], images: next }
      current[slug].themes = themes
    } else if (section === "posters") {
      current[slug].posters = next
    }
    await persist(current)
  }, [media, persist])

  /* Delete */
  const remove = useCallback(async (
    slug: string,
    section: string,
    sectionIdx: number | undefined,
    imgIdx: number,
  ) => {
    const current: MediaState = { ...media, [slug]: { ...media[slug] } }
    if (section === "gallery") {
      current[slug].gallery = current[slug].gallery?.filter((_, i) => i !== imgIdx)
    } else if (section === "stills") {
      current[slug].stills = current[slug].stills?.filter((_, i) => i !== imgIdx)
    } else if (section === "album" && sectionIdx !== undefined) {
      const albums = [...(current[slug].albums ?? [])]
      albums[sectionIdx] = albums[sectionIdx]?.filter((_, i) => i !== imgIdx) ?? []
      current[slug].albums = albums
    } else if (section === "theme" && sectionIdx !== undefined) {
      const themes = [...(current[slug].themes ?? [])]
      themes[sectionIdx] = { ...themes[sectionIdx], images: themes[sectionIdx]?.images?.filter((_, i) => i !== imgIdx) ?? [] }
      current[slug].themes = themes
    } else if (section === "reel-cover" && sectionIdx !== undefined) {
      const reels = [...(current[slug].reels ?? [])]
      if (reels[sectionIdx]) reels[sectionIdx] = { ...reels[sectionIdx], cover: undefined }
      current[slug].reels = reels
    } else if (section === "recipe-reel-cover" && sectionIdx !== undefined) {
      const rr = [...(current[slug].recipeReels ?? [])]
      if (rr[sectionIdx]) rr[sectionIdx] = { ...rr[sectionIdx], cover: undefined }
      current[slug].recipeReels = rr
    } else if (section === "poster") {
      delete current[slug].poster
    } else if (section === "posters") {
      current[slug].posters = (current[slug].posters ?? []).filter((_, i) => i !== imgIdx)
    }
    await persist(current)
  }, [media, persist])

  /* Replace single image (project cover or video card cover) */
  const replaceSingle = useCallback(async (
    files: FileList,
    slug: string,
    field: "cover" | "videoCovers",
    idx?: number,
  ) => {
    setUploading(true)
    const file = files[0]
    const form = new FormData()
    form.append("file", file)
    form.append("slug", slug)
    form.append("section", field === "cover" ? "cover" : `video-${idx ?? 0}`)
    const res = await fetch("/api/admin/upload", { method: "POST", body: form })
    const { path } = await res.json()
    setUploading(false)

    const current: MediaState = { ...media, [slug]: { ...media[slug] } }
    if (field === "cover") {
      current[slug].cover = path
    } else if (field === "videoCovers" && idx !== undefined) {
      const vc = [...(current[slug].videoCovers ?? [])]
      while (vc.length <= idx) vc.push("")
      vc[idx] = path
      current[slug].videoCovers = vc
    }
    await persist(current)
  }, [media, persist])

  /* Clear single image override */
  const clearSingle = useCallback(async (
    slug: string,
    field: "cover" | "videoCovers",
    idx?: number,
  ) => {
    const current: MediaState = { ...media, [slug]: { ...media[slug] } }
    if (field === "cover") {
      delete current[slug].cover
    } else if (field === "videoCovers" && idx !== undefined) {
      const vc = [...(current[slug].videoCovers ?? [])]
      vc[idx] = ""
      current[slug].videoCovers = vc
    }
    await persist(current)
  }, [media, persist])

  /* Reel video ID */
  const updateReelId = useCallback(async (slug: string, idx: number, videoId: string) => {
    const current: MediaState = { ...media, [slug]: { ...media[slug] } }
    const reels = [...(current[slug].reels ?? Array.from({ length: project.reelCount ?? 0 }, () => ({})))]
    while (reels.length <= idx) reels.push({})
    reels[idx] = { ...reels[idx], videoId }
    current[slug].reels = reels
    await persist(current)
  }, [media, persist, project])

  /* Recipe reel video ID */
  const updateRecipeReelId = useCallback(async (slug: string, idx: number, videoId: string) => {
    const current: MediaState = { ...media, [slug]: { ...media[slug] } }
    const rr = [...(current[slug].recipeReels ?? Array.from({ length: project.recipeReelCount ?? 0 }, () => ({})))]
    while (rr.length <= idx) rr.push({})
    rr[idx] = { ...rr[idx], videoId }
    current[slug].recipeReels = rr
    await persist(current)
  }, [media, persist, project])

  /* Talent card video ID */
  const updateVideoId = useCallback(async (slug: string, idx: number, videoId: string) => {
    const current: MediaState = { ...media, [slug]: { ...media[slug] } }
    const ids = [...(current[slug].videoIds ?? [])]
    while (ids.length <= idx) ids.push("")
    ids[idx] = videoId
    current[slug].videoIds = ids
    await persist(current)
  }, [media, persist])

  /* Pitch deck slides */
  const uploadDeckSlides = useCallback(async (files: FileList, slug: string, deckIdx: number) => {
    setUploading(true)
    const paths: string[] = []
    for (const file of Array.from(files)) {
      const form = new FormData()
      form.append("file", file)
      form.append("slug", slug)
      form.append("section", `deck-${deckIdx}`)
      const res = await fetch("/api/admin/upload", { method: "POST", body: form })
      const { path } = await res.json()
      paths.push(path)
    }
    setUploading(false)
    const current: MediaState = { ...media, [slug]: { ...media[slug] } }
    const decks = [...(current[slug].pitchDecks ?? [])]
    while (decks.length <= deckIdx) decks.push({})
    decks[deckIdx] = { ...decks[deckIdx], slides: [...(decks[deckIdx]?.slides ?? []), ...paths] }
    current[slug].pitchDecks = decks
    await persist(current)
  }, [media, persist])

  const reorderDeckSlides = useCallback(async (slug: string, deckIdx: number, next: string[]) => {
    const current: MediaState = { ...media, [slug]: { ...media[slug] } }
    const decks = [...(current[slug].pitchDecks ?? [])]
    decks[deckIdx] = { ...decks[deckIdx], slides: next }
    current[slug].pitchDecks = decks
    await persist(current)
  }, [media, persist])

  const removeDeckSlide = useCallback(async (slug: string, deckIdx: number, imgIdx: number) => {
    const current: MediaState = { ...media, [slug]: { ...media[slug] } }
    const decks = [...(current[slug].pitchDecks ?? [])]
    decks[deckIdx] = { ...decks[deckIdx], slides: decks[deckIdx]?.slides?.filter((_, i) => i !== imgIdx) ?? [] }
    current[slug].pitchDecks = decks
    await persist(current)
  }, [media, persist])

  const updateDeckMeta = useCallback(async (slug: string, deckIdx: number, field: string, value: string) => {
    const current: MediaState = { ...media, [slug]: { ...media[slug] } }
    const decks = [...(current[slug].pitchDecks ?? [])]
    while (decks.length <= deckIdx) decks.push({})
    decks[deckIdx] = { ...decks[deckIdx], [field]: value }
    current[slug].pitchDecks = decks
    await persist(current)
  }, [media, persist])

  /* Main video ID (single-reel projects like JIDAR) */
  const updateMainVideoId = useCallback(async (slug: string, videoId: string) => {
    const current: MediaState = { ...media, [slug]: { ...media[slug], videoUrl: videoId } }
    await persist(current)
  }, [media, persist])

  /* Save focal point position for an image */
  const savePosition = useCallback(async (src: string, pos: ImagePos) => {
    const current: MediaState = {
      ...media,
      [selected]: {
        ...media[selected],
        imagePositions: { ...(media[selected]?.imagePositions ?? {}), [src]: pos },
      },
    }
    await persist(current)
  }, [media, selected, persist])

  const openPos = useCallback((src: string, aspectRatio: string) => {
    setPosEditor({ src, aspectRatio })
  }, [])

  /* Edit a single result stat or label */
  const updateResult = useCallback(async (idx: number, field: "stat" | "label", value: string) => {
    const defaults = project.defaultResults ?? []
    const current = pm.results ?? defaults.map(d => ({ ...d }))
    const next = [...current]
    while (next.length <= idx) next.push({ stat: "", label: "" })
    next[idx] = { ...next[idx], [field]: value }
    await persist({ ...media, [selected]: { ...media[selected], results: next } })
  }, [media, pm.results, project.defaultResults, selected, persist])

  const galleryImages = pm.gallery ?? []
  const albumTab = activeTab[`album-${selected}`] ?? 0
  const themeTab = activeTab[`theme-${selected}`] ?? 0
  const deckTab = activeTab[`deck-${selected}`] ?? 0
  const positions = pm.imagePositions ?? {}

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", color: "#f0ede8" }}>

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          borderRight: "1px solid #1a1a1a",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid #1a1a1a" }}>
          <Image
            src="/Logos/Logo.png"
            alt="KLIPVISUAL"
            width={110}
            height={28}
            style={{ height: 28, width: "auto", objectFit: "contain", marginBottom: 6 }}
          />
          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, letterSpacing: "0.3em", color: "#E8181C", textTransform: "uppercase" }}>
            Admin
          </p>
        </div>

        {/* Project list */}
        <nav style={{ flex: 1, padding: "10px 0" }}>
          {projects.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelected(p.slug)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 18px",
                background: "transparent",
                border: "none",
                borderLeft: selected === p.slug ? "2px solid #E8181C" : "2px solid transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (selected !== p.slug) (e.currentTarget as HTMLButtonElement).style.background = "#111" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent" }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
                <img src={p.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: 9,
                  color: selected === p.slug ? "#f0ede8" : "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {p.shortTitle}
                </p>
                <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 7.5, color: "#444", letterSpacing: "0.05em", marginTop: 2 }}>
                  {p.year}
                </p>
              </div>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "14px 18px", borderTop: "1px solid #1a1a1a" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: 8,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#555",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────── */}
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto", maxWidth: 960 }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, color: "#555", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 4 }}>
              {project.category.split("+")[0].trim()} · {project.year}
            </p>
            <h1 style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.01em", textTransform: "uppercase", lineHeight: 1 }}>
              {project.shortTitle}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {uploading && (
              <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#E8181C", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Uploading...
              </span>
            )}
            {saved && !uploading && (
              <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#4caf50", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Saved ✓
              </span>
            )}
          </div>
        </div>

        {/* ── Project Cover ───────────────────────────────── */}
        <SectionCard title="Project Cover">
          <SingleImageSlot
            current={pm.cover ?? project.cover}
            label="Main cover image"
            sublabel="Hero + homepage card"
            onUpload={(files) => replaceSingle(files, selected, "cover")}
            onClear={() => clearSingle(selected, "cover")}
            onPosition={() => { const src = pm.cover ?? project.cover; openPos(src, "16/9") }}
            position={positions[pm.cover ?? project.cover]}
          />
        </SectionCard>

        {/* ── Work Page Card ──────────────────────────────── */}
        <SectionCard title="Work Page Card">
          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#444", marginBottom: 14, lineHeight: 1.7 }}>
            Portrait card shown in the /work carousel. Independent from the project cover.
          </p>
          <SingleImageSlot
            current={pm.workCover ?? null}
            label="Work page card image"
            sublabel="Portrait format — /work carousel"
            onUpload={async (files) => {
              setUploading(true)
              const form = new FormData()
              form.append("file", files[0])
              form.append("slug", selected)
              form.append("section", "work-cover")
              const res = await fetch("/api/admin/upload", { method: "POST", body: form })
              const { path } = await res.json()
              setUploading(false)
              const next: MediaState = { ...media, [selected]: { ...media[selected], workCover: path } }
              await persist(next)
            }}
            onClear={async () => {
              const next: MediaState = { ...media, [selected]: { ...media[selected], workCover: undefined } }
              await persist(next)
            }}
            onPosition={pm.workCover ? () => openPos(pm.workCover!, "1/1.635") : undefined}
            position={pm.workCover ? positions[pm.workCover] : undefined}
          />
        </SectionCard>

        {/* ── Main Video ID (single-reel projects: JIDAR, Boudchart, etc.) ── */}
        {project.hasMainVideo && (
          <SectionCard title="Main Video">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 6, background: "#E8181C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="14" height="16" viewBox="0 0 18 20" fill="none">
                  <path d="M1 1L17 10L1 19V1Z" fill="white" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
                  YouTube Video ID
                </p>
                <input
                  type="text"
                  placeholder="e.g. dQw4w9WgXcQ"
                  defaultValue={pm.videoUrl ?? ""}
                  onBlur={(e) => updateMainVideoId(selected, e.target.value.trim())}
                  style={{
                    width: "100%",
                    background: "#0f0f0f",
                    border: "1px solid #2a2a2a",
                    borderRadius: 4,
                    padding: "9px 12px",
                    color: "#f0ede8",
                    fontFamily: "var(--font-space-mono)",
                    fontSize: 10,
                    letterSpacing: "0.05em",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E8181C" }}
                  onBlurCapture={(e) => { (e.target as HTMLInputElement).style.borderColor = "#2a2a2a" }}
                />
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 7.5, color: "#333", marginTop: 10, letterSpacing: "0.1em" }}>
              Paste the YouTube video ID only (not the full URL). Tab out to save.
            </p>
          </SectionCard>
        )}

        {/* ── Talent / Video Card Covers ───────────────────── */}
        {project.videoTalents && project.videoTalents.length > 0 && (
          <SectionCard title="Talent Card Covers &amp; Videos">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {project.videoTalents.map((v, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", paddingBottom: 18, borderBottom: "1px solid #1a1a1a" }}>
                  <SingleImageSlot
                    current={pm.videoCovers?.[i] || v.cover}
                    label={v.talent}
                    sublabel={v.role}
                    onUpload={(files) => replaceSingle(files, selected, "videoCovers", i)}
                    onClear={() => clearSingle(selected, "videoCovers", i)}
                    onPosition={() => { const src = pm.videoCovers?.[i] || v.cover; openPos(src, "16/9") }}
                    position={positions[pm.videoCovers?.[i] || v.cover]}
                  />
                  {/* YouTube ID */}
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 7.5, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
                      YouTube ID
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. dQw4w9WgXcQ"
                      defaultValue={pm.videoIds?.[i] ?? ""}
                      onBlur={(e) => updateVideoId(selected, i, e.target.value.trim())}
                      style={{
                        width: "100%",
                        background: "#0f0f0f",
                        border: "1px solid #2a2a2a",
                        borderRadius: 4,
                        padding: "7px 10px",
                        color: "#f0ede8",
                        fontFamily: "var(--font-space-mono)",
                        fontSize: 9,
                        letterSpacing: "0.05em",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E8181C" }}
                      onBlurCapture={(e) => { (e.target as HTMLInputElement).style.borderColor = "#2a2a2a" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 7.5, color: "#333", marginTop: 6, letterSpacing: "0.1em" }}>
              Tab out of the ID field to save. Leave blank if no video yet.
            </p>
          </SectionCard>
        )}

        {/* ── Pitch Decks ─────────────────────────────────── */}
        {project.pitchDeckNames && project.pitchDeckNames.length > 0 && (
          <SectionCard title="Pitch Decks">
            {/* Tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
              {project.pitchDeckNames.map((name, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab((t) => ({ ...t, [`deck-${selected}`]: i }))}
                  style={{
                    fontFamily: "var(--font-space-mono)", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase",
                    padding: "5px 14px", border: deckTab === i ? "1px solid #E8181C" : "1px solid #2a2a2a",
                    color: deckTab === i ? "#f0ede8" : "#555", background: "transparent", cursor: "pointer", borderRadius: 3, transition: "all 0.15s",
                  }}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Deck metadata row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
              {[
                { field: "client", placeholder: "Client name" },
                { field: "industry", placeholder: "Industry (e.g. Food & Bev)" },
                { field: "year", placeholder: "Year (e.g. 2024)" },
              ].map(({ field, placeholder }) => (
                <div key={field}>
                  <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 7.5, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 5 }}>
                    {field}
                  </p>
                  <input
                    key={`${selected}-${deckTab}-${field}`}
                    type="text"
                    placeholder={placeholder}
                    defaultValue={(pm.pitchDecks?.[deckTab] as Record<string, string> | undefined)?.[field] ?? ""}
                    onBlur={(e) => updateDeckMeta(selected, deckTab, field, e.target.value.trim())}
                    style={{ width: "100%", background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: 4, padding: "7px 10px", color: "#f0ede8", fontFamily: "var(--font-space-mono)", fontSize: 9, outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E8181C" }}
                    onBlurCapture={(e) => { (e.target as HTMLInputElement).style.borderColor = "#2a2a2a" }}
                  />
                </div>
              ))}
            </div>

            {/* Slides grid */}
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
              Slides (drag to reorder — first slide becomes the card cover)
            </p>
            <ImageGrid
              images={pm.pitchDecks?.[deckTab]?.slides ?? []}
              onUpload={(files) => uploadDeckSlides(files, selected, deckTab)}
              onReorder={(next) => reorderDeckSlides(selected, deckTab, next)}
              onDelete={(i) => removeDeckSlide(selected, deckTab, i)}
              onPosition={(src) => openPos(src, "16/9")}
              positions={positions}
            />
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 7.5, color: "#333", marginTop: 10, letterSpacing: "0.1em" }}>
              Upload slides as images (PNG/JPG). Tab out of text fields to save.
            </p>
          </SectionCard>
        )}

        {/* ── Credits Photo ───────────────────────────────── */}
        <SectionCard title="Credits Photo">
          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#444", marginBottom: 14, lineHeight: 1.7 }}>
            This photo appears in the credits section of the project page.
          </p>
          <SingleImageSlot
            current={pm.creditsCover ?? null}
            label="Credits section photo"
            sublabel="Left column of the credits block"
            onUpload={async (files) => {
              setUploading(true)
              const form = new FormData()
              form.append("file", files[0])
              form.append("slug", selected)
              form.append("section", "credits-cover")
              const res = await fetch("/api/admin/upload", { method: "POST", body: form })
              const { path } = await res.json()
              setUploading(false)
              const next: MediaState = { ...media, [selected]: { ...media[selected], creditsCover: path } }
              await persist(next)
            }}
            onClear={async () => {
              const next: MediaState = { ...media, [selected]: { ...media[selected], creditsCover: undefined } }
              await persist(next)
            }}
            onPosition={pm.creditsCover ? () => openPos(pm.creditsCover!, "4/3") : undefined}
            position={pm.creditsCover ? positions[pm.creditsCover] : undefined}
          />
        </SectionCard>

        {/* ── Results Section ─────────────────────────────── */}
        {project.hasResults && (
          <SectionCard title="Results Section">
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#444", marginBottom: 16, lineHeight: 1.7 }}>
              Background image and stats shown in the results section. Tab out of each field to save.
            </p>

            {/* Background image */}
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Background Image</p>
            <SingleImageSlot
              current={pm.resultsBg ?? null}
              label="Results background"
              sublabel="Full-bleed image behind the stats (defaults to project cover)"
              onUpload={async (files) => {
                setUploading(true)
                const form = new FormData()
                form.append("file", files[0])
                form.append("slug", selected)
                form.append("section", "results-bg")
                const res = await fetch("/api/admin/upload", { method: "POST", body: form })
                const { path } = await res.json()
                setUploading(false)
                await persist({ ...media, [selected]: { ...media[selected], resultsBg: path } })
              }}
              onClear={async () => {
                await persist({ ...media, [selected]: { ...media[selected], resultsBg: undefined } })
              }}
              onPosition={pm.resultsBg ? () => openPos(pm.resultsBg!, "16/9") : undefined}
              position={pm.resultsBg ? positions[pm.resultsBg] : undefined}
            />

            {/* Editable stats */}
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>Stats</p>
              {(project.defaultResults ?? []).map((def, i) => {
                const current = pm.results?.[i] ?? def
                const inputStyle = { flex: 1, background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: 3, padding: "8px 10px", color: "#f0ede8", fontFamily: "var(--font-space-mono)", fontSize: 10, outline: "none" }
                return (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#333", width: 14, textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                    <input
                      key={`${selected}-res-stat-${i}`}
                      type="text"
                      placeholder="Stat (e.g. 750K+)"
                      defaultValue={current.stat}
                      onBlur={e => updateResult(i, "stat", e.target.value.trim())}
                      style={{ ...inputStyle, flex: "0 0 110px" }}
                    />
                    <input
                      key={`${selected}-res-label-${i}`}
                      type="text"
                      placeholder="Label (e.g. Total Reach)"
                      defaultValue={current.label}
                      onBlur={e => updateResult(i, "label", e.target.value.trim())}
                      style={inputStyle}
                    />
                  </div>
                )
              })}
            </div>
          </SectionCard>
        )}

        {/* ── Selected Frames (Stills) ────────────────────── */}
        <SectionCard title="Selected Frames">
          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#444", marginBottom: 14, lineHeight: 1.7 }}>
            Editorial still frames shown in a mosaic grid on the project page. Up to 6 images.
          </p>
          <ImageGrid
            images={pm.stills ?? []}
            onUpload={(files) => upload(files, selected, "stills")}
            onReorder={(next) => reorder(selected, "stills", undefined, next)}
            onDelete={(i) => remove(selected, "stills", undefined, i)}
            onPosition={(src) => openPos(src, "16/9")}
            positions={positions}
          />
        </SectionCard>

        {/* ── Movie Poster ─────────────────────────────────── */}
        {project.hasPoster && (
          <SectionCard title="Movie Poster">
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#444", marginBottom: 14, lineHeight: 1.7 }}>
              Portrait poster (2:3) shown alongside film info on the project page.
            </p>
            <SingleImageSlot
              current={(media[selected] as MediaEntry | undefined)?.poster}
              label="Poster — 2:3 portrait"
              onUpload={(files) => upload(files, selected, "poster")}
              onClear={() => remove(selected, "poster", undefined, 0)}
            />
          </SectionCard>
        )}

        {/* ── Event Posters ───────────────────────────────── */}
        {project.hasPosters && (
          <SectionCard title="Event Posters &amp; Flyers">
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#444", marginBottom: 14, lineHeight: 1.7 }}>
              4:5 portrait posters shown in a grid on the project page. Upload as many as you have.
            </p>
            <ImageGrid
              images={(media[selected] as MediaEntry | undefined)?.posters ?? []}
              onUpload={(files) => upload(files, selected, "posters")}
              onReorder={(next) => reorder(selected, "posters", undefined, next)}
              onDelete={(i) => remove(selected, "posters", undefined, i)}
              onPosition={(src) => openPos(src, "4/5")}
              positions={positions}
            />
          </SectionCard>
        )}

        {/* ── Gallery ─────────────────────────────────────── */}
        {project.hasGallery && !project.pitchDeckNames && <SectionCard title={project.concertLayout ? "Concert Photos" : "Gallery"}>
          {project.concertLayout && (
            <ConcertGridMap filled={galleryImages.length} />
          )}
          {galleryImages.length === 0 && (
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8.5, color: "#333", marginBottom: 12 }}>
              {project.concertLayout ? "Upload up to 12 photos — order matches the grid map above" : "No images yet — click Add to upload"}
            </p>
          )}
          <ImageGrid
            images={galleryImages}
            onUpload={(files) => upload(files, selected, "gallery")}
            onReorder={(next) => reorder(selected, "gallery", undefined, next)}
            onDelete={(i) => remove(selected, "gallery", undefined, i)}
            onPosition={(src, ar) => openPos(src, ar ?? (project.galleryLandscape ? "16/9" : "4/3"))}
            positions={positions}
            slotLabels={project.concertLayout ? CONCERT_SLOTS : undefined}
          />
        </SectionCard>}

        {/* ── Albums ──────────────────────────────────────── */}
        {project.albumLabels && project.albumLabels.length > 0 && (
          <SectionCard title="Photo Albums">
            {/* Tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {project.albumLabels.map((label, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab((t) => ({ ...t, [`album-${selected}`]: i }))}
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    fontSize: 8,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    padding: "5px 14px",
                    border: albumTab === i ? "1px solid #E8181C" : "1px solid #2a2a2a",
                    color: albumTab === i ? "#f0ede8" : "#555",
                    background: "transparent",
                    cursor: "pointer",
                    borderRadius: 3,
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <ImageGrid
              images={pm.albums?.[albumTab] ?? []}
              onUpload={(files) => upload(files, selected, "album", albumTab)}
              onReorder={(next) => reorder(selected, "album", albumTab, next)}
              onDelete={(i) => remove(selected, "album", albumTab, i)}
              onPosition={(src) => openPos(src, "4/3")}
              positions={positions}
            />
          </SectionCard>
        )}

        {/* ── Themes ──────────────────────────────────────── */}
        {project.themeNames && project.themeNames.length > 0 && (
          <SectionCard title="Event Themes">
            {/* Tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {project.themeNames.map((name, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab((t) => ({ ...t, [`theme-${selected}`]: i }))}
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    fontSize: 8,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    padding: "5px 14px",
                    border: themeTab === i ? "1px solid #E8181C" : "1px solid #2a2a2a",
                    color: themeTab === i ? "#f0ede8" : "#555",
                    background: "transparent",
                    cursor: "pointer",
                    borderRadius: 3,
                    transition: "all 0.15s",
                  }}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Theme cover */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
                Theme Card Cover
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Portrait thumbnail matching card aspect ratio */}
                {(() => {
                  const ar = project.themeAspectRatios?.[themeTab] ?? "4/3"
                  const coverSrc = pm.themes?.[themeTab]?.cover
                  const pos = coverSrc ? positions[coverSrc] : undefined
                  return (
                    <div style={{ position: "relative", width: 64, aspectRatio: ar, borderRadius: 4, overflow: "hidden", border: coverSrc ? "1px solid #2a2a2a" : "1px dashed #2a2a2a", background: "#0f0f0f", flexShrink: 0 }}>
                      {coverSrc ? (
                        <>
                          <img
                            src={coverSrc}
                            alt=""
                            style={{
                              width: "100%", height: "100%", objectFit: "cover",
                              objectPosition: pos ? `${pos.x}% ${pos.y}%` : "center",
                              transform: pos?.scale && pos.scale !== 1 ? `scale(${pos.scale})` : undefined,
                              transformOrigin: pos ? `${pos.x}% ${pos.y}%` : "center",
                            }}
                          />
                          <button
                            onClick={async () => {
                              const current: MediaState = { ...media, [selected]: { ...media[selected] } }
                              const themes = [...(current[selected].themes ?? [])]
                              themes[themeTab] = { ...themes[themeTab], cover: null }
                              current[selected].themes = themes
                              await persist(current)
                            }}
                            style={{ position: "absolute", top: 3, right: 3, width: 18, height: 18, borderRadius: "50%", background: "rgba(232,24,28,0.9)", color: "#fff", fontSize: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >×</button>
                          <button
                            onClick={() => openPos(coverSrc, ar)}
                            title="Adjust position & zoom"
                            style={{ position: "absolute", bottom: 3, right: 3, width: 18, height: 18, borderRadius: 3, background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.7)", fontSize: 10, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >⊹</button>
                        </>
                      ) : (
                        <label style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#444" }}>
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files && upload(e.target.files, selected, "theme-cover", themeTab)} />
                        </label>
                      )}
                    </div>
                  )
                })()}
                <div>
                  <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, color: "#f0ede8", letterSpacing: "0.05em", marginBottom: 4 }}>
                    Card cover image
                  </p>
                  <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 7.5, color: "#444", lineHeight: 1.6, marginBottom: 8 }}>
                    Appears on the clickable theme card.<br />Use ⊹ to adjust position & zoom.
                  </p>
                  <label style={{ fontFamily: "var(--font-space-mono)", fontSize: 7.5, letterSpacing: "0.2em", textTransform: "uppercase", padding: "4px 10px", border: "1px solid #2a2a2a", background: "transparent", color: "#888", cursor: "pointer", borderRadius: 3 }}>
                    {pm.themes?.[themeTab]?.cover ? "Replace" : "Upload"}
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files && upload(e.target.files, selected, "theme-cover", themeTab)} />
                  </label>
                </div>
              </div>
            </div>

            {/* Theme gallery */}
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
              Gallery Photos
            </p>
            <ImageGrid
              images={pm.themes?.[themeTab]?.images ?? []}
              onUpload={(files) => upload(files, selected, "theme", themeTab)}
              onReorder={(next) => reorder(selected, "theme", themeTab, next)}
              onDelete={(i) => remove(selected, "theme", themeTab, i)}
              onPosition={(src) => openPos(src, project.themeAspectRatios?.[themeTab] ?? "4/3")}
              positions={positions}
            />
          </SectionCard>
        )}

        {/* ── Show Reels ──────────────────────────────────── */}
        {project.reelCount && project.reelCount > 0 && (
          <SectionCard title="Show Reels (YouTube IDs + Thumbnails)">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {Array.from({ length: project.reelCount }).map((_, i) => {
                const reelCover = pm.reels?.[i]?.cover
                const thumbInputId = `reel-thumb-${selected}-${i}`
                return (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    {/* Thumbnail slot */}
                    <div style={{ flexShrink: 0, position: "relative" }}>
                      {reelCover ? (
                        <div style={{ position: "relative", width: 64, aspectRatio: project.concertLayout ? "9/16" : "16/9", borderRadius: 4, overflow: "hidden", border: "1px solid #2a2a2a" }}>
                          <img src={reelCover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          <button
                            onClick={() => remove(selected, "reel-cover", i, 0)}
                            style={{ position: "absolute", top: 3, right: 3, width: 16, height: 16, borderRadius: "50%", background: "rgba(232,24,28,0.9)", color: "#fff", fontSize: 11, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
                          >×</button>
                        </div>
                      ) : (
                        <>
                          <label
                            htmlFor={thumbInputId}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, width: 64, aspectRatio: project.concertLayout ? "9/16" : "16/9", borderRadius: 4, border: "1px dashed #2a2a2a", cursor: "pointer", color: "#3a3a3a" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "#E8181C"; (e.currentTarget as HTMLLabelElement).style.color = "#E8181C" }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLLabelElement).style.color = "#3a3a3a" }}
                          >
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>Thumb</span>
                          </label>
                          <input
                            id={thumbInputId}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => e.target.files && upload(e.target.files, selected, "reel-cover", i)}
                          />
                        </>
                      )}
                    </div>
                    {/* YouTube ID + label */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#555", letterSpacing: "0.15em" }}>
                        Reel {String(i + 1).padStart(2, "0")}
                      </span>
                      <input
                        type="text"
                        placeholder="YouTube video ID (e.g. dQw4w9WgXcQ)"
                        defaultValue={pm.reels?.[i]?.videoId ?? ""}
                        onBlur={(e) => updateReelId(selected, i, e.target.value.trim())}
                        style={{
                          background: "#0f0f0f",
                          border: "1px solid #2a2a2a",
                          borderRadius: 4,
                          padding: "8px 12px",
                          color: "#f0ede8",
                          fontFamily: "var(--font-space-mono)",
                          fontSize: 10,
                          letterSpacing: "0.05em",
                          outline: "none",
                        }}
                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E8181C" }}
                        onBlurCapture={(e) => { (e.target as HTMLInputElement).style.borderColor = "#2a2a2a" }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 7.5, color: "#333", marginTop: 14, letterSpacing: "0.1em" }}>
              Paste the YouTube video ID only — not the full URL. Tab out of the field to save.
            </p>
          </SectionCard>
        )}

        {/* ── Recipe Reels ─────────────────────────────────── */}
        {project.recipeReelCount && project.recipeReelCount > 0 && (
          <SectionCard title="Recipe Reels (YouTube IDs + Thumbnails)">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {Array.from({ length: project.recipeReelCount }).map((_, i) => {
                const cover = pm.recipeReels?.[i]?.cover
                const inputId = `recipe-reel-thumb-${selected}-${i}`
                return (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, position: "relative" }}>
                      {cover ? (
                        <div style={{ position: "relative", width: 52, aspectRatio: "9/16", borderRadius: 4, overflow: "hidden", border: "1px solid #2a2a2a" }}>
                          <img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          <button
                            onClick={() => remove(selected, "recipe-reel-cover", i, 0)}
                            style={{ position: "absolute", top: 3, right: 3, width: 16, height: 16, borderRadius: "50%", background: "rgba(232,24,28,0.9)", color: "#fff", fontSize: 11, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
                          >×</button>
                        </div>
                      ) : (
                        <>
                          <label
                            htmlFor={inputId}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, width: 52, aspectRatio: "9/16", borderRadius: 4, border: "1px dashed #2a2a2a", cursor: "pointer", color: "#3a3a3a" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "#E8181C"; (e.currentTarget as HTMLLabelElement).style.color = "#E8181C" }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLLabelElement).style.color = "#3a3a3a" }}
                          >
                            <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>Thumb</span>
                          </label>
                          <input id={inputId} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files && upload(e.target.files, selected, "recipe-reel-cover", i)} />
                        </>
                      )}
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 8, color: "#555", letterSpacing: "0.15em" }}>
                        Recipe {String(i + 1).padStart(2, "0")}
                      </span>
                      <input
                        type="text"
                        placeholder="YouTube video ID (e.g. dQw4w9WgXcQ)"
                        defaultValue={pm.recipeReels?.[i]?.videoId ?? ""}
                        onBlur={(e) => updateRecipeReelId(selected, i, e.target.value.trim())}
                        style={{ background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: 4, padding: "8px 12px", color: "#f0ede8", fontFamily: "var(--font-space-mono)", fontSize: 10, letterSpacing: "0.05em", outline: "none" }}
                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E8181C" }}
                        onBlurCapture={(e) => { (e.target as HTMLInputElement).style.borderColor = "#2a2a2a" }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 7.5, color: "#333", marginTop: 14, letterSpacing: "0.1em" }}>
              Paste the YouTube video ID only — not the full URL. Tab out of the field to save.
            </p>
          </SectionCard>
        )}

      </main>

      {/* ── Focal Point Editor modal ── */}
      {posEditor && (
        <PositionEditor
          src={posEditor.src}
          aspectRatio={posEditor.aspectRatio}
          initial={positions[posEditor.src] ?? { x: 50, y: 50 }}
          onSave={(pos) => savePosition(posEditor.src, pos)}
          onClose={() => setPosEditor(null)}
        />
      )}
    </div>
  )
}
