"use client"

import Image from "next/image"
import {useEffect, useRef, useState, type CSSProperties, type KeyboardEvent} from "react"
import {services} from "@/content/site"
import styles from "./HowSessionsWork.module.css"
import StepsReveal from "./StepsReveal"

const PANEL_ID = "how-sessions-panel"

// Step motion
const ENTER_MS = 600 // how long each step takes to slide up
const ENTER_STAGGER_MS = 120 // gap between steps sliding up, left to right
const LEAVE_MS = 220 // how long each step takes to leave on switch
const LEAVE_STAGGER_MS = 60 // gap between steps leaving, right to left

const motion = {
  "--enter-ms": `${ENTER_MS}ms`,
  "--enter-stagger": `${ENTER_STAGGER_MS}ms`,
  "--leave-ms": `${LEAVE_MS}ms`,
  "--leave-stagger": `${LEAVE_STAGGER_MS}ms`,
} as CSSProperties

/** How it works: a pill toggle between Animal communication and Distance Reiki. */
export default function HowSessionsWork() {
  const {eyebrow, heading, moons, tabs} = services.howItWorks
  const [active, setActive] = useState(0)
  const [shown, setShown] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const swapTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(swapTimer.current), [])

  const select = (index: number) => {
    if (index === active) return
    setActive(index)
    window.clearTimeout(swapTimer.current)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(index)
      return
    }
    setLeaving(true)
    swapTimer.current = window.setTimeout(() => {
      setShown(index)
      setLeaving(false)
    }, LEAVE_MS + LEAVE_STAGGER_MS * (moons.length - 1))
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
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={`label ${styles.eyebrow}`}>{eyebrow}</p>
          <h2 id="how-heading" className={styles.heading}>
            {heading}
          </h2>

          <div
            role="tablist"
            aria-labelledby="how-heading"
            className={styles.toggle}
            style={{"--active": active} as CSSProperties}
            onKeyDown={onKeyDown}
          >
            <span className={styles.thumb} aria-hidden="true" />
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
          </div>
        </header>

        <div
          id={PANEL_ID}
          role="tabpanel"
          aria-labelledby={`how-tab-${tabs[shown].id}`}
          className={styles.panel}
          style={motion}
          data-leaving={leaving || undefined}
        >
          <StepsReveal className={styles.steps}>
            {moons.map((moon, index) => (
              <li
                key={moon}
                className={styles.step}
                style={{"--i": index, "--ri": moons.length - 1 - index} as CSSProperties}
              >
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
