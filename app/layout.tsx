import type { Metadata } from "next"
import { Barlow_Condensed, DM_Sans, Space_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "./components/Navbar"
import { CustomCursor } from "./components/CustomCursor"
import { FilmGrain } from "./components/FilmGrain"
import { SmoothScroll } from "./components/SmoothScroll"
import { LanguageProvider } from "./i18n/LanguageContext"

const barlow = Barlow_Condensed({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
})

const dmSans = DM_Sans({
  weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

const spaceMono = Space_Mono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "KLIPVISUAL | Cinematic Production Montreal",
  description:
    "Montreal-based cinematic production studio. Video production, photography, and brand identity for brands that demand excellence.",
  openGraph: {
    title: "KLIPVISUAL",
    description: "Cinematic production studio based in Montreal.",
    siteName: "KLIPVISUAL",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body className="bg-[#0a0a0a] text-[#f0ede8] antialiased overflow-x-hidden">
        <LanguageProvider>
          <FilmGrain />
          <CustomCursor />
          <Navbar />
          <SmoothScroll>{children}</SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  )
}
