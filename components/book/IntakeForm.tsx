"use client"

import Link from "next/link"
import {useCallback, useEffect, useId, useRef, useState, type FormEvent} from "react"
import {booking, calLink, fieldNames, type IntakeField, type IntakeForm as Form, type SessionChoice} from "@/content/booking"
import CalEmbed from "./CalEmbed"
import {MAX_REQUEST_BYTES, preparePhoto, type PreparedPhoto} from "./photo"
import styles from "./IntakeForm.module.css"

type Status = "form" | "sending" | "error" | "booking"
type PhotoState = PreparedPhoto | "preparing" | "not-image" | "too-big"
type InputField = Exclude<IntakeField, {kind: "heading"}>

// Netlify only accepts fields declared in public/__forms.html; a mismatch is dropped silently
const NETLIFY_FORM_PATH = "/__forms.html"
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Reads the form page from the address (?page=2 is the second page), counting from 0. */
const pageFromUrl = () => Math.max(0, Number(new URLSearchParams(window.location.search).get("page") ?? 1) - 1)

/** Browser storage that may be unavailable (private mode, blocked site data). */
const storage = {
  read: (key: string) => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? "null") as Record<string, string> | null
    } catch {
      return null
    }
  },
  write: (key: string, value: Record<string, string>) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  },
  clear: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch {}
  },
}

/** Returns the message for a field that isn't filled in correctly, or undefined when it is. */
function checkField(field: InputField, value: string, photo: PhotoState | undefined) {
  if (field.kind === "photo") {
    if (photo === "not-image") return booking.photo.notImage
    if (photo === "too-big") return booking.photo.tooBig
    return field.required && (!photo || photo === "preparing") ? booking.errors.photo : undefined
  }
  const empty = value.trim() === ""
  if (empty) {
    if (!field.required) return undefined
    if (field.kind === "choice") return booking.errors.choice
    if (field.kind === "tel") return booking.errors.phone
    return booking.errors.required
  }
  if (field.kind === "email" && !EMAIL_PATTERN.test(value.trim())) return booking.errors.email
  if (field.kind === "tel" && value.replace(/\D/g, "").length < 7) return booking.errors.phone
  return undefined
}

/** Multi-page intake form posting to Netlify Forms in one submission, then the Cal.com calendar for the session. */
export default function IntakeForm({form}: {form: Form}) {
  const id = useId()
  const storageKey = `intake:${form.slug}`
  const inputs = fieldNames(form)
  const card = useRef<HTMLDivElement>(null)
  const honeypot = useRef<HTMLInputElement>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [photos, setPhotos] = useState<Record<string, PhotoState>>({})
  const [page, setPage] = useState(0)
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [status, setStatus] = useState<Status>("form")
  const [choice, setChoice] = useState<SessionChoice>()
  const [failure, setFailure] = useState<"send" | "tooLarge">("send")
  const restored = useRef(false)

  const total = form.pages.length
  const fields = form.pages[page].fields
  const started = Object.values(answers).some((value) => value.trim() !== "") || Object.keys(photos).length > 0

  // Restore saved answers and start on the first page
  useEffect(() => {
    const saved = storage.read(storageKey)
    const known = new Set(fieldNames(form).map((field) => field.name))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setAnswers(Object.fromEntries(Object.entries(saved).filter(([name]) => known.has(name))))
    if (window.location.search) window.history.replaceState(window.history.state, "", window.location.pathname)
    restored.current = true
  }, [form, storageKey])

  // Save answers as they're typed
  useEffect(() => {
    if (restored.current && status !== "booking") storage.write(storageKey, answers)
  }, [answers, status, storageKey])

  // Browser back and forward move between form pages; from the calendar they leave the page
  useEffect(() => {
    const onPopState = () => {
      const target = pageFromUrl()
      if (status === "booking") return window.history.go(-(target + 1))
      setPage(Math.min(target, total - 1))
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [status, total])

  // The browser's leave-site warning while a started form is unsent
  useEffect(() => {
    if (!started || status === "booking") return
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [started, status])

  // Bring the top of the card into view when the page changes
  const showTop = useCallback(() => {
    const top = card.current?.getBoundingClientRect().top ?? 0
    if (top < 0) card.current?.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"})
  }, [])

  useEffect(showTop, [page, status, choice, showTop])

  /** Messages for this page's fields, shown once the visitor has tried to move on. */
  const errorsFor = (index: number) =>
    Object.fromEntries(
      form.pages[index].fields.flatMap((field) =>
        "name" in field ? [[field.name, checkField(field, answers[field.name] ?? "", photos[field.name])]] : [],
      ),
    ) as Record<string, string | undefined>

  const errors = checked.has(page) ? errorsFor(page) : {}

  /** Checks the current page; focuses the first problem and returns false if there is one. */
  function pageIsValid() {
    const found = errorsFor(page)
    setChecked((current) => new Set(current).add(page))
    const first = fields.find((field) => "name" in field && found[field.name])
    if (first && "name" in first) {
      document.getElementById(`${id}-${first.name}`)?.focus({preventScroll: false})
      return false
    }
    return true
  }

  /** Sends every page's answers and photos together to Netlify, then shows the calendar. */
  async function send() {
    const body = new FormData()
    body.append("form-name", form.formName)
    body.append("bot-field", honeypot.current?.value ?? "")
    for (const field of inputs) {
      const photo = photos[field.name]
      if (field.kind === "photo") {
        if (photo && typeof photo === "object") body.append(field.name, photo.file, photo.file.name)
      } else body.append(field.name, answers[field.name] ?? "")
    }
    const size = Object.values(photos).reduce((sum, photo) => sum + (typeof photo === "object" ? photo.file.size : 0), 0)
    if (size > MAX_REQUEST_BYTES - 64 * 1024) {
      setFailure("tooLarge")
      setStatus("error")
      return
    }

    setStatus("sending")
    try {
      const response = await fetch(NETLIFY_FORM_PATH, {method: "POST", body})
      if (!response.ok) throw new Error(String(response.status))
      storage.clear(storageKey)
      setStatus("booking")
    } catch {
      setFailure("send")
      setStatus("error")
    }
  }

  /** Next moves forward a page; on the last page it sends the form. */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "sending" || !pageIsValid()) return
    if (page < total - 1) {
      window.history.pushState(window.history.state, "", `${window.location.pathname}?page=${page + 2}`)
      setPage(page + 1)
    } else void send()
  }

  /** Prepares a chosen photo in the browser before it's stored for sending. */
  async function choosePhoto(name: string, file: File | undefined) {
    if (!file) return
    setPhotos((current) => ({...current, [name]: "preparing"}))
    const prepared = await preparePhoto(file)
    setPhotos((current) => ({...current, [name]: prepared}))
  }

  const setAnswer = (name: string, value: string) => setAnswers((current) => ({...current, [name]: value}))

  /** One question: label, optional hint for photos, the control and its message. */
  function renderField(field: IntakeField) {
    if (field.kind === "heading") {
      return (
        <p key={field.label} className={styles.lead}>
          {field.label}
        </p>
      )
    }
    const fieldId = `${id}-${field.name}`
    const photoProblem = field.kind === "photo" && typeof photos[field.name] === "string" && photos[field.name] !== "preparing"
    const error = errors[field.name] ?? (photoProblem ? checkField(field, "", photos[field.name]) : undefined)
    const errorId = `${fieldId}-error`
    const invalid = {"aria-invalid": error ? true : undefined, "aria-describedby": error ? errorId : undefined}
    const label = (
      <>
        {field.label}
        {field.required && (
          <span className={styles.required} aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </>
    )
    const message = error && (
      <p id={errorId} className={styles.error}>
        {error}
      </p>
    )

    if (field.kind === "choice") {
      return (
        <fieldset key={field.name} className={styles.field} {...invalid}>
          <legend className={styles.label}>{label}</legend>
          <div className={styles.pills}>
            {field.options.map((option, index) => (
              <label key={option} className={styles.pill}>
                <input
                  id={index === 0 ? fieldId : undefined}
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={answers[field.name] === option}
                  onChange={() => setAnswer(field.name, option)}
                  required={field.required}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {message}
        </fieldset>
      )
    }

    if (field.kind === "photo") {
      const photo = photos[field.name]
      const ready = typeof photo === "object" ? photo : undefined
      return (
        <div key={field.name} className={styles.field}>
          <span className={styles.label} id={`${fieldId}-label`}>
            {label}
          </span>
          <label className={styles.photo}>
            <input
              id={fieldId}
              type="file"
              accept="image/*,.heic,.heif"
              className="visually-hidden"
              aria-labelledby={`${fieldId}-label`}
              aria-required={field.required}
              {...invalid}
              onChange={(event) => choosePhoto(field.name, event.currentTarget.files?.[0])}
            />
            <span className={styles.photoButton}>{ready ? booking.photo.change : booking.photo.choose}</span>
            {photo === "preparing" && <span className={styles.hint}>{booking.photo.preparing}</span>}
            {ready && <span className={styles.hint}>{ready.file.name}</span>}
          </label>
          {message}
        </div>
      )
    }

    const shared = {
      id: fieldId,
      name: field.name,
      value: answers[field.name] ?? "",
      required: field.required,
      autoComplete: field.autoComplete ?? "off",
      onChange: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => setAnswer(field.name, event.currentTarget.value),
      ...invalid,
    }
    return (
      <div key={field.name} className={styles.field}>
        <label htmlFor={fieldId} className={styles.label}>
          {label}
        </label>
        {field.kind === "textarea" ? (
          <textarea {...shared} rows={4} className={`${styles.input} ${styles.textarea}`} />
        ) : (
          <input {...shared} type={field.kind} inputMode={field.kind === "tel" ? "tel" : undefined} className={styles.input} />
        )}
        {message}
      </div>
    )
  }

  const bookingStep = status === "booking"
  const choices = "choices" in form.booking ? form.booking.choices : undefined
  const event = "choices" in form.booking ? choice : form.booking
  const name = answers["first-name"] ?? ""
  const email = answers.email ?? ""

  return (
    <div ref={card} className={`${styles.card} ${bookingStep ? styles.wide : ""}`}>
      <Link href={booking.back.href} className={styles.back}>
        <span aria-hidden="true">←</span>
        {booking.back.label}
      </Link>

      <p className={styles.steps}>
        <span className={bookingStep ? styles.stepDone : styles.stepCurrent}>{form.step}</span>
        <span className={styles.stepRule} aria-hidden="true" />
        <span className={bookingStep ? styles.stepCurrent : styles.stepNext}>{booking.steps.pickTime}</span>
      </p>

      {bookingStep ? (
        <div key="booking" className={styles.panel}>
          <h1 className={styles.heading}>{booking.thanks}</h1>
          {choices && !choice && (
            <div className={styles.field}>
              <p className={styles.label}>{booking.choose}</p>
              <div className={styles.choices}>
                {choices.map((option) => (
                  <button key={option.event} type="button" className={styles.choice} onClick={() => setChoice(option)}>
                    <span>{option.label}</span>
                    <span className={styles.price}>{option.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {event && (
            <>
              <CalEmbed calLink={calLink(event)} name={name} email={email} />
              <a href={`https://cal.com/${calLink(event)}`} className={styles.trouble} target="_blank" rel="noopener noreferrer">
                {booking.trouble}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </>
          )}
        </div>
      ) : (
        <form key={page} name={form.formName} className={styles.panel} noValidate onSubmit={handleSubmit}>
          <p hidden>
            <label>
              Leave this empty: <input ref={honeypot} name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>

          <div className={styles.intro}>
            <h1 className={styles.heading}>{page === 0 ? form.title : form.pages[page].label}</h1>
            {page === 0 && <p className={styles.introText}>{form.intro}</p>}
          </div>

          <div className={styles.progress}>
            <p className={styles.progressText}>
              <span>{form.pages[page].label}</span>
              <span>{booking.progress(page + 1, total)}</span>
            </p>
            <span className={styles.track} aria-hidden="true">
              <span className={styles.fill} style={{width: `${((page + 1) / total) * 100}%`}} />
            </span>
          </div>

          <div className={styles.fields}>{fields.map(renderField)}</div>

          {status === "error" && (
            <p className={styles.sendError} role="alert">
              {booking.errors[failure]}
            </p>
          )}

          <div className={styles.actions}>
            {page > 0 && (
              <button type="button" className={styles.backButton} onClick={() => window.history.back()}>
                <span aria-hidden="true">←</span>
                {booking.buttons.back}
              </button>
            )}
            <button type="submit" className={`button button-tall ${styles.next}`} disabled={status === "sending"}>
              {status === "sending"
                ? booking.buttons.sending
                : page < total - 1
                  ? booking.buttons.next
                  : status === "error"
                    ? booking.buttons.retry
                    : booking.buttons.submit}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
