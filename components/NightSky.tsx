"use client"

import {Canvas, useFrame, useThree} from "@react-three/fiber"
import {useEffect, useMemo, useRef, useState, useSyncExternalStore} from "react"
import * as THREE from "three"
import styles from "./NightSky.module.css"

// Star count
const STAR_COUNT_DESKTOP = 3000 // stars on screens 768px and wider
const STAR_COUNT_PHONE = 1200 // stars on screens under 768px
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

const MAX_DPR = 1.5

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aSpeed;
  attribute float aPhase;
  attribute float aThreshold;
  attribute vec3 aColor;

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

/** Small seeded random generator so the sky is the same on every render. */
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Builds star positions (screen-relative x/y plus depth) and per-star attributes. */
function buildStars(count: number) {
  const random = seededRandom(7)
  const white = new THREE.Color(COLOR_MOON_WHITE)
  const periwinkle = new THREE.Color(COLOR_PERIWINKLE)
  const lavender = new THREE.Color(COLOR_LAVENDER)

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
    color.toArray(colors, i * 3)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1))
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute("aThreshold", new THREE.BufferAttribute(fadeOrder(sizes, random), 1))
  return geometry
}

/** Fresh uniform values for the star shader. */
function createUniforms() {
  return {
    uTime: {value: 0},
    uAspect: {value: 1},
    uTanHalfFov: {value: Math.tan(THREE.MathUtils.degToRad(FOV / 2))},
    uDrift: {value: 0},
    uParallax: {value: new THREE.Vector2()},
    uPixelRatio: {value: 1},
    uMinBrightness: {value: TWINKLE_MIN_BRIGHTNESS},
    uThin: {value: 0},
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

/** The star field itself: one Points object animated in its shader. */
function Stars({count, still, mouse}: {count: number; still: boolean; mouse: boolean}) {
  const {size, viewport, invalidate} = useThree()
  const geometry = useMemo(() => buildStars(count), [count])
  const material = useRef<THREE.ShaderMaterial>(null)
  const [uniforms] = useState(createUniforms)

  const target = useRef(new THREE.Vector2())
  const mouseTarget = useRef(new THREE.Vector2())
  const thinTarget = useRef(0)

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => {
    if (!material.current) return
    material.current.uniforms.uAspect.value = size.width / size.height
    material.current.uniforms.uPixelRatio.value = viewport.dpr
    invalidate()
  }, [size, viewport.dpr, invalidate])

  useEffect(() => {
    if (still) return
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      target.current.y = progress * SCROLL_PARALLAX
      thinTarget.current = progress * SCROLL_THIN
    }
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      mouseTarget.current.set(
        -(event.clientX / window.innerWidth - 0.5) * 2 * MOUSE_PARALLAX,
        (event.clientY / window.innerHeight - 0.5) * 2 * MOUSE_PARALLAX,
      )
    }
    onScroll()
    window.addEventListener("scroll", onScroll, {passive: true})
    if (mouse) window.addEventListener("pointermove", onPointer, {passive: true})
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointermove", onPointer)
    }
  }, [still, mouse])

  useFrame((state, delta) => {
    if (still || !material.current) return
    const u = material.current.uniforms
    u.uTime.value = state.clock.elapsedTime
    u.uDrift.value = (state.clock.elapsedTime / 60) * DRIFT_SPEED * 2.2
    const ease = 1 - Math.exp(-Math.min(delta, 0.1) * PARALLAX_EASE)
    const parallax = u.uParallax.value as THREE.Vector2
    parallax.x += (target.current.x + mouseTarget.current.x - parallax.x) * ease
    parallax.y += (target.current.y + mouseTarget.current.y - parallax.y) * ease
    u.uThin.value += (thinTarget.current - u.uThin.value) * ease
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/** Full-screen animated star field fixed behind page content. Fades out over the element with `fadeTargetId`. */
export default function NightSky({fadeTargetId}: {fadeTargetId?: string}) {
  const still = useSyncExternalStore(reducedMotion.subscribe, reducedMotion.get, () => true)
  const mouse = useSyncExternalStore(finePointer.subscribe, finePointer.get, () => false)
  const [count] = useState(() => (window.innerWidth < PHONE_MAX_WIDTH ? STAR_COUNT_PHONE : STAR_COUNT_DESKTOP))
  const [tabVisible, setTabVisible] = useState(() => !document.hidden)
  const [onScreen, setOnScreen] = useState(true)
  const [fadedOut, setFadedOut] = useState(false)
  const wrapper = useRef<HTMLDivElement>(null)

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
      const progress = THREE.MathUtils.clamp((start - rect.top) / (rect.height * 0.55), 0, 1)
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

  const running = tabVisible && onScreen && !fadedOut

  return (
    <div ref={wrapper} className={styles.sky} aria-hidden="true">
      <Canvas
        dpr={[1, MAX_DPR]}
        frameloop={still ? "demand" : running ? "always" : "never"}
        camera={{fov: FOV, near: 0.1, far: DEPTH_FAR * 2, position: [0, 0, 0]}}
        gl={{alpha: true, antialias: false, powerPreference: "low-power"}}
      >
        <Stars count={count} still={still} mouse={mouse && !still} />
      </Canvas>
    </div>
  )
}
