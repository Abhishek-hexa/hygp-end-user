import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import * as THREE from 'three'

export interface PlasticObjProps {
  /**
   * Source mesh — geometry AND inherited maps are read from this.
   * Maps (normalMap, roughnessMap, metalnessMap) are pulled from
   * `mesh.material` if it is a MeshStandardMaterial / MeshPhysicalMaterial,
   * mirroring `nodes['Buckle'].material` map inheritance.
   */
  mesh: THREE.Mesh
  /** Colour override — if omitted, no color is set (inherits texture) */
  color?: THREE.ColorRepresentation
  /**
   * Path to the HDR environment map.
   * Mirrors RGBELoader('/assets/texture/photo_studio_01_1k.hdr').
   */
  hdrPath?: string
  /**
   * Pass an already-loaded env map to skip re-loading the HDR.
   * Takes precedence over `hdrPath`.
   */
  envMap?: THREE.Texture | null
  // ── Allow overriding specific material values ─────────────────────────────
  roughness?: number          // default 1
  metalness?: number          // default 0
  clearcoat?: number          // default 0.3
  clearcoatRoughness?: number // default 1
  reflectivity?: number       // default 1
  envMapIntensity?: number    // default 1
  /** X/Y scale of the normal map. Default: Vector2(0.8, -0.8) */
  normalScaleX?: number
  normalScaleY?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

/**
 * PlasticObj
 *
 * Recreates `plasticBuckleMaterialPhysical` from your codebase:
 *
 * ```js
 * MeshPhysicalMaterial {
 *   roughness: 1,
 *   metalness: 0,
 *   clearcoat: 0.3,
 *   clearcoatRoughness: 1,
 *   reflectivity: 1,
 *   envMapIntensity: 1,
 *   toneMapped: false,
 *   normalScale: Vector2(0.8, -0.8),
 *   normalMap, roughnessMap, metalnessMap: inherited from nodes['Buckle'].material,
 *   envMap: RGBELoader HDR
 * }
 * ```
 *
 * Maps are automatically pulled from `mesh.material` if it carries them.
 * The source mesh/material is never mutated.
 */
export function PlasticObj({
  mesh,
  color,
  hdrPath = '/assets/texture/photo_studio_01_1k.hdr',
  envMap: envMapProp = null,
  roughness = 1,
  metalness = 0,
  clearcoat = 0.3,
  clearcoatRoughness = 1,
  reflectivity = 1,
  envMapIntensity = 1,
  normalScaleX = 0.8,
  normalScaleY = -0.8,
  position,
  rotation,
  scale,
}: PlasticObjProps) {
  const ref = useRef<THREE.Mesh>(null)
  const geometry = mesh.geometry.clone()

  // ── Inherit maps from source mesh material (mirrors nodes['Buckle'].material) ──
  const srcMat = mesh.material instanceof THREE.MeshStandardMaterial
    ? mesh.material
    : null

  const matRef = useRef(
    new THREE.MeshPhysicalMaterial({
      ...(color !== undefined ? { color: new THREE.Color(color) } : {}),
      roughness,
      metalness,
      clearcoat,
      clearcoatRoughness,
      reflectivity,
      envMapIntensity,
      toneMapped: false,
      normalScale: new THREE.Vector2(normalScaleX, normalScaleY),
      // Inherit texture maps from source material
      ...(srcMat?.normalMap    ? { normalMap: srcMat.normalMap }       : {}),
      ...(srcMat?.roughnessMap ? { roughnessMap: srcMat.roughnessMap } : {}),
      ...(srcMat?.metalnessMap ? { metalnessMap: srcMat.metalnessMap } : {}),
    })
  )

  // Sync props reactively
  useEffect(() => {
    const mat = matRef.current
    if (color !== undefined) mat.color.set(color)
    mat.roughness = roughness
    mat.metalness = metalness
    mat.clearcoat = clearcoat
    mat.clearcoatRoughness = clearcoatRoughness
    mat.reflectivity = reflectivity
    mat.envMapIntensity = envMapIntensity
    mat.normalScale.set(normalScaleX, normalScaleY)
    mat.needsUpdate = true
  }, [color, roughness, metalness, clearcoat, clearcoatRoughness, reflectivity, envMapIntensity, normalScaleX, normalScaleY])

  // Load HDR env map — mirrors RGBELoader + EquirectangularReflectionMapping
  useEffect(() => {
    if (envMapProp !== null) {
      matRef.current.envMap = envMapProp
      matRef.current.needsUpdate = true
      return
    }

    const rgbeLoader = new RGBELoader()
    rgbeLoader.load(hdrPath, (hdr) => {
      hdr.mapping = THREE.EquirectangularReflectionMapping
      matRef.current.envMap = hdr
      matRef.current.needsUpdate = true
    })
  }, [hdrPath, envMapProp])

  useFrame(() => {
    if (!ref.current || position || rotation || scale) return
    ref.current.position.copy(mesh.position)
    ref.current.rotation.copy(mesh.rotation)
    ref.current.scale.copy(mesh.scale)
  })

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={matRef.current}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  )
}
