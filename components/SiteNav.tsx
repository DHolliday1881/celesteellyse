"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {useEffect, useRef, useState, type CSSProperties} from "react"
import {brand, nav, social} from "@/content/site"
import Crescent from "./Crescent"
import glimmer from "./Glimmer.module.css"
import styles from "./SiteNav.module.css"
import useGlimmerSweep from "./useGlimmerSweep"

const GLASS_AFTER_PX = 20
const NAV_FIRST_SWEEP_MS = 4_000

/** Sticky top navigation: name on the left, links on the right, a menu panel on phones; frosts once the page has scrolled 20px. */
export default function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const {ref: socialList, sweep, sweeping, done} = useGlimmerSweep<HTMLUListElement>(NAV_FIRST_SWEEP_MS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > GLASS_AFTER_PX)
    onScroll()
    window.addEventListener("scroll", onScroll, {passive: true})
    return () => window.removeEventListener("scroll", onScroll)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
    const onResize = () => !toggle.current?.checkVisibility() && setOpen(false)
    const page = [...document.body.children].filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element !== header.current && !element.inert,
    )
    page.forEach((element) => (element.inert = true))
    window.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)
    return () => {
      page.forEach((element) => (element.inert = false))
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header ref={header} className={styles.header} data-scrolled={scrolled}>
      <Link href="/" className={styles.name} onClick={close}>
        <Crescent className={styles.moon} />
        {brand.name}
      </Link>

      <button
        ref={toggle}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <svg className={styles.icon} viewBox="38 38 24 24" aria-hidden="true">
          <path className={styles.outer} d="M0 70l28-28c2-2 2-2 7-2h64" />
          <path className={styles.middle} d="M0 50h99" />
          <path className={styles.outer} d="M0 30l28 28c2 2 2 2 7 2h64" />
        </svg>
      </button>

      <nav id="site-menu" className={styles.menu} data-open={open} aria-label="Main">
        <ul className={styles.links}>
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.link}
                aria-current={pathname === item.href ? "page" : item.includes && pathname.startsWith(item.includes) ? "true" : undefined}
                onClick={close}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <span className={styles.divider} aria-hidden="true" />
        <ul ref={socialList} className={`${styles.links} ${styles.socials}`}>
          {social.map((item, index) => (
            <li key={item.href}>
              <a href={item.href} className={`${styles.link} ${styles.socialLink}`} target="_blank" rel="noopener noreferrer">
                <span
                  key={sweep}
                  className={sweeping ? `${styles.socialIcon} ${glimmer.glimmer} ${styles.sweep}` : styles.socialIcon}
                  style={{"--order": index, "--icon": `url(${item.icon})`} as CSSProperties}
                  aria-hidden="true"
                  onAnimationEnd={index === social.length - 1 ? done : undefined}
                />
                <span className="visually-hidden">{item.label} (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
