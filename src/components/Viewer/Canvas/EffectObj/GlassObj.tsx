import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { loadHdrEnvMapCached } from './hdrEnvMapCache'
import { useMyTexture } from '../../../../hooks/useMyTexture'

export interface GlassObjProps {
  /**
   * Source mesh — geometry is **cloned** (mirrors `nodes['Glass'].geometry.clone()`).
   * Original is never mutated.
   */
  mesh: THREE.Mesh
  /**
   * Path to the logo / overlay PNG.
   * Mirrors TextureLoader('/assets/texture/plasticLogo.png') with sRGBEncoding + flipY:false.
   * Default: '/assets/texture/plasticLogo.png'
   */
  logoTexturePath?: string
  /**
   * Path to the HDR environment map.
   * Mirrors RGBELoader('/assets/texture/photo_studio_01_1k.hdr').
   * Default: '/assets/texture/photo_studio_01_1k.hdr'
   */
  hdrPath?: string
  /**
   * Override the env map if you've already loaded it elsewhere (avoids double load).
   * Takes precedence over `hdrPath`.
   */
  envMap?: THREE.Texture | null
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

/**
 * GlassObj
 *
 * Recreates the `plasticLogoMaterial` / Glass mesh profile from your codebase:
 *
 * ```js
 * MeshPhysicalMaterial {
 *   metalness: 0,
 *   roughness: 0,
 *   clearcoat: 1,
 *   clearcoatRoughness: 0,
 *   reflectivity: 1,
 *   envMapIntensity: 1,
 *   toneMapped: false,
 *   envMap: RGBELoader HDR,
 *   map: TextureLoader(plasticLogo.png) { encoding: sRGBEncoding, flipY: false }
 * }
 * ```
 */
export function GlassObj({
  mesh,
  logoTexturePath = '/assets/texture/texture/plasticLogo.png',
  hdrPath = '/assets/texture/texture/photo_studio_01_1k.hdr',
  envMap: envMapProp = null,
  position,
  rotation,
  scale,
}: GlassObjProps) {
  const ref = useRef<THREE.Mesh>(null)

  // Clone geometry — mirrors nodes['Glass'].geometry.clone()
  const geometry = mesh.geometry.clone()

  const matRef = useRef(
    new THREE.MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0,
      reflectivity: 1,
      envMapIntensity: 1,
      toneMapped: false,
      transparent: true, // logo PNG may have alpha
    })
  )

  const logoTexture = useMyTexture(logoTexturePath)

  useEffect(() => {
    if (logoTexture) {
      logoTexture.colorSpace = THREE.SRGBColorSpace // r152+ equivalent of sRGBEncoding
      logoTexture.flipY = false
      matRef.current.map = logoTexture
      matRef.current.needsUpdate = true
    }
  }, [logoTexture])

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
