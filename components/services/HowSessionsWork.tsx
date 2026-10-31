"use client"

import Image from "next/image"
import {useEffect, useRef, useState, type CSSProperties, type KeyboardEvent} from "react"
import {services} from "@/content/site"
import styles from "./HowSessionsWork.module.css"
import StepsReveal from "./StepsReveal"

const PANEL_ID = "how-sessions-panel"
const FADE_MS = 250

/** How it works: a horizon-line switch between Animal communication and Distance Reiki over a dusk sky. */
export default function HowSessionsWork() {
  const {eyebrow, heading, moons, tabs} = services.howItWorks
  const [active, setActive] = useState(0)
  const [shown, setShown] = useState(0)
  const [fading, setFading] = useState(false)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const fadeTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(fadeTimer.current), [])

  const select = (index: number) => {
    if (index === active) return
    setActive(index)
    window.clearTimeout(fadeTimer.current)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(index)
      return
    }
    setFading(true)
    fadeTimer.current = window.setTimeout(() => {
      setShown(index)
      setFading(false)
    }, FADE_MS)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: (active + 1) % tabs.length,
      ArrowLeft: (active - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }
    const next = keys[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section className={styles.how} aria-labelledby="how-heading">
      <div className={styles.sky} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={`label ${styles.eyebrow}`}>{eyebrow}</p>
          <h2 id="how-heading" className={styles.heading}>
            {heading}
          </h2>

          <div
            role="tablist"
            aria-labelledby="how-heading"
            className={styles.switch}
            style={{"--active": active} as CSSProperties}
            onKeyDown={onKeyDown}
          >
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                id={`how-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-controls={PANEL_ID}
                tabIndex={index === active ? 0 : -1}
                className={styles.tab}
                onClick={() => select(index)}
              >
                {tab.label}
              </button>
            ))}
            <span className={styles.haze} aria-hidden="true" />
            <span className={styles.line} aria-hidden="true" />
          </div>
        </header>

        <div
          id={PANEL_ID}
          role="tabpanel"
          aria-labelledby={`how-tab-${tabs[shown].id}`}
          className={styles.panel}
          data-fading={fading || undefined}
        >
          <StepsReveal className={styles.steps}>
            {moons.map((moon, index) => (
              <li key={moon} className={styles.step}>
                <span className={styles.moon}>
                  <Image
                    src={moon}
                    alt=""
                    width={96}
                    height={96}
                    sizes="(min-width: 40rem) 96px, 84px"
                    className={styles.moonImage}
                  />
                </span>
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.copyStack}>
                  {tabs.map((tab, t) => (
                    <div key={tab.id} className={styles.copy} data-shown={t === shown || undefined} aria-hidden={t !== shown}>
                      <h3 className={styles.title}>{tab.steps[index].title}</h3>
                      <p className={styles.body}>{tab.steps[index].body}</p>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </StepsReveal>
        </div>
      </div>
    </section>
  )
}
