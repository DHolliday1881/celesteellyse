"use client"

import {useEffect, useRef, useState} from "react"

const SWEEP_EVERY_MS = 8_000
const FIRST_SWEEP_MS = 800

/** Starts a glimmer sweep every eight seconds while the referenced element is on screen; `sweep` changes each time so the animated element can be re-keyed. */
export default function useGlimmerSweep<T extends Element>() {
  const ref = useRef<T>(null)
  const [sweep, setSweep] = useState(0)
  const [sweeping, setSweeping] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let first: number | undefined
    let repeat: number | undefined
    const start = () => {
      setSweep((count) => count + 1)
      setSweeping(true)
    }
    const stop = () => {
      window.clearTimeout(first)
      window.clearInterval(repeat)
    }

    const observer = new IntersectionObserver(([entry]) => {
      stop()
      if (!entry.isIntersecting) return
      first = window.setTimeout(() => {
        start()
        repeat = window.setInterval(start, SWEEP_EVERY_MS)
      }, FIRST_SWEEP_MS)
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      stop()
    }
  }, [])

  return {ref, sweep, sweeping, done: () => setSweeping(false)}
}
