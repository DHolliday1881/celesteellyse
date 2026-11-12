import ContactForm from "@/components/ContactForm"
import {home} from "@/content/site"
import styles from "./SayHello.module.css"

/** Say hello: a lifted card holding the shared contact form. */
export default function SayHello() {
  const {eyebrow, heading, intro} = home.sayHello

  return (
    <section className={styles.section} aria-labelledby="say-hello-heading">
      <div className={styles.card}>
        <header className={styles.head}>
          <p className={`label ${styles.eyebrow}`}>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
            <span>{eyebrow}</span>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
          </p>
          <h2 id="say-hello-heading" className={styles.heading}>
            {heading}
          </h2>
          <p className={styles.intro}>{intro}</p>
        </header>
        <ContactForm page="Home" />
      </div>
    </section>
  )
}
