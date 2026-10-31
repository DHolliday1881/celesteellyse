"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {useEffect, useState} from "react"
import {brand, nav, social} from "@/content/site"
import styles from "./SiteNav.module.css"

/** Top navigation: name on the left, links on the right, a menu panel on phones. */
export default function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.name} onClick={close}>
        {brand.name}
      </Link>

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>

      <nav id="site-menu" className={styles.menu} data-open={open} aria-label="Main">
        <ul className={styles.links}>
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.link}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={close}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <span className={styles.divider} aria-hidden="true" />
        <ul className={styles.links}>
          {social.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
