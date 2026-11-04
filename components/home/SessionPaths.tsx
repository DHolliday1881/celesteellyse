import Link from "next/link"
import {home} from "@/content/site"
import styles from "./SessionPaths.module.css"

/** Two overlapping circles meeting at a point: two beings connecting. */
function ConnectionIcon({className}: {className: string}) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <circle cx="25" cy="32" r="12.5" />
      <circle cx="39" cy="32" r="12.5" />
      <circle cx="25" cy="32" r="6" strokeOpacity="0.55" />
      <circle cx="39" cy="32" r="6" strokeOpacity="0.55" />
      <circle cx="32" cy="32" r="20" strokeOpacity="0.5" />
      <circle cx="32" cy="21.65" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="32" cy="42.35" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="32" cy="32" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Seed of life inside a soft ring: energy and calm. */
function SeedOfLifeIcon({className}: {className: string}) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <circle cx="32" cy="32" r="10" />
      <circle cx="42" cy="32" r="10" />
      <circle cx="22" cy="32" r="10" />
      <circle cx="37" cy="23.34" r="10" />
      <circle cx="27" cy="23.34" r="10" />
      <circle cx="37" cy="40.66" r="10" />
      <circle cx="27" cy="40.66" r="10" />
      <circle cx="32" cy="32" r="20" strokeOpacity="0.5" />
    </svg>
  )
}

const icons = {animal: ConnectionIcon, you: SeedOfLifeIcon}

/** Two ways to connect: a session path for your animal and one for you, each opening its group on Services. */
export default function SessionPaths() {
  const {eyebrow, heading, intro, items} = home.paths

  return (
    <section className={styles.paths} aria-labelledby="paths-heading">
      <div className={styles.head}>
        <p className={`label ${styles.eyebrow}`}>{eyebrow}</p>
        <h2 id="paths-heading" className={styles.heading}>
          {heading}
        </h2>
        <p className={styles.intro}>{intro}</p>
      </div>

      <ul className={styles.list}>
        {items.map((item) => {
          const Icon = icons[item.id]
          return (
            <li key={item.id} className={styles.item}>
              <Icon className={styles.icon} />
              <div className={styles.text}>
                <p className={`label ${styles.itemEyebrow}`}>{item.eyebrow}</p>
                <h3 className={styles.title}>
                  <Link href={item.href} className={styles.link}>
                    {item.title}
                    <span className={styles.arrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                </h3>
                <p className={styles.body}>{item.body}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
