import { NextRequest, NextResponse } from "next/server"

// Contact form → a lead in the KLIPVISUAL dashboard (app.klipvisual.com).
// The form still goes to Formspree too (email notification); this makes sure a
// message also lands in the app instead of only in an inbox.
//
// Calls the Supabase function create_inbound_lead (dashboard migration 0015),
// which checks KLIP_LEAD_SECRET. Env vars (Vercel → klipvisual project):
//   KLIP_SUPABASE_URL, KLIP_SUPABASE_ANON_KEY (public values), KLIP_LEAD_SECRET (secret).

export const runtime = "nodejs"

const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n)

export async function POST(req: NextRequest) {
  const url = process.env.KLIP_SUPABASE_URL
  const key = process.env.KLIP_SUPABASE_ANON_KEY
  const secret = process.env.KLIP_LEAD_SECRET
  if (!url || !key || !secret) return NextResponse.json({ ok: false }, { status: 503 })

  let data: Record<string, unknown>
  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  // Honeypot: a hidden field humans never fill. Bots get a polite fake "ok".
  if (clip(data.company_website, 200)) return NextResponse.json({ ok: true })

  const name = clip(data.name, 200)
  const email = clip(data.email, 254)
  if (name.length < 2 || !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  const budget = clip(data.budget, 80)
  const message = [clip(data.message, 4500), budget && `Budget : ${budget}`].filter(Boolean).join("\n\n")

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/create_inbound_lead`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        p_name: name,
        p_email: email,
        p_phone: clip(data.phone, 40),
        p_message: message,
        p_service: clip(data.service, 120),
        p_lang: data.lang === "fr" ? "fr" : "en",
      }),
    })
    const out = (await res.json().catch(() => null)) as { ok?: boolean } | null
    if (!res.ok || !out?.ok) {
      console.error("[lead] create_inbound_lead failed", res.status, out)
      return NextResponse.json({ ok: false }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[lead]", err)
    return NextResponse.json({ ok: false }, { status: 502 })
  }
}
