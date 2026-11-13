"use client"

import {useEffect} from "react"

/** Marks a block inside the anchor that grows open, so the backdrop stays put while it does. */
export const GROWS = {"data-grows": ""}

/** Pins an absolutely positioned backdrop to an anchor so opening the anchor's details or `GROWS` blocks grows the page without moving the backdrop. */
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

    const growsHeight = () =>
      [...anchor.querySelectorAll("[data-grows]")].reduce((sum, block) => sum + block.getBoundingClientRect().height, 0)

    const place = () => {
      target.style.top = `${page.offsetHeight - answersHeight() - growsHeight() - target.offsetHeight}px`
      target.style.bottom = "auto"
    }

    place()
    const observer = new ResizeObserver(place)
    observer.observe(page)
    return () => observer.disconnect()
  }, [targetId, anchorId])

  return null
}
