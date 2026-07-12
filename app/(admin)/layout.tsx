import type { Metadata } from "next"
import "@/app/globals.css"

/**
 * Second root layout, for the private dashboard (app.klipvisual.com).
 *
 * The dashboard is a different host, so klipvisual.com/robots.txt does not
 * apply to it. A robots meta tag travels with the page itself, which is the
 * only thing that reliably keeps business numbers out of the index.
 */
export const metadata: Metadata = {
  title: "KLIPVISUAL Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-[#f0ede8] antialiased">{children}</body>
    </html>
  )
}
