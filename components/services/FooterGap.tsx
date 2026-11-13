"use client"

import {useEffect} from "react"

/** Marks a folding block (fold > clip > content) inside the anchor that grows down into the room below and upward for the rest, both at once. */
export const GROWS_UP = {"data-grows-up": ""}

/** Marks a folding block that counts as open while it has height, so swapping it in grows down into the room below. */
export const STAYS_OPEN = {"data-stays-open": ""}

/** Lets the anchor's card open into its `--gap-room` padding below; `GROWS_UP` blocks split their growth between down and up so the footer stays put. */
export default function FooterGap({anchorId}: {anchorId: string}) {
  useEffect(() => {
    const anchor = document.getElementById(anchorId)
    const card = anchor?.firstElementChild
    if (!anchor || !card) return

    const height = (el: Element) => el.getBoundingClientRect().height
    const room = () => parseFloat(getComputedStyle(anchor).getPropertyValue("--gap-room")) || 0
    const upBlocksHeight = () => [...anchor.querySelectorAll("[data-grows-up]")].reduce((sum, block) => sum + height(block), 0)
    const openHeight = () =>
      [...anchor.querySelectorAll("details")].reduce((sum, details) => {
        const summary = details.querySelector("summary")
        return sum + height(details) - (summary ? height(summary) : 0)
      }, 0) +
      upBlocksHeight() +
      [...anchor.querySelectorAll("[data-stays-open]")].reduce((sum, block) => sum + height(block), 0)

    const fullHeight = (block: Element) => height(block.firstElementChild?.firstElementChild ?? block)

    let closedHeight = height(card)
    let lastUpward = 0

    const place = () => {
      if (openHeight() < 1) closedHeight = height(card)
      const growth = height(card) - closedHeight
      const blocks = [...anchor.querySelectorAll("[data-grows-up]")]
      let roomLeft = Math.max(0, room() - (growth - upBlocksHeight()))
      let upward = 0
      for (const block of blocks) {
        const now = height(block)
        const full = fullHeight(block)
        const down = full > 0 ? now * Math.min(1, roomLeft / full) : 0
        upward += now - down
        roomLeft -= down
      }
      anchor.style.setProperty("--gap-taken", `${Math.min(room(), growth - upward)}px`)
      window.scrollBy({top: upward - lastUpward, behavior: "instant"})
      lastUpward = upward
    }

    place()
    const observer = new ResizeObserver(place)
    observer.observe(card)
    return () => observer.disconnect()
  }, [anchorId])

  return null
}
