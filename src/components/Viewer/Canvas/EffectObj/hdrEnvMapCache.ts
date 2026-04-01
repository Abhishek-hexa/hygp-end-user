import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader'
import * as THREE from 'three'

const cachedHdrEnvMaps = new Map<string, THREE.Texture>()
const pendingHdrEnvMaps = new Map<string, Promise<THREE.Texture>>()
const cachedTextures = new Map<string, THREE.Texture>()
const pendingTextures = new Map<string, Promise<THREE.Texture>>()
const hdrLoader  = new HDRLoader()
const textureLoader = new THREE.TextureLoader()

export function loadHdrEnvMapCached(hdrPath: string): Promise<THREE.Texture> {
  const cached = cachedHdrEnvMaps.get(hdrPath)
  if (cached) return Promise.resolve(cached)

  const pending = pendingHdrEnvMaps.get(hdrPath)
  if (pending) return pending

  const loadPromise = new Promise<THREE.Texture>((resolve, reject) => {
    hdrLoader .load(
      hdrPath,
      (hdr) => {
        hdr.mapping = THREE.EquirectangularReflectionMapping
        cachedHdrEnvMaps.set(hdrPath, hdr)
        pendingHdrEnvMaps.delete(hdrPath)
        resolve(hdr)
      },
      undefined,
      (error) => {
        pendingHdrEnvMaps.delete(hdrPath)
        reject(error)
      },
    )
  })

  pendingHdrEnvMaps.set(hdrPath, loadPromise)
  return loadPromise
}

export function loadTextureCached(texturePath: string): Promise<THREE.Texture> {
  const cached = cachedTextures.get(texturePath)
  if (cached) return Promise.resolve(cached)

  const pending = pendingTextures.get(texturePath)
  if (pending) return pending

  const loadPromise = new Promise<THREE.Texture>((resolve, reject) => {
    textureLoader.load(
      texturePath,
      (texture) => {
        cachedTextures.set(texturePath, texture)
        pendingTextures.delete(texturePath)
        resolve(texture)
      },
      undefined,
      (error) => {
        pendingTextures.delete(texturePath)
        reject(error)
      },
    )
  })

  pendingTextures.set(texturePath, loadPromise)
  return loadPromise
}
