import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ borderTop: "1px solid #1f1f1f", background: "#0a0a0a", padding: "64px 40px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Top grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: "48px 40px", marginBottom: 48 }}
        >
          {/* Brand */}
          <div>
            <Image
              src="/Logos/Logo.png"
              alt="KLIPVISUAL"
              width={110}
              height={28}
              style={{ height: 28, width: "auto", objectFit: "contain", display: "block", marginBottom: 16 }}
            />
            <p
              className="font-sans text-[#555] font-light leading-relaxed"
              style={{ fontSize: 13, maxWidth: 240 }}
            >
              Cinematic production studio based in Montreal.
              Video, photography & brand identity.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p
              className="font-mono text-[#555] uppercase"
              style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 20 }}
            >
              Navigation
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["Work", "/work"],
                ["Services", "/services"],
                ["About", "/about"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover-underline"
                    style={{ fontSize: 14, color: "rgba(240,237,232,0.65)", transition: "color 0.2s" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              className="font-mono text-[#555] uppercase"
              style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 20 }}
            >
              Get in Touch
            </p>
            <a
              href="mailto:contact@klipvisual.com"
              className="hover-underline"
              style={{ fontSize: 14, color: "rgba(240,237,232,0.65)", display: "block", marginBottom: 8 }}
            >
              contact@klipvisual.com
            </a>
            <p style={{ fontSize: 14, color: "#555" }}>Montreal, Quebec</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center"
          style={{ paddingTop: 24, borderTop: "1px solid #1f1f1f", gap: 12 }}
        >
          <p
            className="font-mono text-[#555] uppercase"
            style={{ fontSize: 10, letterSpacing: "0.12em" }}
          >
            © {year} KLIPVISUAL. All rights reserved.
          </p>
          <p
            className="font-mono text-[#555] uppercase"
            style={{ fontSize: 10, letterSpacing: "0.12em" }}
          >
            Montreal · Toronto · Casablanca
          </p>
        </div>
      </div>
    </footer>
  )
}
