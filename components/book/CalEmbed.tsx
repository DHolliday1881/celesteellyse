"use client"

import {useEffect, useRef} from "react"
import styles from "./IntakeForm.module.css"

type CalCommand = (...args: unknown[]) => void
type CalApi = CalCommand & {ns: Record<string, CalCommand>; q?: unknown[]; loaded?: boolean}

declare global {
  interface Window {
    Cal?: CalApi
  }
}

const EMBED_SCRIPT = "https://app.cal.com/embed/embed.js"
const CAL_ORIGIN = "https://app.cal.com"

/** Cal.com's standard embed loader: queues commands until its script arrives. */
function loadCal(): CalApi {
  if (window.Cal) return window.Cal
  const push = (api: {q: unknown[]}, args: unknown) => api.q.push(args)
  const cal = function (...args: unknown[]) {
    const self = window.Cal as CalApi & {q: unknown[]}
    if (!self.loaded) {
      self.ns = {}
      self.q = self.q || []
      document.head.appendChild(document.createElement("script")).src = EMBED_SCRIPT
      self.loaded = true
    }
    if (args[0] === "init") {
      const api = Object.assign((...inner: unknown[]) => push(api, inner), {q: [] as unknown[]})
      const namespace = args[1]
      if (typeof namespace === "string") {
        self.ns[namespace] = self.ns[namespace] || api
        push(self.ns[namespace] as unknown as {q: unknown[]}, args)
        push(self, ["initNamespace", namespace])
      } else push(self, args)
      return
    }
    push(self, args)
  } as CalApi
  window.Cal = cal
  return cal
}

/** Cal.com's dark theme colours taken from the site's own tokens, as the calendar's iframe can't read our CSS variables. */
function calColors() {
  const root = getComputedStyle(document.documentElement)
  const token = (name: string) => root.getPropertyValue(name).trim()
  const mix = (color: string, percent: number) => `color-mix(in srgb, ${color} ${percent}%, transparent)`
  const [navy, night, periwinkle, coral, starlight] = ["--navy", "--night", "--periwinkle", "--coral", "--starlight"].map(token)
  const line = mix(periwinkle, 28)
  return {
    "cal-bg": "transparent",
    "cal-bg-muted": "transparent",
    "cal-bg-emphasis": mix(navy, 60),
    "cal-bg-subtle": token("--glass-tint"),
    "cal-bg-inverted": starlight,
    "cal-border": line,
    "cal-border-subtle": line,
    "cal-border-muted": line,
    "cal-border-booker": line,
    "cal-border-emphasis": periwinkle,
    "cal-text": starlight,
    "cal-text-emphasis": starlight,
    "cal-text-subtle": token("--ink-lead"),
    "cal-text-muted": token("--ink-faint"),
    "cal-text-inverted": night,
    "cal-brand": coral,
    "cal-brand-emphasis": `color-mix(in srgb, ${coral} 85%, ${starlight})`,
    "cal-brand-text": navy,
  }
}

/** Inline Cal.com booking calendar for `calLink` (user/event), dark, with the visitor's name and email filled in. */
export default function CalEmbed({calLink, name, email}: {calLink: string; name: string; email: string}) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = container.current
    if (!element) return
    const namespace = calLink.replace(/\W/g, "-")
    const cal = loadCal()
    cal("init", namespace, {origin: CAL_ORIGIN})
    cal.ns[namespace]("inline", {
      elementOrSelector: element,
      calLink,
      config: {layout: "month_view", theme: "dark", name, email},
    })
    cal.ns[namespace]("ui", {theme: "dark", layout: "month_view", hideEventTypeDetails: true, cssVarsPerTheme: {dark: calColors()}})
    return () => {
      element.replaceChildren()
    }
  }, [calLink, name, email])

  return <div ref={container} className={styles.calendar} />
}
