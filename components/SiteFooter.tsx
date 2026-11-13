import type {CSSProperties} from "react"
import {brand} from "@/content/site"
import Crescent from "./Crescent"
import FooterSocial from "./FooterSocial"
import styles from "./SiteFooter.module.css"

// Stars around the moon: offset from its centre, size and resting opacity
const STARS = [
  {x: -48, y: -20, size: 6, shape: "sparkle", tone: "white", opacity: 0.85, duration: 4.2, delay: 0},
  {x: 40, y: -32, size: 2, shape: "dot", tone: "lavender", opacity: 0.7, duration: 3.4, delay: 1.3},
  {x: 54, y: 6, size: 4, shape: "sparkle", tone: "lavender", opacity: 0.75, duration: 4.8, delay: 2.1},
  {x: -32, y: 20, size: 3, shape: "dot", tone: "white", opacity: 0.55, duration: 3.8, delay: 0.7},
  {x: -66, y: 2, size: 2, shape: "dot", tone: "lavender", opacity: 0.5, duration: 3.1, delay: 2.8},
  {x: 24, y: -50, size: 5, shape: "sparkle", tone: "white", opacity: 0.6, duration: 4.5, delay: 1.8},
] as const

/** Shared footer: crescent and name linking back to the top, email, socials, the care disclaimer and a copyright line; `stars` scatters a few twinkling stars around the moon. */
export default function SiteFooter({stars = false}: {stars?: boolean}) {
  return (
    <footer className={styles.footer}>
      <a href="#top" className={styles.top}>
        <span className={styles.moonGlow}>
          <Crescent className={styles.moon} />
          {stars && (
            <span className={styles.stars} aria-hidden="true">
              {STARS.map((star) => (
                <span
                  key={`${star.x},${star.y}`}
                  className={`${styles.star} ${styles[star.shape]} ${styles[star.tone]}`}
                  style={
                    {
                      "--x": `${star.x}px`,
                      "--y": `${star.y}px`,
                      "--size": `${star.size}px`,
                      "--opacity": star.opacity,
                      "--duration": `${star.duration}s`,
                      "--delay": `${star.delay}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </span>
          )}
        </span>
        <span className={styles.name}>{brand.name}</span>
        <span className="visually-hidden"> (back to top)</span>
      </a>
      <a href={`mailto:${brand.email}`} className={styles.contact}>
        <span className={styles.emailLink}>
          {brand.emailPrompt}
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </span>
        <span className={styles.address}>{brand.email}</span>
      </a>
      <FooterSocial />
      <p className={styles.disclaimer}>{brand.disclaimer}</p>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} {brand.name}
      </p>
    </footer>
  )
}
