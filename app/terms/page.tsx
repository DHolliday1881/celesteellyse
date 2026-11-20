import type {Metadata} from "next"
import type {CSSProperties} from "react"
import SiteFooter from "@/components/SiteFooter"
import {brand, terms} from "@/content/site"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: "Terms · Celeste Ellyse",
  description: "Terms for booking an animal communication or Reiki session with Celeste Ellyse.",
}

// Faint stars across the top: position, size and opacity
const STARS = [
  {x: 6, y: 2.5, size: 1.5, opacity: 0.4},
  {x: 14, y: 8, size: 1, opacity: 0.3},
  {x: 23, y: 4, size: 2, opacity: 0.45},
  {x: 34, y: 10, size: 1, opacity: 0.35},
  {x: 44, y: 1.5, size: 1.5, opacity: 0.3},
  {x: 58, y: 6.5, size: 1, opacity: 0.5},
  {x: 67, y: 3, size: 2, opacity: 0.35},
  {x: 76, y: 11, size: 1.5, opacity: 0.4},
  {x: 86, y: 5, size: 1, opacity: 0.45},
  {x: 94, y: 9, size: 1.5, opacity: 0.3},
] as const

/** Terms page: a centred header, then each term as a heading beside its text. */
export default function TermsPage() {
  const {title, label, intro, updated, sections, questions} = terms

  return (
    <div className={styles.page}>
      <span className={styles.stars} aria-hidden="true">
        {STARS.map((star) => (
          <span
            key={`${star.x},${star.y}`}
            className={styles.star}
            style={
              {
                "--x": `${star.x}%`,
                "--y": `${star.y}%`,
                "--size": `${star.size}px`,
                "--opacity": star.opacity,
              } as CSSProperties
            }
          />
        ))}
      </span>

      <main className={styles.main}>
        <header className={styles.header}>
          <p className={styles.label}>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
            {label}
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
          </p>
          <h1 className={styles.heading}>{title}</h1>
          <p className={styles.intro}>{intro}</p>
          <p className={styles.updated}>{updated}</p>
        </header>

        <div className={styles.sections}>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className={styles.section}>
              <h2 className={styles.sectionHeading}>{section.heading}</h2>
              <div className={styles.body}>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
          <section id={questions.id} className={styles.section}>
            <h2 className={styles.sectionHeading}>{questions.heading}</h2>
            <div className={styles.body}>
              <p>
                {questions.lead}{" "}
                <a href={`mailto:${brand.email}`} className={styles.email}>
                  {brand.email}
                </a>
                .
              </p>
            </div>
          </section>
        </div>

      </main>

      <SiteFooter />
    </div>
  )
}
