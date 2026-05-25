"use client"

import Link from "next/link"
import { Footer } from "../components/Footer"

export default function TermsPage() {
  return (
    <>
      <main style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 0, background: "#0a0a0a" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 40px 96px" }}>

          <p className="font-mono uppercase text-[#555]" style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 16 }}>
            Legal
          </p>
          <div style={{ display: "flex", gap: 24, marginBottom: 40 }}>
            {[{ href: "/cookie", label: "Cookie" }, { href: "/terms", label: "Terms" }, { href: "/privacy", label: "Privacy" }].map(({ href, label }) => (
              <Link key={href} href={href} className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.2em", color: href === "/terms" ? "#f0ede8" : "#333", borderBottom: href === "/terms" ? "1px solid #E8181C" : "1px solid transparent", paddingBottom: 4, transition: "color 0.2s" }}>
                {label}
              </Link>
            ))}
          </div>
          <h1 className="font-display font-bold uppercase text-[#f0ede8]" style={{ fontSize: "clamp(3rem,7vw,5.5rem)", lineHeight: 0.9, marginBottom: 56 }}>
            Terms of<br />
            <span style={{ color: "#E8181C" }}>Service</span>
          </h1>

          <div style={{ borderTop: "1px solid #1f1f1f", paddingTop: 48, display: "flex", flexDirection: "column", gap: 40 }}>

            <Section label="Agreement">
              <p>
                By engaging KLIPVISUAL for any service, you agree to these terms. Each project is governed
                by a separate written agreement or proposal that takes precedence over these general terms
                where they conflict.
              </p>
            </Section>

            <Section label="Scope of Work">
              <p>
                The deliverables, timeline, and format are defined in the project proposal or brief agreed
                upon before work begins. Any changes to scope requested after that point may affect
                timeline and pricing and will be communicated in writing before proceeding.
              </p>
            </Section>

            <Section label="Payment">
              <p>
                Projects typically require a deposit before work begins, with the balance due upon
                delivery or as outlined in the proposal. Delivered files are released in full once
                payment is received in full.
              </p>
              <p style={{ marginTop: 16 }}>
                Late payments may result in paused delivery. KLIPVISUAL reserves the right to apply
                interest on invoices unpaid after 30 days.
              </p>
            </Section>

            <Section label="Intellectual Property">
              <p>
                Upon receipt of full payment, the client receives rights to use the final delivered
                materials for the purposes agreed upon. KLIPVISUAL retains the right to display the work
                in its portfolio, website, and social media unless explicitly agreed otherwise in writing.
              </p>
              <p style={{ marginTop: 16 }}>
                Raw files, project files, and unused materials remain the property of KLIPVISUAL unless
                separately negotiated.
              </p>
            </Section>

            <Section label="Revisions">
              <p>
                The number of revision rounds included is defined per project. Revisions beyond that scope
                are billed at an hourly rate agreed upon in advance.
              </p>
            </Section>

            <Section label="Cancellation">
              <p>
                If a project is cancelled after work has begun, any deposit paid is non-refundable.
                Work completed up to the point of cancellation may be invoiced proportionally.
              </p>
            </Section>

            <Section label="Limitation of Liability">
              <p>
                KLIPVISUAL is not liable for indirect, incidental, or consequential damages arising from
                the use of delivered materials. Our maximum liability is limited to the amount paid for
                the specific project in question.
              </p>
            </Section>

            <Section label="Governing Law">
              <p>
                These terms are governed by the laws of the Province of Quebec, Canada. Any disputes
                will be resolved in the courts of Montreal, Quebec.
              </p>
            </Section>

            <Section label="Contact">
              <p>
                Questions about these terms?{" "}
                <a href="mailto:hello@klipvisual.com" className="text-[#E8181C] hover:underline">
                  hello@klipvisual.com
                </a>
              </p>
            </Section>

            <p className="font-mono text-[#333]" style={{ fontSize: 10, letterSpacing: "0.15em", paddingTop: 24, borderTop: "1px solid #1f1f1f" }}>
              Last updated: May 2026
            </p>

          </div>

          <div style={{ marginTop: 48 }}>
            <Link
              href="/"
              className="font-mono uppercase text-[#555] hover:text-[#f0ede8] transition-colors duration-200"
              style={{ fontSize: 10, letterSpacing: "0.25em" }}
            >
              ← Back to site
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono uppercase text-[#E8181C]" style={{ fontSize: 9, letterSpacing: "0.35em", marginBottom: 14 }}>
        {label}
      </p>
      <div className="font-sans font-light text-[rgba(240,237,232,0.6)]" style={{ fontSize: 15, lineHeight: 1.85 }}>
        {children}
      </div>
    </div>
  )
}
