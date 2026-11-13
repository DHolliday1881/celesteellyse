"use client"

import dynamic from "next/dynamic"
import {useEffect, useState, useSyncExternalStore} from "react"
import styles from "./NightSky.module.css"

const NightSky = dynamic(() => import("./NightSky"), {ssr: false})

/** Checks once whether the browser can create a WebGL context. */
function hasWebGL() {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"))
  } catch {
    return false
  }
}

let webGLSupport: boolean | undefined
const noSubscribe = () => () => {}
const getWebGLSupport = () => (webGLSupport ??= hasWebGL())

/** Calls `run` once the page has loaded and the browser is idle. Returns a cancel function. */
function afterLoad(run: () => void) {
  const hasIdle = typeof requestIdleCallback === "function"
  let pending = 0
  const schedule = () => {
    pending = hasIdle ? requestIdleCallback(run, {timeout: 2000}) : window.setTimeout(run, 200)
  }
  if (document.readyState === "complete") schedule()
  else window.addEventListener("load", schedule, {once: true})
  return () => {
    window.removeEventListener("load", schedule)
    if (hasIdle) cancelIdleCallback(pending)
    else window.clearTimeout(pending)
  }
}

/** Loads the animated night sky in the browser once the page has loaded, or a static CSS star pattern without WebGL. */
export default function NightSkyLoader({fadeTargetId, density}: {fadeTargetId?: string; density?: number}) {
  const supported = useSyncExternalStore(noSubscribe, getWebGLSupport, () => null)
  const [ready, setReady] = useState(false)

  useEffect(() => afterLoad(() => setReady(true)), [])

  if (supported === null || (supported && !ready)) return null
  if (!supported) return <div className={`${styles.sky} ${styles.fallback}`} aria-hidden="true" />
  return <NightSky fadeTargetId={fadeTargetId} density={density} />
}
