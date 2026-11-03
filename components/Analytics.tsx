"use client"

import {usePathname} from "next/navigation"
import Script from "next/script"
import {useEffect, useRef} from "react"

declare global {
  interface Window {
    goatcounter?: {count: (vars?: {path?: string}) => void}
  }
}

/** GoatCounter page views: the script counts the landing page on load, then each client-side route change counts once. */
export default function Analytics() {
  const pathname = usePathname()
  const counted = useRef(pathname)

  useEffect(() => {
    if (pathname === counted.current) return
    counted.current = pathname
    window.goatcounter?.count({path: pathname})
  }, [pathname])

  return (
    <Script
      src="https://gc.zgo.at/count.js"
      strategy="afterInteractive"
      data-goatcounter="https://celesteellyse.goatcounter.com/count"
    />
  )
}
