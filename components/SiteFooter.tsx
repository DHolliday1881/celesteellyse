import {brand, social} from "@/content/site"
import styles from "./SiteFooter.module.css"

/** Shared footer: name, email, socials and the care disclaimer. */
export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.name}>{brand.name}</p>
      <div className={styles.contact}>
        <a href={`mailto:${brand.email}`} className={styles.emailLink}>
          {brand.emailPrompt}
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </a>
        <p className={styles.address}>{brand.email}</p>
      </div>
      <ul className={styles.social}>
        {social.map((item) => (
          <li key={item.href}>
            <a href={item.href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.disclaimer}>{brand.disclaimer}</p>
    </footer>
  )
}
