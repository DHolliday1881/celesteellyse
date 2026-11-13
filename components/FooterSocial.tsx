"use client"

import {useEffect, useRef, useState, type CSSProperties} from "react"
import {social} from "@/content/site"
import glimmer from "./Glimmer.module.css"
import styles from "./SiteFooter.module.css"

const SWEEP_EVERY_MS = 10_000
const FIRST_SWEEP_MS = 800

/** Footer social links; while on screen, a glimmer sweeps across them every ten seconds. */
export default function FooterSocial() {
  const list = useRef<HTMLUListElement>(null)
  const [sweep, setSweep] = useState(0)
  const [sweeping, setSweeping] = useState(false)

  useEffect(() => {
    const element = list.current
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let first: number | undefined
    let repeat: number | undefined
    const start = () => {
      setSweep((count) => count + 1)
      setSweeping(true)
    }
    const stop = () => {
      window.clearTimeout(first)
      window.clearInterval(repeat)
    }

    const observer = new IntersectionObserver(([entry]) => {
      stop()
      if (!entry.isIntersecting) return
      first = window.setTimeout(() => {
        start()
        repeat = window.setInterval(start, SWEEP_EVERY_MS)
      }, FIRST_SWEEP_MS)
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      stop()
    }
  }, [])

  return (
    <ul ref={list} className={styles.social}>
      {social.map((item, index) => (
        <li key={item.href}>
          <a href={item.href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
            <span className={styles.socialLabel} data-label={item.label}>
              <span
                key={sweep}
                className={sweeping ? `${glimmer.glimmer} ${styles.sweep}` : undefined}
                style={{"--order": index} as CSSProperties}
                onAnimationEnd={index === social.length - 1 ? () => setSweeping(false) : undefined}
              >
                {item.label}
              </span>
            </span>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
