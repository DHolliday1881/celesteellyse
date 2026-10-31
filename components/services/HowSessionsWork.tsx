import Image from "next/image"
import {images, services} from "@/content/site"
import styles from "./HowSessionsWork.module.css"

/** Four numbered steps, each marked by a moon phase. */
export default function HowSessionsWork() {
  const {eyebrow, heading, steps} = services.howItWorks

  return (
    <section className={styles.how} aria-labelledby="how-heading">
      <header className={styles.head}>
        <p className={`label ${styles.eyebrow}`}>{eyebrow}</p>
        <h2 id="how-heading">{heading}</h2>
      </header>

      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li key={step.title} className={styles.step}>
            <Image src={images.moons[index]} alt="" width={72} height={72} sizes="72px" className={styles.moon} />
            <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.body}>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
