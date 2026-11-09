import type {Metadata} from "next"
import Link from "next/link"
import NightSkyLoader from "@/components/NightSkyLoader"
import styles from "./not-found.module.css"

export const metadata: Metadata = {
  title: "Page not found · Celeste Ellyse",
}

/** 404 page: the night sky over a coral horizon, with a way back home or to sessions. No footer. */
export default function NotFound() {
  return (
    <div className={styles.page}>
      <NightSkyLoader density={0.5} />

      <main className={styles.main}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <div className={styles.text}>
          <p className={`label ${styles.eyebrow}`}>· Page not found ·</p>
          <h1 className={styles.heading}>You&apos;ve wandered off the path.</h1>
          <p className={styles.body}>
            The link may be old, or the page has moved. Let&apos;s get you back somewhere familiar.
          </p>
        </div>
        <div className={styles.actions}>
          <Link href="/" className="button button-tall">
            Back home
          </Link>
          <Link href="/services" className={styles.sessions}>
            <span className={styles.sessionsLabel}>See sessions</span>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </main>
    </div>
  )
}
