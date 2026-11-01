import {services} from "@/content/site"
import styles from "./Faq.module.css"

/** Questions & policies on a frosted night glass card; each answer opens on its own. */
export default function Faq() {
  const {eyebrow, heading, items} = services.faq

  return (
    <section className={styles.faq} aria-labelledby="faq-heading">
      <div className={styles.card}>
        <header className={styles.head}>
          <p className={`label ${styles.eyebrow}`}>{eyebrow}</p>
          <h2 id="faq-heading">{heading}</h2>
        </header>

        <div className={styles.items}>
          {items.map((item) => (
            <details key={item.question} className={styles.item}>
              <summary className={styles.question}>
                {item.question}
                <span className="toggle-icon" aria-hidden="true" />
              </summary>
              <p className={`reveal ${styles.answer}`}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
