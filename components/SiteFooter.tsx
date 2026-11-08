import {brand, social} from "@/content/site"
import Crescent from "./Crescent"
import styles from "./SiteFooter.module.css"

/** Shared footer: crescent and name linking back to the top, email, socials, the care disclaimer and a copyright line. */
export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <a href="#top" className={styles.top}>
        <Crescent className={styles.moon} />
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
      <ul className={styles.social}>
        {social.map((item) => (
          <li key={item.href}>
            <a href={item.href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
              <span className={styles.socialLabel} data-label={item.label}>
                {item.label}
              </span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.disclaimer}>{brand.disclaimer}</p>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} {brand.name}
      </p>
    </footer>
  )
}
