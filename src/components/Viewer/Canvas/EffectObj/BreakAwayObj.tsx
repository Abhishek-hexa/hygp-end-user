import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export interface BreakAwayObjProps {
  mesh: THREE.Mesh
  breakawayColor?: THREE.ColorRepresentation
  roughness?: number
  metalness?: number
  clearcoat?: number
  clearcoatRoughness?: number
  reflectivity?: number
  specularIntensity?: number
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
}: BreakAwayObjProps) {
  const matRef = useRef(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(breakawayColor),
      roughness,
      metalness,
      clearcoat,
      clearcoatRoughness,
      reflectivity,
      specularIntensity,
    }),
  )

  useEffect(() => {
    return () => {
      matRef.current.dispose()
    }
  }, [])

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
  }, [
    breakawayColor,
    roughness,
    metalness,
    clearcoat,
    clearcoatRoughness,
    reflectivity,
    specularIntensity,
  ])

  return (
    <mesh
      geometry={mesh.geometry}
      material={matRef.current}
      position={mesh.position}
      rotation={mesh.rotation}
      scale={mesh.scale}
    />
  )
}
