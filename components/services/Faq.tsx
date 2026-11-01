import {services} from "@/content/site"
import styles from "./Faq.module.css"

/** Questions & policies on a frosted night glass card, in two labelled columns; one answer open at a time. */
export default function Faq() {
  const {eyebrow, heading, groups} = services.faq

  return (
    <section className={styles.faq} aria-labelledby="faq-heading">
      <div className={styles.card}>
        <header className={styles.head}>
          <p className={`label ${styles.eyebrow}`}>{eyebrow}</p>
          <h2 id="faq-heading">{heading}</h2>
        </header>

        <div className={styles.groups}>
          {groups.map((group) => (
            <div key={group.label} className={styles.group}>
              <h3 className={`label ${styles.groupLabel}`}>{group.label}</h3>
              <div className={styles.items}>
                {group.items.map((item) => (
                  <details key={item.question} name="faq" className={styles.item}>
                    <summary className={styles.question}>
                      <span>{item.question}</span>
                      <span className="toggle-icon" aria-hidden="true" />
                    </summary>
                    <p className={`reveal ${styles.answer}`}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
