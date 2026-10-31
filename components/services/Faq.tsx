import {services} from "@/content/site"
import styles from "./Faq.module.css"

/** Questions & policies accordion; the first answer starts open. */
export default function Faq() {
  const {eyebrow, heading, items} = services.faq

  return (
    <section className={styles.faq} aria-labelledby="faq-heading">
      <header className={styles.head}>
        <p className={`label ${styles.eyebrow}`}>{eyebrow}</p>
        <h2 id="faq-heading">{heading}</h2>
      </header>

      <div className={styles.items}>
        {items.map((item, index) => (
          <details key={item.question} name="faq" open={index === 0} className={styles.item}>
            <summary className={styles.question}>
              {item.question}
              <span className="toggle-icon" aria-hidden="true" />
            </summary>
            <p className={`reveal ${styles.answer}`}>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
