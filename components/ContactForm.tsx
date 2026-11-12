"use client"

import {useEffect, useId, useRef, useState, type FormEvent} from "react"
import {brand, contact} from "@/content/site"
import styles from "./ContactForm.module.css"

type Status = "idle" | "sending" | "sent" | "error"

// Netlify only accepts fields declared in public/__forms.html; a mismatch is dropped silently
const NETLIFY_FORM_PATH = "/__forms.html"

/** Grows the message field to fit its text so its bottom line sits under the last row. */
function fitToText(event: FormEvent<HTMLTextAreaElement>) {
  const field = event.currentTarget
  field.style.height = "auto"
  field.style.height = `${field.scrollHeight + field.offsetHeight - field.clientHeight}px`
}

/** Contact form posting to Netlify Forms; `page` records which page a message came from. */
export default function ContactForm({page, className}: {page: "Home" | "Services"; className?: string}) {
  const id = useId()
  const status = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<Status>("idle")

  useEffect(() => {
    if (state === "sent") status.current?.focus()
  }, [state])

  /** Sends the fields URL-encoded to Netlify and swaps in the thank-you or error message. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState("sending")
    const fields = Array.from(new FormData(event.currentTarget), ([key, value]) => [key, String(value)])
    try {
      const response = await fetch(NETLIFY_FORM_PATH, {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: new URLSearchParams(fields).toString(),
      })
      setState(response.ok ? "sent" : "error")
    } catch {
      setState("error")
    }
  }

  const sending = state === "sending"

  return (
    <div className={`${styles.root} ${className ?? ""}`}>
      {state !== "sent" && (
        <form name={contact.formName} className={styles.form} onSubmit={handleSubmit}>
          <input type="hidden" name="form-name" value={contact.formName} />
          <input type="hidden" name="page" value={page} />
          <p hidden>
            <label>
              Leave this empty: <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor={`${id}-first-name`} className={styles.label}>
                {contact.fields.firstName}
              </label>
              <input
                id={`${id}-first-name`}
                name="first-name"
                type="text"
                autoComplete="given-name"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor={`${id}-email`} className={styles.label}>
                {contact.fields.email}
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor={`${id}-message`} className={styles.label}>
              {contact.fields.message}
            </label>
            <textarea
              id={`${id}-message`}
              name="message"
              rows={3}
              required
              className={`${styles.input} ${styles.textarea}`}
              onInput={fitToText}
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={`button ${styles.send}`} disabled={sending}>
              {sending ? contact.sending : contact.send}
            </button>
            <p className={styles.note}>{contact.replyNote}</p>
          </div>
        </form>
      )}

      <div ref={status} tabIndex={-1} aria-live="polite" className={styles.status}>
        {state === "sent" && (
          <>
            <p className={styles.thanks}>{contact.thanks}</p>
            <p className={styles.thanksNote}>{contact.thanksNote}</p>
          </>
        )}
        {state === "error" && (
          <p className={styles.error}>
            {contact.errorLead}{" "}
            <a href={`mailto:${brand.email}`} className={styles.errorLink}>
              {brand.email}
            </a>
            .
          </p>
        )}
      </div>
    </div>
  )
}
