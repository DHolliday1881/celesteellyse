import {brand, social, socialHandle} from "@/content/site"
import styles from "./SiteFooter.module.css"

/** Shared footer: name, email, socials and the care disclaimers. */
export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.name}>{brand.name}</p>
      <a href={`mailto:${brand.email}`} className={styles.email}>
        {brand.email}
      </a>
      <ul className={styles.social}>
        {social.map((item) => (
          <li key={item.href}>
            <a href={item.href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.handle}>{socialHandle}</p>
      <p className={styles.disclaimer}>{brand.disclaimer}</p>
      <p className={styles.disclaimer}>{brand.careNote}</p>
    </footer>
  )
}
