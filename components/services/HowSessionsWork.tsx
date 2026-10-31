"use client"

import Image from "next/image"
import {useRef, useState, type CSSProperties, type KeyboardEvent} from "react"
import {services} from "@/content/site"
import styles from "./HowSessionsWork.module.css"
import StepsReveal from "./StepsReveal"

const PANEL_ID = "how-sessions-panel"

/** How sessions work: tabs that switch between Animal communication and Reiki steps, flipping each moon. */
export default function HowSessionsWork() {
  const {label, tabs} = services.howItWorks
  const [active, setActive] = useState(0)
  const [switched, setSwitched] = useState(false)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number) => {
    if (index === active) return
    setActive(index)
    setSwitched(true)
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
    <section className={styles.how} aria-label={label}>
      <div role="tablist" aria-label={label} className={styles.tabs} onKeyDown={onKeyDown}>
        {tabs.map((tab, index) => (
          <div key={tab.id} role="none" className={styles.tabSlot}>
            {index > 0 && <span className={styles.divider} aria-hidden="true" />}
            <button
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
          </div>
        ))}
      </div>

      <div id={PANEL_ID} role="tabpanel" aria-labelledby={`how-tab-${tabs[active].id}`}>
        <StepsReveal className={styles.steps}>
          {tabs[0].steps.map((_, index) => (
            <li key={index} className={styles.step} style={{"--i": index} as CSSProperties}>
              <span key={active} className={styles.moon} data-flip={switched || undefined}>
                {tabs.map((tab, t) => (
                  <Image
                    key={tab.id}
                    src={tab.moons[index].src}
                    alt=""
                    width={88}
                    height={88}
                    sizes="(min-width: 64rem) 88px, (min-width: 40rem) 80px, 68px"
                    className={styles.face}
                    data-active={t === active || undefined}
                    data-mirrored={tab.moons[index].mirrored || undefined}
                  />
                ))}
              </span>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <div key={`copy-${active}`} className={styles.copyStack} data-flip={switched || undefined}>
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
