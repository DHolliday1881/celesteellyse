"use client"

import {useEffect, useRef, useState} from "react"
import ContactForm from "@/components/ContactForm"
import ContactThanks from "@/components/ContactThanks"
import {GROWS_UP, STAYS_OPEN} from "./FooterGap"
import {services} from "@/content/site"
import styles from "./AskForm.module.css"

const FORM_ID = "ask-form"

/** "Didn't find your answer?" with a note form that opens into the space above the footer, then grows upward; once sent it folds to a thank-you. */
export default function AskForm() {
  const {heading, open: openLabel, close: closeLabel} = services.faq.ask
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [round, setRound] = useState(0)
  const toggled = useRef(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const form = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!toggled.current) return
    if (open) form.current?.querySelector<HTMLElement>("input[name=first-name]")?.focus({preventScroll: true})
    else trigger.current?.focus({preventScroll: true})
  }, [open, round])

  /** Opens or closes the form and remembers that the visitor asked for it, so focus can follow. */
  function setForm(next: boolean) {
    toggled.current = true
    setOpen(next)
  }

  /** Swaps the thank-you back for the open, empty form. */
  function sendAnother() {
    toggled.current = true
    setSent(false)
    setRound((count) => count + 1)
  }

  const showForm = open && !sent

  return (
    <div className={styles.ask} data-open={open} data-sent={sent}>
      <div className={styles.rows} inert={sent}>
        <div className={styles.clip}>
          <div className={styles.intro} data-swapped={sent}>
            <h3 className={styles.heading}>{heading}</h3>

            <div className={styles.triggerRow} inert={open}>
              <button
                ref={trigger}
                type="button"
                className={styles.trigger}
                aria-expanded={showForm}
                aria-controls={FORM_ID}
                onClick={() => setForm(true)}
              >
                <span className={styles.triggerText}>{openLabel}</span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.thanksRows} {...STAYS_OPEN}>
        <div className={styles.clip}>
          <ContactThanks active={sent} heading="h3" onSendAnother={sendAnother} className={styles.thanks} />
        </div>
      </div>

      <div id={FORM_ID} ref={form} className={styles.fold} inert={!showForm} {...GROWS_UP}>
        <div className={styles.clip}>
          <div className={styles.formInner}>
            <ContactForm key={round} page="Services" onSent={() => setSent(true)} />
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.close}
        aria-label={closeLabel}
        tabIndex={showForm ? 0 : -1}
        inert={!showForm}
        onClick={() => setForm(false)}
      >
        <span className={styles.closeIcon} aria-hidden="true" />
      </button>
    </div>
  )
}
