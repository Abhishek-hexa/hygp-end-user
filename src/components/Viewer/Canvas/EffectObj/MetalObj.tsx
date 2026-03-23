import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface MetalObjProps {
  /** Source mesh — geometry is cloned; original is never mutated */
  mesh: THREE.Mesh
  /**
   * Albedo colour — mirrors dynamic `metalColor` / `dRingColor` from your store.
   * Pass any THREE.ColorRepresentation (hex string, number, THREE.Color).
   */
  metalColor?: THREE.ColorRepresentation
  /**
   * Metalness — default 1 (fully metallic mirror surface).
   * Matches both `buckleMaterial` and `dRingMaterial`.
   */
  metalness?: number
  /**
   * Roughness — default 0 (perfectly smooth / mirror-like).
   * Matches both `buckleMaterial` and `dRingMaterial`.
   */
  roughness?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

/**
 * MetalObj
 *
 * Recreates the `buckleMaterial` / `dRingMaterial` profile from your codebase:
 *
 * ```js
 * MeshPhysicalMaterial { metalness: 1, roughness: 0, color: dynamic }
 * ```
 *
 * The geometry is cloned from the passed `mesh` — the source ref is never mutated.
 * Transform (position/rotation/scale) is mirrored from the source mesh each frame
 * unless you supply explicit override props.
 */
export function MetalObj({
  mesh,
  metalColor = '#aaaaaa',
  metalness = 1,
  roughness = 0,
  position,
  rotation,
  scale,
}: MetalObjProps) {
  const ref = useRef<THREE.Mesh>(null)

  const geometry = mesh.geometry.clone()

  // Stable material ref — recreated only on mount
  const matRef = useRef(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(metalColor),
      metalness,
      roughness,
    })
  )

  // Reactively sync props → material without recreating it
  useEffect(() => {
    const mat = matRef.current
    mat.color.set(metalColor)
    mat.metalness = metalness
    mat.roughness = roughness
    mat.needsUpdate = true
  }, [metalColor, metalness, roughness])

  // Mirror source-mesh world transform when no explicit override is given
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
