import {services} from "@/content/site"
import AskForm from "./AskForm"
import styles from "./Faq.module.css"

export const FAQ_ID = "faq"

/** Questions & policies on a frosted night glass card, in two labelled columns; one answer open at a time. A note form folds out at the bottom. */
export default function Faq() {
  const {eyebrow, heading, groups} = services.faq

  return (
    <section id={FAQ_ID} className={styles.faq} aria-labelledby="faq-heading">
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
                    <p className={styles.answer}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <AskForm />
      </div>
    </section>
  )
}
