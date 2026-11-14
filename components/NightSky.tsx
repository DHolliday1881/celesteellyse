"use client"

import {useEffect, useRef, useState, useSyncExternalStore} from "react"
import styles from "./NightSky.module.css"

// Star count
const STAR_COUNT_DESKTOP = 1500 // stars on screens 768px and wider
const STAR_COUNT_PHONE = 600 // stars on screens under 768px
const PHONE_MAX_WIDTH = 768

// Twinkle: seconds for one full dim-bright-dim cycle, picked per star
const TWINKLE_PERIOD_MIN = 3
const TWINKLE_PERIOD_MAX = 8
const TWINKLE_MIN_BRIGHTNESS = 0.4 // dimmest a star gets (1 = never dims)

// Parallax: how far the sky shifts, as a share of the screen
const SCROLL_PARALLAX = 0.06 // shift from the top to the bottom of the page
const MOUSE_PARALLAX = 0.015 // shift from the centre to the edge of the screen
const PARALLAX_EASE = 2.5 // how fast it catches up (higher = snappier)

// Thinning: share of stars that fade away by the bottom of the page, faintest first (0 = none, 1 = all)
const SCROLL_THIN = 0.7
const THIN_SOFTNESS = 0.08 // how gradually each star fades out (higher = softer)

// Drift: sideways movement of the whole sky, in screen widths per minute
const DRIFT_SPEED = 0.02

// Colour mix: shares of each colour, the rest is moon white
const COLOR_MOON_WHITE = "#F3F1EA"
const COLOR_PERIWINKLE = "#95A3EC"
const COLOR_LAVENDER = "#B3AEEA"
const SHARE_PERIWINKLE = 0.15
const SHARE_LAVENDER = 0.05

// Size and glow
const STAR_SIZE_MIN = 1.2 // px
const STAR_SIZE_MAX = 2.6 // px
const GLOW_STAR_SHARE = 0.015 // share of stars that are larger with a soft glow
const GLOW_STAR_SIZE = 9 // px, including the glow

// Depth range of the field (camera units)
const DEPTH_NEAR = 10
const DEPTH_FAR = 100
const FOV = 60

// Camera clipping planes
const CLIP_NEAR = 0.1
const CLIP_FAR = DEPTH_FAR * 2

const MAX_DPR = 1.5

const vertexShader = /* glsl */ `
  precision highp float;

  attribute vec3 position;
  attribute float aSize;
  attribute float aSpeed;
  attribute float aPhase;
  attribute float aThreshold;
  attribute vec3 aColor;

  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uAspect;
  uniform float uTanHalfFov;
  uniform float uDrift;
  uniform vec2 uParallax;
  uniform float uPixelRatio;
  uniform float uMinBrightness;
  uniform float uThin;

  varying vec3 vColor;
  varying float vBrightness;
  varying float vGlow;
  varying float vVisible;

  void main() {
    float depth = position.z;
    float nearness = 1.0 - (depth - ${DEPTH_NEAR.toFixed(1)}) / ${(DEPTH_FAR - DEPTH_NEAR).toFixed(1)};

    vec2 p = position.xy;
    p.x = mod(p.x + uDrift * (0.4 + 0.6 * nearness) + 1.1, 2.2) - 1.1;
    p += uParallax * (0.25 + 0.75 * nearness);

    float halfHeight = uTanHalfFov * depth;
    vec3 world = vec3(p.x * halfHeight * uAspect, p.y * halfHeight, -depth);
    gl_Position = projectionMatrix * vec4(world, 1.0);

    gl_PointSize = aSize * mix(0.6, 1.4, nearness) * uPixelRatio;

    float wave = 0.5 + 0.5 * sin(uTime * aSpeed + aPhase);
    vBrightness = mix(uMinBrightness, 1.0, wave);
    vColor = aColor;
    vGlow = step(${(GLOW_STAR_SIZE - 0.5).toFixed(1)}, aSize);
    vVisible = smoothstep(uThin - ${THIN_SOFTNESS.toFixed(3)}, uThin, aThreshold);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec3 vColor;
  varying float vBrightness;
  varying float vGlow;
  varying float vVisible;

  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float disc = 1.0 - smoothstep(0.35, 1.0, r);
    float core = 1.0 - smoothstep(0.0, 0.3, r);
    float halo = exp(-r * r * 5.0) * 0.45;
    float alpha = mix(disc, core + halo, vGlow) * vBrightness * vVisible;
    gl_FragColor = vec4(vColor * alpha, alpha);
  }
`

type Uniform = "projectionMatrix" | "uTime" | "uAspect" | "uTanHalfFov" | "uDrift" | "uParallax" | "uPixelRatio" | "uMinBrightness" | "uThin"
const UNIFORMS: Uniform[] = ["projectionMatrix", "uTime", "uAspect", "uTanHalfFov", "uDrift", "uParallax", "uPixelRatio", "uMinBrightness", "uThin"]

/** Small seeded random generator so the sky is the same on every render. */
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Converts a hex colour to linear RGB, the space the star shader mixes in. */
function linearColor(hex: string) {
  return [1, 3, 5].map((start) => {
    const c = parseInt(hex.slice(start, start + 2), 16) / 255
    return c < 0.04045 ? c * 0.0773993808 : Math.pow(c * 0.9478672986 + 0.0521327014, 2.4)
  })
}

/** Builds star positions (screen-relative x/y plus depth) and per-star attributes. */
function buildStars(count: number) {
  const random = seededRandom(7)
  const white = linearColor(COLOR_MOON_WHITE)
  const periwinkle = linearColor(COLOR_PERIWINKLE)
  const lavender = linearColor(COLOR_LAVENDER)

  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const speeds = new Float32Array(count)
  const phases = new Float32Array(count)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = random() * 2.2 - 1.1
    positions[i * 3 + 1] = random() * 2.2 - 1.1
    positions[i * 3 + 2] = DEPTH_NEAR + Math.pow(random(), 0.7) * (DEPTH_FAR - DEPTH_NEAR)

    const isGlow = random() < GLOW_STAR_SHARE
    sizes[i] = isGlow ? GLOW_STAR_SIZE : STAR_SIZE_MIN + Math.pow(random(), 2) * (STAR_SIZE_MAX - STAR_SIZE_MIN)

    const period = TWINKLE_PERIOD_MIN + random() * (TWINKLE_PERIOD_MAX - TWINKLE_PERIOD_MIN)
    speeds[i] = (Math.PI * 2) / period
    phases[i] = random() * Math.PI * 2

    const pick = random()
    const color = pick < SHARE_PERIWINKLE ? periwinkle : pick < SHARE_PERIWINKLE + SHARE_LAVENDER ? lavender : white
    colors.set(color, i * 3)
  }

  return {
    position: {data: positions, size: 3},
    aSize: {data: sizes, size: 1},
    aSpeed: {data: speeds, size: 1},
    aPhase: {data: phases, size: 1},
    aColor: {data: colors, size: 3},
    aThreshold: {data: fadeOrder(sizes, random), size: 1},
  }
}

/** Spreads stars evenly from 0 to 1 by size with some randomness, so faint stars thin out first. */
function fadeOrder(sizes: Float32Array, random: () => number) {
  const count = sizes.length
  const order = Array.from(sizes, (size, i) => ({i, key: size / STAR_SIZE_MAX + random() * 0.6}))
  order.sort((a, b) => a.key - b.key)
  const thresholds = new Float32Array(count)
  order.forEach(({i}, rank) => {
    thresholds[i] = sizes[i] >= GLOW_STAR_SIZE ? 2 : (rank + 1) / count
  })
  return thresholds
}

/** Perspective projection for a camera at the origin looking down -z. */
function perspective(aspect: number) {
  const f = 1 / Math.tan((FOV * Math.PI) / 360)
  const depth = CLIP_FAR - CLIP_NEAR
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, -(CLIP_FAR + CLIP_NEAR) / depth, -1, 0, 0, (-2 * CLIP_FAR * CLIP_NEAR) / depth, 0])
}

/** Compiles one shader stage, or returns null if it fails. */
function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
}

/** Sets up WebGL on the canvas and uploads the star field; returns null when WebGL can't be set up. */
function createSky(canvas: HTMLCanvasElement, count: number) {
  const options = {alpha: true, antialias: false, depth: false, premultipliedAlpha: true, powerPreference: "low-power"} as const
  const gl = (canvas.getContext("webgl2", options) ?? canvas.getContext("webgl", options)) as WebGLRenderingContext | null
  if (!gl) return null

  const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) return null
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null
  gl.useProgram(program)

  const buffers = Object.entries(buildStars(count)).map(([name, {data, size}]) => {
    const buffer = gl.createBuffer()
    const location = gl.getAttribLocation(program, name)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    if (location >= 0) {
      gl.enableVertexAttribArray(location)
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
    }
    return buffer
  })

  const at = Object.fromEntries(UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)])) as Record<Uniform, WebGLUniformLocation | null>
  gl.uniform1f(at.uTanHalfFov, Math.tan(((FOV / 2) * Math.PI) / 180))
  gl.uniform1f(at.uMinBrightness, TWINKLE_MIN_BRIGHTNESS)

  // Additive blending on a transparent canvas
  gl.enable(gl.BLEND)
  gl.blendEquation(gl.FUNC_ADD)
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE)
  gl.clearColor(0, 0, 0, 0)

  return {
    /** Matches the canvas to its box at the given pixel ratio. */
    resize(width: number, height: number, dpr: number) {
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      gl.viewport(0, 0, Math.floor(width * dpr), Math.floor(height * dpr))
      gl.uniformMatrix4fv(at.projectionMatrix, false, perspective(width / height))
      gl.uniform1f(at.uAspect, width / height)
      gl.uniform1f(at.uPixelRatio, dpr)
    },
    /** Uploads the per-frame motion values. */
    update(time: number, drift: number, parallaxX: number, parallaxY: number, thin: number) {
      gl.uniform1f(at.uTime, time)
      gl.uniform1f(at.uDrift, drift)
      gl.uniform2f(at.uParallax, parallaxX, parallaxY)
      gl.uniform1f(at.uThin, thin)
    },
    /** Draws one frame. */
    draw() {
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.POINTS, 0, count)
    },
    /** Frees the GPU resources and the context. */
    dispose() {
      buffers.forEach((buffer) => gl.deleteBuffer(buffer))
      gl.deleteProgram(program)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    },
  }
}

type Sky = NonNullable<ReturnType<typeof createSky>>

/** Subscribes to a media query for useSyncExternalStore. */
function mediaStore(query: string) {
  return {
    subscribe: (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    get: () => window.matchMedia(query).matches,
  }
}

const reducedMotion = mediaStore("(prefers-reduced-motion: reduce)")
const finePointer = mediaStore("(hover: hover) and (pointer: fine)")

/** Full-screen animated star field fixed behind page content. Fades out over the element with `fadeTargetId`; `density` scales the star count. */
export default function NightSky({fadeTargetId, density = 1}: {fadeTargetId?: string; density?: number}) {
  const still = useSyncExternalStore(reducedMotion.subscribe, reducedMotion.get, () => true)
  const mouse = useSyncExternalStore(finePointer.subscribe, finePointer.get, () => false) && !still
  const [count] = useState(() =>
    Math.round((window.innerWidth < PHONE_MAX_WIDTH ? STAR_COUNT_PHONE : STAR_COUNT_DESKTOP) * density),
  )
  const [failed, setFailed] = useState(false)
  const [tabVisible, setTabVisible] = useState(() => !document.hidden)
  const [onScreen, setOnScreen] = useState(true)
  const [fadedOut, setFadedOut] = useState(false)
  const wrapper = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const sky = useRef<Sky | null>(null)
  const stillRef = useRef(still)

  const motion = useRef({parallaxX: 0, parallaxY: 0, thin: 0, scrollY: 0, thinTarget: 0, mouseX: 0, mouseY: 0})

  useEffect(() => {
    stillRef.current = still
  }, [still])

  useEffect(() => {
    const el = wrapper.current
    const created = canvas.current && createSky(canvas.current, count)
    if (!el || !created) {
      setFailed(true)
      return
    }
    sky.current = created
    const resize = () => {
      const {width, height} = el.getBoundingClientRect()
      if (!width || !height) return
      created.resize(width, height, Math.min(Math.max(1, window.devicePixelRatio || 1), MAX_DPR))
      if (stillRef.current) created.draw()
    }
    resize()
    created.draw()
    const observer = new ResizeObserver(resize)
    observer.observe(el)
    window.addEventListener("resize", resize)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", resize)
      created.dispose()
      sky.current = null
    }
  }, [count])

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  useEffect(() => {
    const el = wrapper.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = wrapper.current
    const fadeTarget = fadeTargetId ? document.getElementById(fadeTargetId) : null
    if (!el || !fadeTarget) return
    const onScroll = () => {
      const rect = fadeTarget.getBoundingClientRect()
      const start = window.innerHeight * 0.75
      const progress = Math.min(Math.max((start - rect.top) / (rect.height * 0.55), 0), 1)
      el.style.opacity = String(1 - progress)
      setFadedOut(progress >= 1)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, {passive: true})
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [fadeTargetId])

  useEffect(() => {
    if (still) return
    const m = motion.current
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      m.scrollY = progress * SCROLL_PARALLAX
      m.thinTarget = progress * SCROLL_THIN
    }
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      m.mouseX = -(event.clientX / window.innerWidth - 0.5) * 2 * MOUSE_PARALLAX
      m.mouseY = (event.clientY / window.innerHeight - 0.5) * 2 * MOUSE_PARALLAX
    }
    onScroll()
    window.addEventListener("scroll", onScroll, {passive: true})
    if (mouse) window.addEventListener("pointermove", onPointer, {passive: true})
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointermove", onPointer)
    }
  }, [still, mouse])

  const running = tabVisible && onScreen && !fadedOut

  useEffect(() => {
    if (still || !running || failed) return
    const m = motion.current
    let frame = 0
    let last = performance.now()
    let elapsed = 0
    const tick = () => {
      const now = performance.now()
      const delta = (now - last) / 1000
      last = now
      elapsed += delta
      const ease = 1 - Math.exp(-Math.min(delta, 0.1) * PARALLAX_EASE)
      m.parallaxX += (m.mouseX - m.parallaxX) * ease
      m.parallaxY += (m.scrollY + m.mouseY - m.parallaxY) * ease
      m.thin += (m.thinTarget - m.thin) * ease
      sky.current?.update(elapsed, (elapsed / 60) * DRIFT_SPEED * 2.2, m.parallaxX, m.parallaxY, m.thin)
      sky.current?.draw()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [still, running, failed])

  if (failed) return <div className={`${styles.sky} ${styles.fallback}`} aria-hidden="true" />

  return (
    <div ref={wrapper} className={styles.sky} aria-hidden="true">
      <canvas ref={canvas} className={styles.canvas} />
    </div>
  )
}
