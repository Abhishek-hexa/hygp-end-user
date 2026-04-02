import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useMyTexture } from '../../../../hooks/useMyTexture'
import { useMyHdr } from '../../../../hooks/useMyHdr'

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
  const hdrTexture = useMyHdr(envMapProp === null ? hdrPath : null)

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
    matRef.current.envMap = envMapProp ?? hdrTexture ?? null
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
