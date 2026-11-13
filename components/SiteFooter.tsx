import type {CSSProperties} from "react"
import {brand} from "@/content/site"
import Crescent from "./Crescent"
import FooterSocial from "./FooterSocial"
import styles from "./SiteFooter.module.css"

// Stars across the footer: position, size and resting opacity
const STARS = [
  {x: 8.6, y: 18, size: 2.5, tone: "white", opacity: 0.7, duration: 4.2, delay: 0},
  {x: 14.5, y: 40, size: 1.5, tone: "lavender", opacity: 0.5, duration: 3.4, delay: 1.3},
  {x: 18.5, y: 62, size: 2, tone: "white", opacity: 0.4, duration: 4.8, delay: 2.1},
  {x: 27.5, y: 30, size: 2.5, tone: "lavender", opacity: 0.75, duration: 3.8, delay: 0.7},
  {x: 33.6, y: 52, size: 1.5, tone: "white", opacity: 0.45, duration: 3.1, delay: 2.8},
  {x: 38.5, y: 12, size: 2, tone: "white", opacity: 0.55, duration: 4.5, delay: 1.8},
  {x: 50.6, y: 8, size: 1.5, tone: "lavender", opacity: 0.5, duration: 3.6, delay: 3.2},
  {x: 62.6, y: 16, size: 2, tone: "white", opacity: 0.6, duration: 4.1, delay: 0.4},
  {x: 71.6, y: 48, size: 1.5, tone: "lavender", opacity: 0.45, duration: 4.9, delay: 2.4},
  {x: 82.6, y: 24, size: 2.5, tone: "white", opacity: 0.7, duration: 3.3, delay: 1},
  {x: 86.5, y: 40, size: 2, tone: "lavender", opacity: 0.6, duration: 4.4, delay: 3.6},
  {x: 91.6, y: 58, size: 1.5, tone: "white", opacity: 0.4, duration: 3.9, delay: 1.6},
] as const

/** Shared footer: crescent and name linking back to the top, socials, the care disclaimer and a copyright line; `stars` scatters twinkling stars across it. */
export default function SiteFooter({stars = false}: {stars?: boolean}) {
  return (
    <footer className={styles.footer}>
      {stars && (
        <span className={styles.stars} aria-hidden="true">
          {STARS.map((star) => (
            <span
              key={`${star.x},${star.y}`}
              className={`${styles.star} ${styles[star.tone]}`}
              style={
                {
                  "--x": `${star.x}%`,
                  "--y": `${star.y}%`,
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
      <a href="#top" className={styles.top}>
        <span className={styles.moonGlow}>
          <Crescent className={styles.moon} />
        </span>
        <span className={styles.name}>{brand.name}</span>
        <span className="visually-hidden"> (back to top)</span>
      </a>
      <FooterSocial />
      <p className={styles.disclaimer}>{brand.disclaimer}</p>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} {brand.name}
      </p>
    </footer>
  )
}
