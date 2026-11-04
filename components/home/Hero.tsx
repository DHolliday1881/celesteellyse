import Image from "next/image"
import Link from "next/link"
import {Fragment, type CSSProperties} from "react"
import {brand, home, images} from "@/content/site"
import styles from "./Hero.module.css"

/** Full-screen home hero over a softly blurred photo; two tagline words glimmer once on load. */
export default function Hero() {
  const {eyebrow, tagline, glimmer, cta} = home.hero

  return (
    <section className={styles.hero}>
      <div className={styles.backdrop} aria-hidden="true">
        <Image src={images.homeHero} alt="" fill preload sizes="100vw" className={styles.photo} />
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <p className={`label ${styles.eyebrow}`}>
          {eyebrow.split(" · ").map((phrase) => (
            <span key={phrase}>{phrase}</span>
          ))}
        </p>
        <h1 className={styles.name}>
          {brand.name.split(" ").map((word, index) => (
            <Fragment key={word}>
              {index > 0 && " "}
              <span>{word}</span>
            </Fragment>
          ))}
        </h1>
        <p className={styles.tagline}>
          {tagline.split(new RegExp(`(${glimmer.join("|")})`)).map((part, index) =>
            glimmer.includes(part) ? (
              <span key={index} className={styles.glimmer} style={{"--order": glimmer.indexOf(part)} as CSSProperties}>
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </p>
        <span className={styles.rule} aria-hidden="true" />
        <Link href={cta.href} className="button button-tall">
          {cta.label}
        </Link>
      </div>
    </section>
  )
}
