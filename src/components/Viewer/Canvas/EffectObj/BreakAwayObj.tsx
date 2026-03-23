import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useState,
} from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Public handle ─────────────────────────────────────────────────────────────

export interface BreakAwayHandle {
  /** Trigger the break-away explosion */
  breakAway: () => void
  /** Reset to intact state */
  reset: () => void
}

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface BreakAwayObjProps {
  /**
   * Source mesh — geometry is cloned; original ref is never mutated.
   * Mirrors `nodes.Cat_Buckle` usage with `breakawayBuckleMaterial`.
   */
  mesh: THREE.Mesh
  /**
   * Colour — mirrors dynamic `breakawayBuckleColor` from your store.
   */
  breakawayColor?: THREE.ColorRepresentation
  // ── Material values — exact defaults from breakawayBuckleMaterial ────────
  roughness?: number          // 0.3
  metalness?: number          // 0
  clearcoat?: number          // 1
  clearcoatRoughness?: number // 0.5
  reflectivity?: number       // 0.6
  specularIntensity?: number  // 0.5
  // ── Break-apart physics ──────────────────────────────────────────────────
  /** Number of random chunk pieces (default: 28) */
  chunkCount?: number
  /** Outward explosion speed (default: 2.5) */
  explosionForce?: number
  /** Downward gravity after explosion (default: 3.5) */
  gravity?: number
  /** Seconds until chunks fully fade (default: 1.4) */
  fadeDuration?: number
  /** Called once the break animation completes */
  onBreakComplete?: () => void
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

// ─── Geometry helpers ──────────────────────────────────────────────────────────

function splitIntoChunks(geo: THREE.BufferGeometry, n: number): THREE.BufferGeometry[] {
  const flat = geo.index ? geo.toNonIndexed() : geo
  const pos = flat.attributes.position
  const nor = flat.attributes.normal
  const uv  = flat.attributes.uv

  const totalFaces = pos.count / 3
  // Fisher-Yates shuffle of face indices
  const order = Array.from({ length: totalFaces }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]]
  }

  const perChunk = Math.ceil(totalFaces / n)
  const chunks: THREE.BufferGeometry[] = []

  for (let c = 0; c < n; c++) {
    const faces = order.slice(c * perChunk, (c + 1) * perChunk)
    if (!faces.length) continue

    const verts = new Float32Array(faces.length * 9)
    const norms = nor ? new Float32Array(faces.length * 9) : null
    const uvArr = uv  ? new Float32Array(faces.length * 6) : null

    faces.forEach((f, fi) => {
      for (let v = 0; v < 3; v++) {
        const s = f * 3 + v
        verts[fi * 9 + v * 3 + 0] = pos.getX(s)
        verts[fi * 9 + v * 3 + 1] = pos.getY(s)
        verts[fi * 9 + v * 3 + 2] = pos.getZ(s)
        if (norms && nor) {
          norms[fi * 9 + v * 3 + 0] = nor.getX(s)
          norms[fi * 9 + v * 3 + 1] = nor.getY(s)
          norms[fi * 9 + v * 3 + 2] = nor.getZ(s)
        }
        if (uvArr && uv) {
          uvArr[fi * 6 + v * 2 + 0] = uv.getX(s)
          uvArr[fi * 6 + v * 2 + 1] = uv.getY(s)
        }
      }
    })

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(verts, 3))
    if (norms) g.setAttribute('normal', new THREE.BufferAttribute(norms, 3))
    if (uvArr) g.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2))
    g.computeVertexNormals()
    chunks.push(g)
  }
  return chunks
}

function getCentroid(geo: THREE.BufferGeometry): THREE.Vector3 {
  const p = geo.attributes.position
  const c = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) c.add(new THREE.Vector3(p.getX(i), p.getY(i), p.getZ(i)))
  return c.divideScalar(p.count)
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ChunkData {
  geo: THREE.BufferGeometry
  center: THREE.Vector3
  vel: THREE.Vector3
  angVel: THREE.Euler
}

/**
 * BreakAwayObj
 *
 * Recreates `breakawayBuckleMaterial` (Cat_Buckle) from your codebase:
 *
 * ```js
 * MeshPhysicalMaterial {
 *   roughness: 0.3, metalness: 0, clearcoat: 1,
 *   clearcoatRoughness: 0.5, reflectivity: 0.6, specularIntensity: 0.5,
 *   color: dynamic (breakawayBuckleColor)
 * }
 * ```
 *
 * When `breakAway()` is called via the forwarded ref, the geometry splits into
 * `chunkCount` pieces that fly apart and fade out, simulating a plastic cat-buckle
 * snapping under load. Call `reset()` to restore the intact state.
 *
 * @example
 * const ref = useRef<BreakAwayHandle>(null)
 * <BreakAwayObj ref={ref} mesh={catBuckleMesh} breakawayColor="#1a4f8a" />
 * <button onClick={() => ref.current?.breakAway()}>Snap!</button>
 */
export const BreakAwayObj = forwardRef<BreakAwayHandle, BreakAwayObjProps>(
  function BreakAwayObj(
    {
      mesh,
      breakawayColor = '#1a4f8a',
      roughness = 0.3,
      metalness = 0,
      clearcoat = 1,
      clearcoatRoughness = 0.5,
      reflectivity = 0.6,
      specularIntensity = 0.5,
      chunkCount = 28,
      explosionForce = 2.5,
      gravity = 3.5,
      fadeDuration = 1.4,
      onBreakComplete,
      position,
      rotation,
      scale,
    },
    ref
  ) {
    const intactRef = useRef<THREE.Mesh>(null)
    const chunkRefs = useRef<(THREE.Mesh | null)[]>([])
    const [broken, setBroken] = useState(false)
    const elapsed = useRef(0)
    const done = useRef(false)

    // ── Intact material — breakawayBuckleMaterial profile ─────────────────
    const intactMat = useRef(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(breakawayColor),
        roughness,
        metalness,
        clearcoat,
        clearcoatRoughness,
        reflectivity,
        specularIntensity,
      })
    )

    // ── Chunk material — same profile but transparent for fade-out ─────────
    const chunkMat = useRef(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(breakawayColor),
        roughness,
        metalness,
        clearcoat,
        clearcoatRoughness,
        reflectivity,
        specularIntensity,
        transparent: true,
        opacity: 1,
      })
    )

    // Sync colour + material values reactively
    useEffect(() => {
      for (const mat of [intactMat.current, chunkMat.current]) {
        mat.color.set(breakawayColor)
        mat.roughness = roughness
        mat.metalness = metalness
        mat.clearcoat = clearcoat
        mat.clearcoatRoughness = clearcoatRoughness
        mat.reflectivity = reflectivity
        mat.specularIntensity = specularIntensity
        mat.needsUpdate = true
      }
    }, [breakawayColor, roughness, metalness, clearcoat, clearcoatRoughness, reflectivity, specularIntensity])

    // ── Pre-compute chunk geometries + physics data once ──────────────────
    const chunks = useMemo<ChunkData[]>(() => {
      return splitIntoChunks(mesh.geometry.clone(), chunkCount).map((geo) => {
        const center = getCentroid(geo)
        const dir = center.clone().normalize()
        if (dir.lengthSq() < 0.0001)
          dir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()

        const speed = explosionForce * (0.55 + Math.random() * 0.9)
        const vel = dir.multiplyScalar(speed).add(
          new THREE.Vector3(
            (Math.random() - 0.5) * explosionForce * 0.35,
            Math.random() * explosionForce * 0.6,
            (Math.random() - 0.5) * explosionForce * 0.35
          )
        )
        const angVel = new THREE.Euler(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        )
        return { geo, center, vel, angVel }
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mesh, chunkCount, explosionForce])

    // ── Imperative API ─────────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      breakAway() {
        if (broken) return
        elapsed.current = 0
        done.current = false
        chunkMat.current.opacity = 1
        setBroken(true)
      },
      reset() {
        done.current = false
        elapsed.current = 0
        chunkMat.current.opacity = 1
        setBroken(false)
        chunkRefs.current.forEach((m, i) => {
          if (!m) return
          m.position.copy(chunks[i].center)
          m.rotation.set(0, 0, 0)
        })
      },
    }))

    // ── Frame loop — physics simulation ───────────────────────────────────
    useFrame((_, delta) => {
      // Mirror source transform when no override given
      if (intactRef.current && !position && !rotation && !scale) {
        intactRef.current.position.copy(mesh.position)
        intactRef.current.rotation.copy(mesh.rotation)
        intactRef.current.scale.copy(mesh.scale)
      }

      if (!broken || done.current) return

      elapsed.current += delta
      const t = elapsed.current

      // Fade out chunks in second half of animation
      const fadeStart = fadeDuration * 0.45
      if (t > fadeStart) {
        chunkMat.current.opacity = Math.max(
          0,
          1 - (t - fadeStart) / (fadeDuration - fadeStart)
        )
      }

      // Ballistic motion per chunk: x(t) = x0 + v*t,  y(t) -= ½g*t²
      chunkRefs.current.forEach((m, i) => {
        if (!m) return
        const { center, vel, angVel } = chunks[i]
        m.position.set(
          center.x + vel.x * t,
          center.y + vel.y * t - 0.5 * gravity * t * t,
          center.z + vel.z * t
        )
        m.rotation.set(angVel.x * t, angVel.y * t, angVel.z * t)
      })

      if (t >= fadeDuration && !done.current) {
        done.current = true
        onBreakComplete?.()
      }
    })

    return (
      <group position={position} rotation={rotation} scale={scale}>
        {/* Intact mesh — visible until break is triggered */}
        <mesh
          ref={intactRef}
          geometry={mesh.geometry.clone()}
          material={intactMat.current}
          visible={!broken}
        />

        {/* Chunk pieces — mounted only after break is triggered */}
        {broken &&
          chunks.map(({ geo, center }, i) => (
            <mesh
              key={i}
              ref={(el) => { chunkRefs.current[i] = el }}
              geometry={geo}
              material={chunkMat.current}
              position={[center.x, center.y, center.z]}
            />
          ))}
      </group>
    )
  }
)
