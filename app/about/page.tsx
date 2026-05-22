"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Footer } from "../components/Footer"

const CDN = "https://cdn.prod.website-files.com/673306db3b111afa559bc378"

// tx, ty, tz in px — ry, rx in deg — s = scale
const globeItems = [
  // row 1
  { img: "677bff10d1e88606d66c41f6_1_About-us_Image.webp",  tx:-124.674, ty:-51.783, tz:-388.687, ry:-19.1443, rx: 7.9516, s:0.91   },
  { img: "677bff1fdad7b0717736fab0_2_About-us_Image.webp",  tx: -89.373, ty:-49.465, tz:-232.96,  ry:-10.8706, rx: 6.0166, s:0.9319 },
  { img: "677bff380a3e049d644891ee_3_About-us_Image.webp",  tx: -55.048, ty:-45.755, tz:-123.671, ry: -5.0724, rx: 4.2161, s:0.9523 },
  { img: "677bff42efc7e509add9f692_4_About-us_Image.webp",  tx: -24.055, ty:-39.942, tz: -60.111, ry: -1.654,  rx: 2.7463, s:0.9689 },
  { img: "677bff51468ede02d4c73bd5_5_About-us_Image.webp",  tx:  -0.051, ty:-35.79,  tz: -39.526, ry:  0,      rx: 2.108,  s:0.9761 },
  { img: "677bff62e6ea02aac6da1e6e_6_About-us_Image.webp",  tx:  24.055, ty:-39.942, tz: -60.111, ry:  1.654,  rx: 2.7463, s:0.9689 },
  { img: "677bff7ef84fa2d4ee14ec35_8_About-us_Image.webp",  tx:  55.048, ty:-45.755, tz:-123.671, ry:  5.0724, rx: 4.2161, s:0.9523 },
  { img: "677bff8d468ede02d4c765f5_9_About-us_Image.webp",  tx:  89.34,  ty:-49.525, tz:-232.681, ry: 10.8536, rx: 6.0166, s:0.9319 },
  { img: "677bff9afd0d0d49760c1176_10_About-us_Image.webp", tx: 124.674, ty:-51.783, tz:-388.687, ry: 19.1443, rx: 7.9516, s:0.91   },
  // row 2
  { img: "677bffac6e0251da1b713d24_11_About-us_Image.webp", tx:-125.178, ty:-17.38,  tz:-339.257, ry:-17.9218, rx: 2.4883, s:0.9157 },
  { img: "677bffb627459f1e0b640264_12_About-us_Image.webp", tx: -89.438, ty:-16.547, tz:-184.571, ry: -9.6795, rx: 1.7908, s:0.9394 },
  { img: "677bffc1475498962f3111f7_13_About-us_Image.webp", tx: -53.848, ty:-14.961, tz: -77.071, ry: -3.9604, rx: 1.1004, s:0.9627 },
  { img: "677bffcd472391384657b13f_14_About-us_Image.webp", tx: -19.34,  ty:-10.735, tz: -16.826, ry: -0.7846, rx: 0.4355, s:0.9853 },
  { img: "677bffd9a289d3f3f608b9e1_15_About-us_Image.webp", tx:   0,     ty:  0,     tz:   0,     ry:  0,      rx: 0,      s:1      },
  { img: "677bffe4475498962f312bc3_16_About-us_Image.webp", tx:  19.34,  ty:-10.735, tz: -16.826, ry:  0.7846, rx: 0.4355, s:0.9853 },
  { img: "677bffed24506442687de3b2_17_About-us_Image.webp", tx:  53.848, ty:-14.961, tz: -77.071, ry:  3.9604, rx: 1.1004, s:0.9627 },
  { img: "677c005127459f1e0b64a068_27_About-us_Image.webp", tx:  89.434, ty:-16.572, tz:-184.292, ry:  9.6644, rx: 1.7908, s:0.9394 },
  { img: "677c0049e9025b40267e7318_26_About-us_Image.webp", tx: 125.178, ty:-17.38,  tz:-339.257, ry: 17.9218, rx: 2.4883, s:0.9157 },
  // row 3
  { img: "677c0042a4200929e4d0933b_25_About-us_Image.webp", tx:-125.178, ty: 17.38,  tz:-339.257, ry:-17.9218, rx:-2.4883, s:0.9157 },
  { img: "677c003b4e9aa1ab5bd216bc_24_About-us_Image.webp", tx: -89.438, ty: 16.547, tz:-184.571, ry: -9.6795, rx:-1.7908, s:0.9394 },
  { img: "677c00325c5698c6cf216f0f_23_About-us_Image.webp", tx: -53.848, ty: 14.961, tz: -77.071, ry: -3.9604, rx:-1.1004, s:0.9627 },
  { img: "677c0027823e1066ec98d5dd_22_About-us_Image.webp", tx: -19.34,  ty: 10.735, tz: -16.826, ry: -0.7846, rx:-0.4355, s:0.9853 },
  { img: "677c001d1e52dbed676914ea_21_About-us_Image.webp", tx:   0,     ty:  0,     tz:   0,     ry:  0,      rx: 0,      s:1      },
  { img: "677c0012d587fa760a7ad62f_20_About-us_Image.webp", tx:  19.34,  ty: 10.735, tz: -16.826, ry:  0.7846, rx:-0.4355, s:0.9853 },
  { img: "677c000427459f1e0b645a81_19_About-us_Image.webp", tx:  53.848, ty: 14.961, tz: -77.071, ry:  3.9604, rx:-1.1004, s:0.9627 },
  { img: "677bfffb4790848554dab656_18_About-us_Image.webp", tx:  89.434, ty: 16.572, tz:-184.292, ry:  9.6644, rx:-1.7908, s:0.9394 },
  { img: "677c00aa9e3fca5f8ea1329e_37_About-us_Image.webp", tx: 125.178, ty: 17.38,  tz:-339.257, ry: 17.9218, rx:-2.4883, s:0.9157 },
  // row 4
  { img: "677c00a15b09a93c09f8ee7f_36_About-us_Image.webp", tx:-124.674, ty: 51.783, tz:-388.687, ry:-19.1443, rx:-7.9516, s:0.91   },
  { img: "677c009866121823970767ba_35_About-us_Image.webp", tx: -89.373, ty: 49.465, tz:-232.96,  ry:-10.8706, rx:-6.0166, s:0.9319 },
  { img: "677c0091e2f2a17863d1ffe6_34_About-us_Image.webp", tx: -55.048, ty: 45.755, tz:-123.671, ry: -5.0724, rx:-4.2161, s:0.9523 },
  { img: "677c008ab8be2054603bd3ae_33_About-us_Image.webp", tx: -24.055, ty: 39.942, tz: -60.111, ry: -1.654,  rx:-2.7463, s:0.9689 },
  { img: "677c008000fac8c25815f045_32_About-us_Image.webp", tx:  -0.051, ty: 35.79,  tz: -39.526, ry:  0,      rx:-2.108,  s:0.9761 },
  { img: "677c0076d1e88606d66d7125_31_About-us_Image.webp", tx:  24.055, ty: 39.942, tz: -60.111, ry:  1.654,  rx:-2.7463, s:0.9689 },
  { img: "677c006d475498962f31c078_30_About-us_Image.webp", tx:  55.048, ty: 45.755, tz:-123.671, ry:  5.0724, rx:-4.2161, s:0.9523 },
  { img: "677c0065a289d3f3f609504f_29_About-us_Image.webp", tx:  89.34,  ty: 49.525, tz:-232.681, ry: 10.8536, rx:-6.0166, s:0.9319 },
  { img: "677c0059b99830392f466d7f_28_About-us_Image.webp", tx: 124.674, ty: 51.783, tz:-388.687, ry: 19.1443, rx:-7.9516, s:0.91   },
]

const timeline = [
  { year: "2017–2020", title: "ISMAC Rabat",     subtitle: "Bachelor in Cinematography",             location: "Morocco"  },
  { year: "2021–2022", title: "Calixa-Lavallée", subtitle: "DEP in Graphic Design",                   location: "Quebec"   },
  { year: "2022–Now",  title: "KLIPVISUAL",       subtitle: "Freelance Filmmaker + Creative Director",  location: "Montreal" },
]

const stats = [
  { value: "7+",  label: "Years"    },
  { value: "50+", label: "Projects" },
  { value: "3",   label: "Countries"},
  { value: "∞",   label: "Frames"   },
]

const serviceCards = [
  { label: "Video Production",  href: "/services#video"       },
  { label: "Photography",       href: "/services#photography"  },
  { label: "Design & Branding", href: "/services#design"       },
  { label: "Bundles",           href: "/services#bundles"      },
]

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })

  // Globe grid mouse tilt
  const globeSectionRef = useRef<HTMLElement>(null)
  const globeWrapRef    = useRef<HTMLDivElement>(null)
  const mouseTarget     = useRef({ x: 0, y: 0 })
  const mouseCurrent    = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = globeSectionRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      mouseTarget.current.x = ((e.clientX - r.left) / r.width  - 0.5) * 2
      mouseTarget.current.y = ((e.clientY - r.top)  / r.height - 0.5) * 2
    }
    window.addEventListener("mousemove", onMove)
    let raf: number
    const tick = () => {
      mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.07
      mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.07
      if (globeWrapRef.current) {
        globeWrapRef.current.style.transform =
          `rotateY(${mouseCurrent.current.x * 10}deg) rotateX(${-mouseCurrent.current.y * 7}deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf) }
  }, [])

  const leftY  = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"])
  const rightY = useTransform(scrollYProgress, [0, 1], ["0%",  "18%"])
  const textY  = useTransform(scrollYProgress, [0, 1], ["0%",  "10%"])

  return (
    <>
      <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>

        {/* ── Hero ────────────────────────────────────── */}
        <section
          ref={heroRef}
          style={{
            height: "100svh",
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr 1fr",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Left image */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <motion.div style={{ position: "absolute", inset: 0, y: leftY }}>
              <motion.div
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                style={{ position: "absolute", inset: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${CDN}/675eb91e5fafbd1f37953c10_savoy.webp`}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  draggable={false}
                />
                <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.3)" }} />
              </motion.div>
            </motion.div>
          </div>

          {/* Center — manifesto */}
          <motion.div
            style={{
              display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "center",
              padding: "0 2.5rem", textAlign: "center",
              y: textY, position: "relative", zIndex: 5,
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="font-mono uppercase"
              style={{ fontSize: "0.55rem", letterSpacing: "0.4em", color: "rgba(240,237,232,0.35)", marginBottom: "2.5rem" }}
            >
              Montreal · Since 2022
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold uppercase"
              style={{ fontSize: "clamp(1.7rem, 3vw, 3.8rem)", lineHeight: "0.9em", letterSpacing: "-0.02em", color: "#f0ede8", marginBottom: "2.5rem" }}
            >
              FILM.<br />
              PHOTO.<br />
              BRAND.<br />
              <span style={{ color: "#E8181C" }}>ONE PERSON.</span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%", height: 1, background: "rgba(240,237,232,0.12)", marginBottom: "2.5rem", transformOrigin: "left" }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="font-mono uppercase"
              style={{ fontSize: "0.5rem", letterSpacing: "0.32em", color: "rgba(240,237,232,0.28)" }}
            >
              VIDEO · PHOTO · BRAND · EVENTS
            </motion.p>
          </motion.div>

          {/* Right image */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <motion.div style={{ position: "absolute", inset: 0, y: rightY }}>
              <motion.div
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                style={{ position: "absolute", inset: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${CDN}/67923c109ebd8d8a03e4960c_moon.jpg`}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  draggable={false}
                />
                <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.3)" }} />
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            style={{
              position: "absolute", bottom: "2rem", left: "50%",
              transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
              pointerEvents: "none",
            }}
          >
            <span className="font-mono uppercase" style={{ fontSize: "0.48rem", letterSpacing: "0.32em", color: "rgba(240,237,232,0.22)" }}>
              Scroll
            </span>
            <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, rgba(240,237,232,0.22), transparent)" }} />
          </motion.div>
        </section>

        {/* ── Globe image grid ────────────────────────── */}
        <section
          ref={globeSectionRef}
          style={{
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6rem 0",
            overflow: "hidden",
          }}
        >
          {/* perspective lives here — separate from the tilt transform */}
          <div style={{ perspective: 1000, perspectiveOrigin: "50% 50%" }}>
            {/* tilt wrapper gets the mouse transform */}
            <div
              ref={globeWrapRef}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(9, 210px)",
                gridTemplateRows: "repeat(4, 157px)",
                gap: 4,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              {globeItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    transform: `translate3d(${item.tx}px,${item.ty}px,${item.tz}px) rotateY(${item.ry}deg) rotateX(${item.rx}deg) scale(${item.s},${item.s})`,
                    backgroundImage: `url(${CDN}/${item.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 3,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission ─────────────────────────────────── */}
        <section style={{ padding: "8rem 40px", borderBottom: "1px solid #1f1f1f" }}>
          <div style={{ maxWidth: 920, margin: "0 auto" }}>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold uppercase"
              style={{ fontSize: "clamp(1.5rem, 2.6vw, 3rem)", lineHeight: "1.1em", letterSpacing: "-0.01em", color: "#f0ede8" }}
            >
              I shoot, direct, edit and deliver. Brand campaigns, weddings, food content, live concerts.
              One person doing it all from start to finish.
            </motion.p>
          </div>
        </section>

        {/* ── Who I Am ────────────────────────────────── */}
        <section style={{ padding: "8rem 40px", borderBottom: "1px solid #1f1f1f" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono uppercase"
              style={{ fontSize: "0.58rem", letterSpacing: "0.38em", color: "rgba(240,237,232,0.28)", marginBottom: "5rem" }}
            >
              Who I Am
            </motion.p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "5rem", alignItems: "start" }}>
              {/* Portrait */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{ aspectRatio: "3/4", position: "relative", overflow: "hidden", background: "#111" }}
              >
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg, #1a0505 0%, #380808 45%, #0d0d0d 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="font-mono uppercase" style={{ fontSize: "0.52rem", letterSpacing: "0.3em", color: "rgba(240,237,232,0.12)" }}>Portrait</span>
                </div>
                {/* Grain clipping wrapper — prevents grain-overlay-frame from bleeding outside */}
                <div style={{ position: "absolute", inset: 0, zIndex: 4, overflow: "hidden", pointerEvents: "none" }} aria-hidden>
                  <div className="grain-overlay-frame" />
                </div>
              </motion.div>

              {/* Bio */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ paddingTop: "0.5rem" }}
              >
                <h2
                  className="font-display font-bold uppercase"
                  style={{ fontSize: "clamp(2.2rem, 4.5vw, 5rem)", lineHeight: "0.88em", letterSpacing: "-0.025em", color: "#f0ede8", marginBottom: "1rem" }}
                >
                  Achraf<br />
                  <span style={{ color: "#E8181C" }}>Chibane</span>
                </h2>
                <p className="font-mono uppercase" style={{ fontSize: "0.55rem", letterSpacing: "0.32em", color: "rgba(240,237,232,0.32)", marginBottom: "3rem", marginTop: "1rem" }}>
                  Filmmaker · Creative Director
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {[
                    "I studied cinematography at ISMAC Rabat in Morocco and then moved to Quebec for a diploma in graphic design at Calixa-Lavallée. Both shaped how I see and how I work.",
                    "KLIPVISUAL is my one-person operation. I handle the camera, the edit, the color and the creative direction. Every project, start to finish, no middleman.",
                    "Seven years of work across Morocco, Canada and beyond. I speak French, English and Arabic.",
                  ].map((para, i) => (
                    <p key={i} className="font-sans font-light leading-relaxed" style={{ fontSize: 15, color: "rgba(240,237,232,0.58)" }}>
                      {para}
                    </p>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────── */}
        <section style={{ borderBottom: "1px solid #1f1f1f" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.7 }}
                style={{ padding: "4rem 2.5rem", borderRight: i < stats.length - 1 ? "1px solid #1f1f1f" : "none" }}
              >
                <p className="font-display font-bold" style={{ fontSize: "clamp(3rem, 5vw, 5.5rem)", lineHeight: 1, color: "#f0ede8", marginBottom: "0.6rem" }}>
                  {stat.value}
                </p>
                <p className="font-mono uppercase" style={{ fontSize: "0.55rem", letterSpacing: "0.32em", color: "rgba(240,237,232,0.28)" }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Timeline ────────────────────────────────── */}
        <section style={{ padding: "8rem 40px", borderBottom: "1px solid #1f1f1f" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono uppercase"
              style={{ fontSize: "0.58rem", letterSpacing: "0.38em", color: "rgba(240,237,232,0.28)", marginBottom: "3rem" }}
            >
              Background
            </motion.p>
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "grid", gridTemplateColumns: "160px 1fr auto", alignItems: "center", gap: "2rem", padding: "1.8rem 0", borderTop: "1px solid #1f1f1f" }}
              >
                <span className="font-mono" style={{ fontSize: "0.58rem", letterSpacing: "0.2em", color: "rgba(240,237,232,0.28)" }}>{item.year}</span>
                <div>
                  <p className="font-display font-bold uppercase" style={{ fontSize: "1.3rem", color: "#f0ede8", lineHeight: 1 }}>{item.title}</p>
                  <p className="font-sans font-light" style={{ fontSize: 13, color: "rgba(240,237,232,0.38)", marginTop: 5 }}>{item.subtitle}</p>
                </div>
                <span className="font-mono uppercase" style={{ fontSize: "0.58rem", letterSpacing: "0.2em", color: "rgba(240,237,232,0.28)" }}>{item.location}</span>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid #1f1f1f" }} />
          </div>
        </section>

        {/* ── Services cards ──────────────────────────── */}
        <section style={{ padding: "8rem 40px", borderBottom: "1px solid #1f1f1f" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>

            {/* Ticket label — centered, cream bg, perforated punch on right */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "3.5rem" }}>
              <div style={{ position: "relative" }}>
                {/* Punch-hole notch cut from left */}
                <span style={{
                  position: "absolute",
                  left: -11,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#0a0a0a",
                  border: "1px solid rgba(240,237,232,0.18)",
                  zIndex: 2,
                }} />
                <div
                  className="font-mono uppercase"
                  style={{
                    border: "1px solid rgba(240,237,232,0.18)",
                    padding: "0.6rem 2rem",
                    fontSize: "0.52rem",
                    letterSpacing: "0.38em",
                    color: "rgba(240,237,232,0.5)",
                    background: "transparent",
                    whiteSpace: "nowrap",
                  }}
                >
                  Our Services
                </div>
                {/* Punch-hole notch cut from right */}
                <span style={{
                  position: "absolute",
                  right: -11,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#0a0a0a",
                  border: "1px solid rgba(240,237,232,0.18)",
                  zIndex: 2,
                }} />
              </div>
            </div>

            {/* 2×2 card grid — dashed outer border */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              border: "1px dashed rgba(240,237,232,0.2)",
              borderRadius: 8,
              overflow: "hidden",
            }}>
              {serviceCards.map((svc, i) => (
                <motion.a
                  key={svc.href}
                  href={svc.href}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  whileHover="hover"
                  style={{
                    display: "block",
                    textDecoration: "none",
                    position: "relative",
                    overflow: "hidden",
                    borderRight: i % 2 === 0 ? "1px dashed rgba(240,237,232,0.2)" : "none",
                    borderBottom: i < 2 ? "1px dashed rgba(240,237,232,0.2)" : "none",
                  }}
                >
                  {/* Red wipe on hover */}
                  <motion.span
                    variants={{ hover: { y: "0%" } }}
                    initial={{ y: "100%" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: "absolute", inset: 0, background: "#E8181C", zIndex: 0 }}
                  />

                  {/* Cream header strip */}
                  <div style={{
                    position: "relative",
                    zIndex: 1,
                    background: "#e8e3d8",
                    padding: "0.65rem 1.4rem",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                  }}>
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: "0.48rem", letterSpacing: "0.3em", color: "rgba(0,0,0,0.4)" }}
                    >
                      Service {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Service name — large display type */}
                  <div style={{ position: "relative", zIndex: 1, padding: "3.5rem 2.5rem 4rem" }}>
                    <h3
                      className="font-display font-bold uppercase"
                      style={{
                        fontSize: "clamp(2rem, 3.8vw, 4.4rem)",
                        lineHeight: "0.88em",
                        letterSpacing: "-0.03em",
                        color: "#f0ede8",
                      }}
                    >
                      {svc.label.split(" ").map((w, j) => (
                        <span key={j} style={{ display: "block" }}>{w}</span>
                      ))}
                    </h3>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Our Work CTA — siena "Our Films" style ──── */}
        <section style={{ position: "relative", height: "80vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${CDN}/675eb91e5fafbd1f37953c10_savoy.webp`}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            draggable={false}
          />
          {/* Dark overlay */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.58)" }} />
          {/* Grain */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2 }} aria-hidden>
            <div className="grain-overlay-frame" />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem" }}
          >
            <h2
              className="font-display font-bold uppercase"
              style={{
                fontSize: "clamp(3.5rem, 9vw, 10rem)",
                lineHeight: "0.88em",
                letterSpacing: "-0.03em",
                color: "#f0ede8",
                textAlign: "center",
              }}
            >
              Our Work
            </h2>

            {/* Split "EXPLORE | →" button — siena style */}
            <Link
              href="/work"
              className="group"
              style={{
                display: "inline-flex",
                alignItems: "stretch",
                textDecoration: "none",
                border: "1px solid rgba(240,237,232,0.45)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Red fill on hover */}
              <span
                className="absolute inset-0 bg-[#E8181C] translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
              />
              <span
                className="font-mono uppercase relative z-10"
                style={{
                  padding: "14px 28px",
                  fontSize: "0.55rem",
                  letterSpacing: "0.32em",
                  color: "#f0ede8",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Explore
              </span>
              {/* Divider */}
              <span style={{ width: 1, background: "rgba(240,237,232,0.45)", flexShrink: 0, position: "relative", zIndex: 10 }} />
              {/* Arrow box */}
              <span
                className="relative z-10 flex items-center justify-center"
                style={{ padding: "14px 18px", color: "#f0ede8", fontSize: "0.9rem" }}
              >
                →
              </span>
            </Link>
          </motion.div>
        </section>

      </main>
      <Footer />
    </>
  )
}
