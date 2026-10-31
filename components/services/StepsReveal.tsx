"use client"

import {useEffect, useRef, useState, type ReactNode} from "react"

type RevealState = "idle" | "waiting" | "shown"

/** Ordered list that marks itself for a fade-in the first time it scrolls into view. */
export default function StepsReveal({className, children}: {className?: string; children: ReactNode}) {
  const list = useRef<HTMLOListElement>(null)
  const [state, setState] = useState<RevealState>("idle")

  useEffect(() => {
    const el = list.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let first = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false
          if (entry.isIntersecting) return observer.disconnect()
          return setState("waiting")
        }
        if (entry.isIntersecting) {
          setState("shown")
          observer.disconnect()
        }
      },
      {rootMargin: "0px 0px -15% 0px"},
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <ol ref={list} className={className} data-reveal={state}>
      {children}
    </ol>
  )
}
