"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Footer } from "../components/Footer"
import { useLang } from "../i18n/LanguageContext"

type FormValues = {
  name: string
  email: string
  service: string
  budget: string
  message: string
}

const services = ["Video Production", "Photography", "Design & Branding", "Content Strategy", "Bundle Package", "Other"]
const budgets  = ["Under $1,000", "$1,000 – $3,000", "$3,000 – $5,000", "$5,000 – $10,000", "$10,000+", "Let's Discuss"]

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "1px solid #1f1f1f",
  color: "#f0ede8",
  padding: "16px 20px",
  fontSize: 14,
  fontWeight: 300,
  outline: "none",
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[#555] uppercase block" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 10 }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="font-mono text-[#E8181C]" style={{ fontSize: 10, marginTop: 6 }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { t } = useLang()
  const tc = t.contact

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true)
    try {
      const res = await fetch("https://formspree.io/f/xpwroqgw", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) setSubmitted(true)
    } catch { /* silent */ } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <main style={{ minHeight: "100vh", paddingTop: 112, paddingBottom: 0 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>

          <div style={{ marginBottom: 72 }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[#555] uppercase"
              style={{ fontSize: 10, letterSpacing: "0.25em", marginBottom: 12 }}
            >
              {tc.hero.label}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold uppercase leading-none text-[#f0ede8]"
              style={{ fontSize: "clamp(3rem,8vw,7rem)" }}
            >
              {tc.hero.heading1}<br />
              <span style={{ color: "#E8181C" }}>{tc.hero.heading2}</span>
            </motion.h1>
          </div>

          <div
            className="grid grid-cols-1 lg:grid-cols-5"
            style={{ gap: "40px 64px", marginBottom: 80, borderTop: "1px solid #1f1f1f", paddingTop: 56 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-3"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ padding: "80px 0", textAlign: "center" }}
                >
                  <p className="font-mono text-[#E8181C] uppercase" style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 16 }}>
                    {tc.success.label}
                  </p>
                  <h2 className="font-display font-bold uppercase text-[#f0ede8]" style={{ fontSize: 40, marginBottom: 16 }}>
                    {tc.success.heading}
                  </h2>
                  <p className="font-sans text-[#555] font-light" style={{ fontSize: 14 }}>
                    {tc.success.body}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
                    <Field label={tc.form.nameLabel} error={errors.name?.message}>
                      <input
                        {...register("name", { required: tc.form.nameRequired })}
                        placeholder={tc.form.namePlaceholder}
                        style={inputStyle}
                      />
                    </Field>
                    <Field label={tc.form.emailLabel} error={errors.email?.message}>
                      <input
                        {...register("email", {
                          required: tc.form.emailRequired,
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: tc.form.emailInvalid },
                        })}
                        type="email"
                        placeholder={tc.form.emailPlaceholder}
                        style={inputStyle}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
                    <Field label={tc.form.serviceLabel} error={errors.service?.message}>
                      <select
                        {...register("service", { required: tc.form.serviceRequired })}
                        defaultValue=""
                        style={{ ...inputStyle, appearance: "none" }}
                      >
                        <option value="" disabled>{tc.form.serviceDefault}</option>
                        {services.map((s) => (
                          <option key={s} value={s} style={{ background: "#111", color: "#f0ede8" }}>{s}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label={tc.form.budgetLabel} error={errors.budget?.message}>
                      <select
                        {...register("budget", { required: tc.form.budgetRequired })}
                        defaultValue=""
                        style={{ ...inputStyle, appearance: "none" }}
                      >
                        <option value="" disabled>{tc.form.budgetDefault}</option>
                        {budgets.map((b) => (
                          <option key={b} value={b} style={{ background: "#111", color: "#f0ede8" }}>{b}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label={tc.form.messageLabel} error={errors.message?.message}>
                    <textarea
                      {...register("message", { required: tc.form.messageRequired })}
                      placeholder={tc.form.messagePlaceholder}
                      rows={6}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </Field>

                  <div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative inline-flex items-center gap-3 overflow-hidden font-mono text-[#f0ede8] uppercase"
                      style={{ background: "#E8181C", padding: "18px 48px", fontSize: 11, letterSpacing: "0.25em", opacity: submitting ? 0.5 : 1 }}
                    >
                      <span className="absolute inset-0 bg-[#f0ede8] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                      <span className="relative z-10 group-hover:text-[#0a0a0a] transition-colors duration-300">
                        {submitting ? tc.form.sending : tc.form.send}
                      </span>
                      <span className="relative z-10 group-hover:text-[#0a0a0a] transition-colors duration-300">→</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="lg:col-span-2"
              style={{ display: "flex", flexDirection: "column", gap: 36 }}
            >
              {[
                { label: tc.info.emailLabel,     content: <a href="mailto:contact@klipvisual.com" className="hover-underline" style={{ fontSize: 14, color: "rgba(240,237,232,0.7)", fontWeight: 300 }}>contact@klipvisual.com</a> },
                { label: tc.info.locationLabel,  content: <p style={{ fontSize: 14, color: "rgba(240,237,232,0.7)", fontWeight: 300, lineHeight: 1.6, whiteSpace: "pre-line" }}>{tc.info.locationValue}</p> },
                { label: tc.info.languagesLabel, content: <p style={{ fontSize: 14, color: "rgba(240,237,232,0.7)", fontWeight: 300 }}>{tc.info.languagesValue}</p> },
                { label: tc.info.responseLabel,  content: <p style={{ fontSize: 14, color: "rgba(240,237,232,0.7)", fontWeight: 300 }}>{tc.info.responseValue}</p> },
              ].map(({ label, content }) => (
                <div key={label}>
                  <p className="font-mono text-[#555] uppercase" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 12 }}>
                    {label}
                  </p>
                  {content}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
