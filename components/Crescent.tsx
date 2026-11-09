import styles from "./Crescent.module.css"

/** Crescent moon mark in the current text colour; inside a link, hovering tips the moon and reveals a periwinkle star. */
export default function Crescent({className}: {className: string}) {
  return (
    <svg className={`${styles.mark} ${className}`} viewBox="6 6 88 88" aria-hidden="true">
      <path
        className={styles.moon}
        d="M89.90 47.21A40 40 0 1 1 45.82 10.22A34.24 34.24 0 1 0 89.90 47.21Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        className={styles.star}
        d="M-4 -11L-1.17 -2.83L7 0L-1.17 2.83L-4 11L-6.83 2.83L-15 0L-6.83 -2.83Z"
        style={{fill: "var(--periwinkle)"}}
      />
    </svg>
  )
}
