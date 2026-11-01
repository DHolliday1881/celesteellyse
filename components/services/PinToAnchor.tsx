"use client"

import {useEffect} from "react"

/** Pins an absolutely positioned backdrop to an anchor so opening the anchor's details grows the page without moving the backdrop. */
export default function PinToAnchor({targetId, anchorId}: {targetId: string; anchorId: string}) {
  useEffect(() => {
    const target = document.getElementById(targetId)
    const anchor = document.getElementById(anchorId)
    const page = target?.offsetParent
    if (!target || !anchor || !(page instanceof HTMLElement)) return

    const answersHeight = () =>
      [...anchor.querySelectorAll("details")].reduce((sum, details) => {
        const summary = details.querySelector("summary")
        return sum + details.getBoundingClientRect().height - (summary?.getBoundingClientRect().height ?? 0)
      }, 0)

    const place = () => {
      target.style.top = `${page.offsetHeight - answersHeight() - target.offsetHeight}px`
      target.style.bottom = "auto"
    }

    place()
    const observer = new ResizeObserver(place)
    observer.observe(page)
    return () => observer.disconnect()
  }, [targetId, anchorId])

  return null
}
