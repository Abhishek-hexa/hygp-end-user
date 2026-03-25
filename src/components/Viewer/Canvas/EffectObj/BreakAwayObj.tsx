import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface BreakAwayObjProps {
  /** Source mesh — geometry is cloned; original is never mutated */
  mesh: THREE.Mesh

  breakawayColor?: THREE.ColorRepresentation
  /** Roughness — default 0.3 */
  roughness?: number
  /** Metalness — default 0 */
  metalness?: number
  /** Clearcoat — default 1 */
  clearcoat?: number
  /** Clearcoat roughness — default 0.5 */
  clearcoatRoughness?: number
  /** Reflectivity — default 0.6 */
  reflectivity?: number
  /** Specular intensity — default 0.5 */
  specularIntensity?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}


export function BreakAwayObj({
  mesh,
  breakawayColor = '#1a4f8a',
  roughness = 0.3,
  metalness = 0,
  clearcoat = 1,
  clearcoatRoughness = 0.5,
  reflectivity = 0.6,
  specularIntensity = 0.5,
  position,
  rotation,
  scale,
}: BreakAwayObjProps) {
  const ref = useRef<THREE.Mesh>(null)

  const geometry = mesh.geometry.clone()

  // Stable material ref — recreated only on mount
  const matRef = useRef(
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

  // Reactively sync props → material without recreating it
  useEffect(() => {
    const mat = matRef.current
    mat.color.set(breakawayColor)
    mat.roughness = roughness
    mat.metalness = metalness
    mat.clearcoat = clearcoat
    mat.clearcoatRoughness = clearcoatRoughness
    mat.reflectivity = reflectivity
    mat.specularIntensity = specularIntensity
    mat.needsUpdate = true
  }, [breakawayColor, roughness, metalness, clearcoat, clearcoatRoughness, reflectivity, specularIntensity])

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
