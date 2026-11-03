"use client"

import {usePathname} from "next/navigation"
import Script from "next/script"
import {useEffect, useRef, useSyncExternalStore} from "react"

declare global {
  interface Window {
    goatcounter?: {count: (vars?: {path?: string}) => void}
  }
}

// Only the live site counts
const HOSTS = ["celesteellyse.com", "www.celesteellyse.com"]

const subscribe = () => () => {}

/** GoatCounter page views on the live site: the script counts the landing page on load, then each client-side route change counts once. */
export default function Analytics() {
  const pathname = usePathname()
  const counted = useRef(pathname)
  const live = useSyncExternalStore(subscribe, () => HOSTS.includes(window.location.hostname), () => false)

  useEffect(() => {
    if (pathname === counted.current) return
    counted.current = pathname
    window.goatcounter?.count({path: pathname})
  }, [pathname])

  if (!live) return null

  return (
    <Script
      src="https://gc.zgo.at/count.js"
      strategy="afterInteractive"
      data-goatcounter="https://celesteellyse.goatcounter.com/count"
    />
  )
}
