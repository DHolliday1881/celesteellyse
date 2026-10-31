import Image from "next/image"
import {home, images} from "@/content/site"
import styles from "./About.module.css"

/** About me: tall arched portrait beside a short intro. */
export default function About() {
  const {eyebrow, heading, body, portraitAlt} = home.about

  return (
    <section id="about" className={styles.about} aria-labelledby="about-heading">
      <div className={styles.portraitWrap}>
        <div className={styles.portrait}>
          <Image src={images.aboutPortrait} alt={portraitAlt} fill sizes="(min-width: 48rem) 300px, 220px" />
        </div>
      </div>

      <div className={styles.text}>
        <p className={`label ${styles.eyebrow}`}>{eyebrow}</p>
        <h2 id="about-heading" className={styles.heading}>
          {heading}
        </h2>
        <p className={styles.body}>{body}</p>
      </div>
    </section>
  )
}
