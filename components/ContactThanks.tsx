"use client"

import {useEffect, useRef, useState, type TransitionEvent} from "react"
import {contact} from "@/content/site"
import link from "./ArrowLink.module.css"
import styles from "./ContactThanks.module.css"

/** Thank-you shown after a note is sent; fades in, takes focus, and offers a way back to an empty form. */
export default function ContactThanks({
  active,
  heading: Heading,
  onSendAnother,
  className,
}: {
  active: boolean
  heading: "h2" | "h3"
  onSendAnother: () => void
  className?: string
}) {
  const title = useRef<HTMLHeadingElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (active) title.current?.focus({preventScroll: true})
  }, [active])

  /** Keeps the content mounted until it has finished fading out. */
  function settle(event: TransitionEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && event.propertyName === "opacity") setShown(active)
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${styles.thanks} ${className ?? ""}`}
      data-active={active}
      inert={!active}
      onTransitionEnd={settle}
    >
      {(active || shown) && (
        <>
          <p className={`label ${styles.label}`}>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
            <span>{contact.sent}</span>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
          </p>
          <Heading ref={title} tabIndex={-1} className={styles.heading}>
            {contact.thanks}
          </Heading>
          <p className={styles.note}>{contact.thanksNote}</p>
          <button type="button" className={`${link.link} ${styles.again}`} onClick={onSendAnother}>
            <span className={link.text}>{contact.sendAnother}</span>
            <span className={link.arrow} aria-hidden="true">
              →
            </span>
          </button>
        </>
      )}
    </div>
  )
}
