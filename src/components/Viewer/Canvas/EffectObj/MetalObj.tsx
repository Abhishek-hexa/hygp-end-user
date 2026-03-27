import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export interface MetalObjProps {
  /** Source mesh geometry/transform is reused from the loaded GLTF mesh. */
  mesh: THREE.Mesh
  /** Albedo color override. */
  metalColor?: THREE.ColorRepresentation
  /** Metalness, default 1. */
  metalness?: number
  /** Roughness, default 0. */
  roughness?: number
  side?: boolean
}

export function MetalObj({
  mesh,
  metalColor = '#aaaaaa',
  metalness = 1,
  roughness = 0,
  side = false,
}: MetalObjProps) {
  const matRef = useRef(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(metalColor),
      metalness,
      roughness,
    }),
  )

  useEffect(() => {
    return () => {
      matRef.current.dispose()
    }
  }, [])

  useEffect(() => {
    const mat = matRef.current
    mat.color.set(metalColor)
    mat.metalness = metalness
    mat.roughness = roughness
    mat.side = side ? THREE.DoubleSide : THREE.FrontSide
    mat.needsUpdate = true
  }, [metalColor, metalness, roughness, side])

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
