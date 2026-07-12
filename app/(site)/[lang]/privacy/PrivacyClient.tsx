"use client"

import Link from "next/link"
import { Footer } from "@/app/components/Footer"
import { useLang } from "@/app/i18n/LanguageContext"

export default function PrivacyPage() {
  const { href } = useLang()
  return (
    <>
      <main style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 0, background: "#0a0a0a" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 40px 96px" }}>

          <p className="font-mono uppercase text-[#555]" style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 16 }}>
            Legal
          </p>
          <div style={{ display: "flex", gap: 24, marginBottom: 40 }}>
            {[{ href: "/cookie", label: "Cookie" }, { href: "/terms", label: "Terms" }, { href: "/privacy", label: "Privacy" }].map(({ href, label }) => (
              <Link key={href} href={href} className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.2em", color: href === "/privacy" ? "#f0ede8" : "#333", borderBottom: href === "/privacy" ? "1px solid #E8181C" : "1px solid transparent", paddingBottom: 4, transition: "color 0.2s" }}>
                {label}
              </Link>
            ))}
          </div>
          <h1 className="font-display font-bold uppercase text-[#f0ede8]" style={{ fontSize: "clamp(3rem,7vw,5.5rem)", lineHeight: 0.9, marginBottom: 56 }}>
            Privacy<br />
            <span style={{ color: "#E8181C" }}>Policy</span>
          </h1>

          <div style={{ borderTop: "1px solid #1f1f1f", paddingTop: 48, display: "flex", flexDirection: "column", gap: 40 }}>

            <Section label="Who We Are">
              <p>
                KLIPVISUAL is a cinematic production studio based in Montreal, Quebec, Canada. This policy
                explains how we collect and handle personal information through this website.
              </p>
            </Section>

            <Section label="What We Collect">
              <p>
                We collect only what you voluntarily provide: your name, email address, and any details
                you include when submitting the contact form. We do not collect payment information
                through this site.
              </p>
              <p style={{ marginTop: 16 }}>
                We also collect anonymous, aggregated traffic data (pages visited, referral source,
                approximate geography) through Vercel Analytics. This data contains no personal
                identifiers and is used solely to understand how the site is performing.
              </p>
            </Section>

            <Section label="How We Use It">
              <p>
                Information submitted through the contact form is used exclusively to respond to your
                inquiry and, if a project moves forward, to manage that working relationship.
              </p>
              <p style={{ marginTop: 16 }}>
                We do not sell, rent, or share your personal information with third parties for
                marketing purposes. Ever.
              </p>
            </Section>

            <Section label="Third-Party Processors">
              <p>
                Contact form submissions are handled by Formspree (formspree.io), which transmits
                messages to our inbox. Formspree processes data in accordance with its own privacy
                policy and GDPR compliance commitments.
              </p>
              <p style={{ marginTop: 16 }}>
                Anonymous site analytics are processed by Vercel Analytics, which is cookieless and
                does not track individuals across sessions or sites.
              </p>
            </Section>

            <Section label="Data Retention">
              <p>
                We retain contact form submissions for as long as they are relevant to the business
                relationship. If no project results from an inquiry, messages are typically deleted
                within 12 months.
              </p>
            </Section>

            <Section label="Your Rights">
              <p>
                You have the right to request access to, correction of, or deletion of any personal
                data we hold about you. To exercise these rights, contact us at{" "}
                <a href="mailto:hello@klipvisual.com" className="text-[#E8181C] hover:underline">
                  hello@klipvisual.com
                </a>
                . We will respond within 30 days.
              </p>
            </Section>

            <Section label="Security">
              <p>
                This site is served over HTTPS. We take reasonable precautions to protect the limited
                data we hold, but no method of transmission over the internet is 100% secure.
              </p>
            </Section>

            <Section label="Changes to This Policy">
              <p>
                If we make material changes to this policy, we will update the date below. Continued
                use of the site after changes constitutes acceptance of the revised policy.
              </p>
            </Section>

            <Section label="Contact">
              <p>
                Privacy questions or requests:{" "}
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
              href={href("/")}
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
