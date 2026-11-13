"use client"

import {useEffect, useRef, useState} from "react"
import ContactForm from "@/components/ContactForm"
import {services} from "@/content/site"
import styles from "./AskForm.module.css"

const FORM_ID = "ask-form"

/** "Didn't find your answer?" with a note form that folds open under the FAQ. */
export default function AskForm() {
  const {heading, open: openLabel, close: closeLabel} = services.faq.ask
  const [open, setOpen] = useState(false)
  const toggled = useRef(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const form = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!toggled.current) return
    if (open) form.current?.querySelector<HTMLElement>("input:not([type=hidden]):not([name=bot-field])")?.focus()
    else trigger.current?.focus()
  }, [open])

  /** Opens or closes the form and remembers that the visitor asked for it, so focus can follow. */
  function setForm(next: boolean) {
    toggled.current = true
    setOpen(next)
  }

  return (
    <div className={styles.ask} data-open={open}>
      <h3 className={styles.heading}>{heading}</h3>

      <div className={styles.triggerRow} inert={open}>
        <button
          ref={trigger}
          type="button"
          className={styles.trigger}
          aria-expanded={open}
          aria-controls={FORM_ID}
          onClick={() => setForm(true)}
        >
          <span className={styles.triggerText}>{openLabel}</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </button>
      </div>

      <div id={FORM_ID} ref={form} className={styles.fold} inert={!open}>
        <div className={styles.clip}>
          <div className={styles.formInner}>
            <ContactForm page="Services" />
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.close}
        aria-label={closeLabel}
        tabIndex={open ? 0 : -1}
        inert={!open}
        onClick={() => setForm(false)}
      >
        <span className={styles.closeIcon} aria-hidden="true" />
      </button>
    </div>
  )
}
