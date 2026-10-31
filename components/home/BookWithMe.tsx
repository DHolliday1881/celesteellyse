import Image from "next/image"
import Link from "next/link"
import {home} from "@/content/site"
import styles from "./BookWithMe.module.css"

/** Book with me: one option for animals, one for people, each with a softly faded photo. */
export default function BookWithMe() {
  const {eyebrow, heading, intro, options} = home.book

  return (
    <section id="book" className={styles.book} aria-labelledby="book-heading">
      <header className={styles.head}>
        <p className={`label ${styles.eyebrow}`}>{eyebrow}</p>
        <h2 id="book-heading" className={styles.heading}>
          {heading}
        </h2>
        <p className={styles.intro}>{intro}</p>
      </header>

      <div className={styles.options}>
        {options.map((option) => (
          <article key={option.title} className={styles.option}>
            <div className={styles.photo}>
              <Image src={option.image} alt={option.imageAlt} fill sizes="(min-width: 48rem) 40vw, 90vw" />
            </div>
            <h3 className={styles.title}>{option.title}</h3>
            <p className={styles.line}>{option.line}</p>
            <Link href={option.cta.href} className="button">
              {option.cta.label}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
