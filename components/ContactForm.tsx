"use client"

import {useId, useState, type FormEvent} from "react"
import {brand, contact} from "@/content/site"
import styles from "./ContactForm.module.css"

type Status = "idle" | "sending" | "sent" | "error"
type FieldName = "first-name" | "email" | "message"
type FieldElement = HTMLInputElement | HTMLTextAreaElement

const FIELDS: FieldName[] = ["first-name", "email", "message"]

// Netlify only accepts fields declared in public/__forms.html; a mismatch is dropped silently
const NETLIFY_FORM_PATH = "/__forms.html"

/** Grows the message field to fit its text so its bottom line sits under the last row. */
function fitToText(event: FormEvent<HTMLTextAreaElement>) {
  const field = event.currentTarget
  field.style.height = "auto"
  field.style.height = `${field.scrollHeight + field.offsetHeight - field.clientHeight}px`
}

/** Returns the message for a field that isn't filled in correctly, or undefined when it is. */
function checkField(field: FieldElement): string | undefined {
  const empty = field.value.trim() === ""
  if (field.name === "first-name") return empty ? contact.errors.firstName : undefined
  if (field.name === "email") {
    if (empty) return contact.errors.email
    return field.validity.typeMismatch ? contact.errors.emailFormat : undefined
  }
  return empty ? contact.errors.message : undefined
}

/** Contact form posting to Netlify Forms; `page` records which page a message came from and `onSent` hands off to the thank-you. */
export default function ContactForm({
  page,
  onSent,
  className,
}: {
  page: "Home" | "Services"
  onSent: () => void
  className?: string
}) {
  const id = useId()
  const [state, setState] = useState<Status>("idle")
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})

  /** Rechecks a field the visitor is fixing, so its message clears once it's right. */
  function handleInput(event: FormEvent<HTMLFormElement>) {
    const field = event.target as FieldElement
    const name = field.name as FieldName
    if (errors[name]) setErrors((current) => ({...current, [name]: checkField(field)}))
  }

  /** Checks every field, then sends them URL-encoded to Netlify and hands off to the thank-you, or shows the error message. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = FIELDS.map((name) => form.elements.namedItem(name) as FieldElement)
    const found = Object.fromEntries(fields.map((field) => [field.name, checkField(field)]))
    setErrors(found)
    const firstInvalid = fields.find((field) => found[field.name])
    if (firstInvalid) return firstInvalid.focus()

    setState("sending")
    const body = Array.from(new FormData(form), ([key, value]) => [key, String(value)])
    try {
      const response = await fetch(NETLIFY_FORM_PATH, {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: new URLSearchParams(body).toString(),
      })
      setState(response.ok ? "sent" : "error")
      if (response.ok) onSent()
    } catch {
      setState("error")
    }
  }

  /** Accessibility props and the inline message for one field. */
  function validation(name: FieldName) {
    const error = errors[name]
    const errorId = `${id}-${name}-error`
    return {
      props: {"aria-invalid": error ? true : undefined, "aria-describedby": error ? errorId : undefined},
      message: error && (
        <p id={errorId} className={styles.fieldError}>
          {error}
        </p>
      ),
    }
  }

  const firstName = validation("first-name")
  const email = validation("email")
  const message = validation("message")
  const sending = state === "sending" || state === "sent"

  return (
    <div className={`${styles.root} ${className ?? ""}`}>
      <form name={contact.formName} className={styles.form} noValidate onInput={handleInput} onSubmit={handleSubmit}>
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
              {...firstName.props}
            />
            {firstName.message}
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
              {...email.props}
            />
            {email.message}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor={`${id}-message`} className={styles.label}>
            {contact.fields.message}
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={2}
            required
            className={`${styles.input} ${styles.textarea}`}
            onInput={fitToText}
            {...message.props}
          />
          {message.message}
        </div>

        <div className={styles.actions}>
          <button type="submit" className={`button ${styles.send}`} disabled={sending}>
            {sending ? contact.sending : contact.send}
          </button>
          <p className={styles.note}>{contact.replyNote}</p>
        </div>
      </form>

      <div aria-live="polite" className={styles.status}>
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
