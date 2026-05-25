"use client"

import Link from "next/link"
import { Footer } from "../components/Footer"

export default function CookiePage() {
  return (
    <>
      <main style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 0, background: "#0a0a0a" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 40px 96px" }}>

          <p className="font-mono uppercase text-[#555]" style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 16 }}>
            Legal
          </p>
          <h1 className="font-display font-bold uppercase text-[#f0ede8]" style={{ fontSize: "clamp(3rem,7vw,5.5rem)", lineHeight: 0.9, marginBottom: 56 }}>
            Cookie<br />
            <span style={{ color: "#E8181C" }}>Policy</span>
          </h1>

          <div style={{ borderTop: "1px solid #1f1f1f", paddingTop: 48, display: "flex", flexDirection: "column", gap: 40 }}>

            <Section label="Overview">
              <p>
                KLIPVISUAL uses no tracking or advertising cookies. We do not follow you across the web,
                build behavioral profiles, or share your data with third-party advertisers.
              </p>
            </Section>

            <Section label="What We Use">
              <p>
                This site uses only essential technical cookies required for basic functionality, such as
                remembering your language preference (stored locally in your browser). These cookies are
                never sent to external servers and contain no personally identifiable information.
              </p>
              <p style={{ marginTop: 16 }}>
                We use Vercel Analytics for anonymous, aggregate traffic measurement. This tool is
                privacy-first by design: it does not use cookies, does not fingerprint visitors, and
                does not collect personal data. No consent banner is required.
              </p>
            </Section>

            <Section label="Third Parties">
              <p>
                Contact form submissions are processed by Formspree. When you submit a form, your name
                and email are transmitted to Formspree solely to deliver your message to us. See their
                privacy policy at formspree.io for details.
              </p>
            </Section>

            <Section label="Your Control">
              <p>
                You can clear locally stored preferences at any time through your browser settings.
                Because we use no tracking cookies, there is nothing else to opt out of.
              </p>
            </Section>

            <Section label="Contact">
              <p>
                Questions? Reach us at{" "}
                <a href="mailto:contact@klipvisual.com" className="text-[#E8181C] hover:underline">
                  contact@klipvisual.com
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
