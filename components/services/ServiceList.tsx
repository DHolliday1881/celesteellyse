import type {ServiceGroup} from "@/content/site"
import styles from "./ServiceList.module.css"

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

/** Grouped service rows with an expandable Details panel and a price, duration and Book row per option. */
export default function ServiceList({groups}: {groups: ServiceGroup[]}) {
  const offsets = groups.map((_, g) => groups.slice(0, g).reduce((sum, group) => sum + group.services.length, 0))

  return (
    <div className={styles.groups}>
      {groups.map((group, g) => (
        <section key={group.id} id={group.id} className={styles.group} aria-labelledby={`${group.id}-heading`}>
          <h2 id={`${group.id}-heading`} className={`label ${styles.groupName}`}>
            {group.name}
          </h2>

          <ul className={styles.rows}>
            {group.services.map((service, index) => (
              <li key={service.id} className={styles.row}>
                <span className={`label ${styles.numeral}`} aria-hidden="true">
                  {NUMERALS[offsets[g] + index]}
                </span>

                <div className={styles.intro}>
                  <h3 className={styles.name}>{service.name}</h3>
                  <p className={styles.summary}>{service.summary}</p>
                </div>

                <details className={styles.details}>
                  <summary className={styles.toggle}>
                    <span className="toggle-icon" aria-hidden="true" />
                    <span className={styles.whenClosed}>Details</span>
                    <span className={styles.whenOpen}>Close details</span>
                  </summary>
                  <dl className={`reveal ${styles.parts}`}>
                    {service.details.map((part, p) => (
                      <div key={part.label} className={styles.part}>
                        <dt className={styles.partLabel}>{part.label}</dt>
                        <dd className={styles.partBody}>
                          {part.body}
                          {service.note && p === service.details.length - 1 && (
                            <p className={styles.note}>{service.note}</p>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </details>

                <div className={styles.actions}>
                  {service.options.map((option) => (
                    <div key={option.url} className={styles.option}>
                      <p className={styles.priceLine}>
                        <span className={styles.price}>{option.price}</span>
                        <span className={styles.duration}>{option.duration}</span>
                      </p>
                      <a
                        href={option.url}
                        className={`button ${styles.book}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Book ${service.name}, ${option.duration} (opens in a new tab)`}
                      >
                        Book
                      </a>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
