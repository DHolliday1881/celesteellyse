"use client"

import type {CSSProperties} from "react"
import {social} from "@/content/site"
import glimmer from "./Glimmer.module.css"
import styles from "./SiteFooter.module.css"
import useGlimmerSweep from "./useGlimmerSweep"

/** Footer social links; while on screen, a glimmer sweeps across them every eight seconds. */
export default function FooterSocial() {
  const {ref, sweep, sweeping, done} = useGlimmerSweep<HTMLUListElement>()

  return (
    <ul ref={ref} className={styles.social}>
      {social.map((item, index) => (
        <li key={item.href}>
          <a href={item.href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
            <span className={styles.socialLabel} data-label={item.label}>
              <span
                key={sweep}
                className={sweeping ? `${glimmer.glimmer} ${styles.sweep}` : undefined}
                style={{"--order": index} as CSSProperties}
                onAnimationEnd={index === social.length - 1 ? done : undefined}
              >
                {item.label}
              </span>
            </span>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
