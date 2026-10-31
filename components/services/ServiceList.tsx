import type {ServiceGroup} from "@/content/site"
import styles from "./ServiceList.module.css"

/** Grouped service rows with price, Book button and an expandable Details panel. */
export default function ServiceList({groups}: {groups: ServiceGroup[]}) {
  return (
    <div className={styles.groups}>
      {groups.map((group) => (
        <section key={group.id} id={group.id} className={styles.group} aria-labelledby={`${group.id}-heading`}>
          <h2 id={`${group.id}-heading`} className={`label ${styles.groupName}`}>
            {group.name}
          </h2>

          <ul className={styles.rows}>
            {group.services.map((service) => (
              <li key={service.id} className={styles.row}>
                <div className={styles.intro}>
                  <h3 className={styles.name}>{service.name}</h3>
                  <p className={styles.summary}>{service.summary}</p>
                </div>

                <div className={styles.actions}>
                  <span className={styles.price}>{service.price}</span>
                  <a href={service.bookingUrl} className="button" aria-label={`Book ${service.name}`}>
                    Book
                  </a>
                </div>

                <details className={styles.details}>
                  <summary className={styles.toggle}>
                    <span className="toggle-icon" aria-hidden="true" />
                    <span className={styles.whenClosed}>Details</span>
                    <span className={styles.whenOpen}>Close details</span>
                  </summary>
                  <dl className={`reveal ${styles.parts}`}>
                    {service.details.map((part) => (
                      <div key={part.label} className={styles.part}>
                        <dt className={styles.partLabel}>{part.label}</dt>
                        <dd className={styles.partBody}>{part.body}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
