"use client"

import {useEffect, useRef, useState} from "react"
import ContactForm from "@/components/ContactForm"
import ContactThanks from "@/components/ContactThanks"
import {home} from "@/content/site"
import styles from "./SayHello.module.css"

/** Say hello: a lifted card holding the shared contact form, which cross-fades to a thank-you once sent. */
export default function SayHello() {
  const {eyebrow, heading, intro} = home.sayHello
  const [sent, setSent] = useState(false)
  const [round, setRound] = useState(0)
  const compose = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (round > 0) compose.current?.querySelector<HTMLElement>("input[name=first-name]")?.focus({preventScroll: true})
  }, [round])

  /** Swaps the thank-you back for an empty form. */
  function sendAnother() {
    setSent(false)
    setRound((count) => count + 1)
  }

  return (
    <section className={styles.section} aria-labelledby="say-hello-heading">
      <div className={styles.card}>
        <div ref={compose} className={styles.compose} data-swapped={sent} inert={sent}>
          <header className={styles.head}>
            <p className={`label ${styles.eyebrow}`}>
              <span className={styles.dot} aria-hidden="true">
                ·
              </span>
              <span>{eyebrow}</span>
              <span className={styles.dot} aria-hidden="true">
                ·
              </span>
            </p>
            <h2 id="say-hello-heading" className={styles.heading}>
              {heading}
            </h2>
            <p className={styles.intro}>{intro}</p>
          </header>
          <ContactForm key={round} page="Home" onSent={() => setSent(true)} />
        </div>
        <ContactThanks active={sent} heading="h2" onSendAnother={sendAnother} className={styles.thanks} />
      </div>
    </section>
  )
}
