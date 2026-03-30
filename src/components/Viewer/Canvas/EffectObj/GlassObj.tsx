import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { loadHdrEnvMapCached } from './hdrEnvMapCache'
import { useMyTexture } from '../../../../hooks/useMyTexture'

export interface GlassObjProps {
  mesh: THREE.Mesh
  logoTexturePath?: string
  hdrPath?: string
  envMap?: THREE.Texture | null
}

export function GlassObj({
  mesh,
  logoTexturePath = '/assets/texture/texture/plasticLogo.png',
  hdrPath = '/assets/texture/texture/photo_studio_01_1k.hdr',
  envMap: envMapProp = null,
}: GlassObjProps) {
  const matRef = useRef(
    new THREE.MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0,
      reflectivity: 1,
      envMapIntensity: 1,
      toneMapped: false,
      transparent: true,
    }),
  )

  const logoTexture = useMyTexture(logoTexturePath)

  useEffect(() => {
    return () => {
      matRef.current.dispose()
    }
  }, [])

  useEffect(() => {
    if (!logoTexture) return
    logoTexture.colorSpace = THREE.SRGBColorSpace
    logoTexture.flipY = false
    matRef.current.map = logoTexture
    matRef.current.needsUpdate = true
  }, [logoTexture])

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
