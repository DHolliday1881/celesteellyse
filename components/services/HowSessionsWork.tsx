"use client"

import Image from "next/image"
import {useRef, useState, type CSSProperties, type KeyboardEvent} from "react"
import {services} from "@/content/site"
import styles from "./HowSessionsWork.module.css"
import StepsReveal from "./StepsReveal"

const PANEL_ID = "how-sessions-panel"
const MOON_SIZES = "(min-width: 64rem) 88px, (min-width: 40rem) 80px, 68px"

/** How sessions work: a pill toggle between Animal communication and Reiki that flips the moons and swaps the steps. */
export default function HowSessionsWork() {
  const {eyebrow, heading, moons, tabs} = services.howItWorks
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const mirrored = tabs[active].mirrored

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
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section className={styles.how} aria-labelledby="how-heading">
      <header className={styles.head}>
        <p className={`label ${styles.eyebrow}`}>{eyebrow}</p>
        <h2 id="how-heading">{heading}</h2>
      </header>

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
            onClick={() => setActive(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id={PANEL_ID} role="tabpanel" aria-labelledby={`how-tab-${tabs[active].id}`}>
        <StepsReveal className={styles.steps}>
          {moons.map((moon, index) => (
            <li key={moon.src} className={styles.step} style={{"--i": index} as CSSProperties}>
              <span className={styles.moon} data-mirrored={(moon.flips && mirrored) || undefined}>
                <span className={styles.disc}>
                  <Image src={moon.src} alt="" width={88} height={88} sizes={MOON_SIZES} className={styles.face} />
                  {moon.flips && (
                    <Image
                      src={moon.src}
                      alt=""
                      width={88}
                      height={88}
                      sizes={MOON_SIZES}
                      className={`${styles.face} ${styles.faceMirrored}`}
                    />
                  )}
                </span>
              </span>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <div className={styles.copyStack}>
                {tabs.map((tab, t) => (
                  <div
                    key={tab.id}
                    className={styles.copy}
                    data-active={t === active || undefined}
                    aria-hidden={t !== active}
                  >
                    <h3 className={styles.title}>{tab.steps[index].title}</h3>
                    <p className={styles.body}>{tab.steps[index].body}</p>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </StepsReveal>
      </div>
    </section>
  )
}
