"use client"

import dynamic from "next/dynamic"
import {useSyncExternalStore} from "react"
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

/** Loads the animated night sky in the browser only, or a static CSS star pattern without WebGL. */
export default function NightSkyLoader({fadeTargetId, density}: {fadeTargetId?: string; density?: number}) {
  const supported = useSyncExternalStore(noSubscribe, getWebGLSupport, () => null)

  if (supported === null) return null
  if (!supported) return <div className={`${styles.sky} ${styles.fallback}`} aria-hidden="true" />
  return <NightSky fadeTargetId={fadeTargetId} density={density} />
}
