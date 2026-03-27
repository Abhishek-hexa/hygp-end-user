import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { loadHdrEnvMapCached } from './hdrEnvMapCache'

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
   * Mirrors RGBELoader('/assets/texture/texture/photo_studio_01_1k.hdr').
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
  specularIntensity?: number  // default 1
  /** X/Y scale of the normal map. Default: Vector2(0.8, -0.8) */
  normalScaleX?: number
  normalScaleY?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}


export function PlasticObj({
  mesh,
  color,
  hdrPath = '/assets/texture/texture/photo_studio_01_1k.hdr',
  envMap: envMapProp = null,
  roughness = 1,
  metalness = 0,
  clearcoat = 0.3,
  clearcoatRoughness = 1,
  reflectivity = 1,
  envMapIntensity = 1,
  specularIntensity = 1,
  normalScaleX = 0.8,
  normalScaleY = -0.8,
  position,
  rotation,
  scale,
}: PlasticObjProps) {
  const ref = useRef<THREE.Mesh>(null)
  const geometry = mesh.geometry;

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
      specularIntensity,
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
    mat.specularIntensity = specularIntensity
    mat.normalScale.set(normalScaleX, normalScaleY)
    mat.needsUpdate = true
    mat.toneMapped = false
    mat.envMapIntensity = 1
  }, [color, roughness, metalness, clearcoat, clearcoatRoughness, reflectivity, envMapIntensity, specularIntensity, normalScaleX, normalScaleY])

  // Load HDR env map — mirrors RGBELoader + EquirectangularReflectionMapping
  useEffect(() => {
    if (envMapProp !== null) {
      matRef.current.envMap = envMapProp
      matRef.current.needsUpdate = true
      return
    }

    let isMounted = true

    loadHdrEnvMapCached(hdrPath)
      .then((hdr) => {
        if (!isMounted) return
        hdr.mapping = THREE.EquirectangularReflectionMapping
        matRef.current.envMap = hdr
        matRef.current.needsUpdate = true
      })
      .catch((error) => {
        console.error(`Failed to load HDR env map: ${hdrPath}`, error)
      })

    return () => {
      isMounted = false
    }
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
