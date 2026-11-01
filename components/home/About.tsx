import Image from "next/image"
import {home, images} from "@/content/site"
import styles from "./About.module.css"

/** About me: arched portrait with a soft glow and crescent beside a short intro. */
export default function About() {
  const {eyebrow, heading, body, signOff, portraitAlt} = home.about

  return (
    <section id="about" className={styles.about} aria-labelledby="about-heading">
      <div className={styles.portraitWrap}>
        <div className={styles.frame}>
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.portrait}>
            <Image src={images.aboutPortrait} alt={portraitAlt} fill sizes="(min-width: 64rem) 300px, (min-width: 48rem) 250px, 200px" />
          </div>
          <span className={styles.moon} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.text}>
        <p className={`label ${styles.eyebrow}`}>{eyebrow}</p>
        <h2 id="about-heading" className={styles.heading}>
          {heading}
        </h2>
        <div className={styles.body}>
          {body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className={styles.signOff}>{signOff}</p>
        </div>
      </div>
    </section>
  )
}
