import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useMyHdr } from '../../../../hooks/useMyHdr'

export interface PlasticObjProps {
  mesh: THREE.Mesh
  color?: THREE.ColorRepresentation
  hdrPath?: string
  envMap?: THREE.Texture | null
  roughness?: number
  metalness?: number
  clearcoat?: number
  clearcoatRoughness?: number
  reflectivity?: number
  envMapIntensity?: number
  specularIntensity?: number
  normalScaleX?: number
  normalScaleY?: number
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
}: PlasticObjProps) {
  const hdrTexture = useMyHdr(envMapProp === null ? hdrPath : null)
  const srcMat = useMemo(() => {
    if (mesh.material instanceof THREE.MeshStandardMaterial) {
      return mesh.material
    }
    if (mesh.material instanceof THREE.MeshPhysicalMaterial) {
      return mesh.material
    }
    return null
  }, [mesh.material])

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
      ...(srcMat?.normalMap ? { normalMap: srcMat.normalMap } : {}),
      ...(srcMat?.roughnessMap ? { roughnessMap: srcMat.roughnessMap } : {}),
      ...(srcMat?.metalnessMap ? { metalnessMap: srcMat.metalnessMap } : {}),
    }),
  )

  useEffect(() => {
    return () => {
      matRef.current.dispose()
    }
  }, [])

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
    mat.toneMapped = false
    mat.needsUpdate = true
  }, [
    color,
    roughness,
    metalness,
    clearcoat,
    clearcoatRoughness,
    reflectivity,
    envMapIntensity,
    specularIntensity,
    normalScaleX,
    normalScaleY,
  ])

  useEffect(() => {
    const mat = matRef.current
    if (srcMat) {
      mat.normalMap = srcMat.normalMap
      mat.roughnessMap = srcMat.roughnessMap
      mat.metalnessMap = srcMat.metalnessMap
      mat.needsUpdate = true
    }
  }, [srcMat])

  useEffect(() => {
    const nextEnvMap = envMapProp ?? hdrTexture ?? null
    if (nextEnvMap) {
      nextEnvMap.mapping = THREE.EquirectangularReflectionMapping
    }
    matRef.current.envMap = nextEnvMap
    matRef.current.needsUpdate = true
  }, [envMapProp, hdrTexture])

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
