import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Crop / atlas data (configure later) ──────────────────────────────────────

/**
 * TextureCropData  (the `dataX` prop)
 *
 * All fields are optional — fill in whatever your pipeline needs.
 * UV-space offset + repeat is the most portable approach and works
 * directly on THREE.Texture without any shader changes.
 *
 * Example for a 4-column sprite atlas, column index 2:
 * ```ts
 * dataX={{ uvOffset: [0.5, 0], uvRepeat: [0.25, 1] }}
 * ```
 *
 * Example for a pixel crop from a 512×512 atlas source:
 * ```ts
 * dataX={{ pixelCrop: { x: 128, y: 0, w: 128, h: 128 }, sourceSize: [512, 512] }}
 * ```
 */
export interface TextureCropData {
  /**
   * UV-space offset [u, v].
   * Maps to `texture.offset.set(u, v)`.
   */
  uvOffset?: [number, number]
  /**
   * UV-space repeat [u, v].
   * Maps to `texture.repeat.set(u, v)`.
   */
  uvRepeat?: [number, number]
  /**
   * Pixel-space crop rectangle (converted to UV internally).
   * Requires `sourceSize` to be set.
   */
  pixelCrop?: { x: number; y: number; w: number; h: number }
  /**
   * Full size of the source texture in pixels [width, height].
   * Required when using `pixelCrop`.
   */
  sourceSize?: [number, number]
  /**
   * Raw atlas cell index — your own lookup logic goes here.
   * Hook it up in the `applyDataX` function below.
   */
  atlasIndex?: number
  /**
   * Flip Y on the texture (default: false — mirrors GLTF convention).
   */
  flipY?: boolean
  /**
   * Any extra data you need — extend freely.
   */
  [key: string]: unknown
}

// ─── Internal helper — apply dataX to a THREE.Texture ─────────────────────────

function applyDataX(tex: THREE.Texture, dataX: TextureCropData) {
  // ── UV offset + repeat (highest priority if both given) ──────────────────
  if (dataX.uvOffset) {
    tex.offset.set(dataX.uvOffset[0], dataX.uvOffset[1])
  }
  if (dataX.uvRepeat) {
    tex.repeat.set(dataX.uvRepeat[0], dataX.uvRepeat[1])
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
  }

  // ── Pixel crop → UV conversion ───────────────────────────────────────────
  if (dataX.pixelCrop && dataX.sourceSize) {
    const { x, y, w, h } = dataX.pixelCrop
    const [sw, sh] = dataX.sourceSize
    tex.offset.set(x / sw, y / sh)
    tex.repeat.set(w / sw, h / sh)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
  }

  // ── Atlas index ───────────────────────────────────────────────────────────
  // TODO: implement your atlas layout logic here
  // if (dataX.atlasIndex !== undefined) { ... }

  // ── Flip Y ────────────────────────────────────────────────────────────────
  if (dataX.flipY !== undefined) {
    tex.flipY = dataX.flipY
  }

  tex.needsUpdate = true
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TexturedObjProps {
  /** Source mesh — geometry is cloned; original is never mutated */
  mesh: THREE.Mesh
  /**
   * Pre-loaded THREE.Texture to apply.
   * Pass the result of useTexture / TextureLoader.load.
   */
  texture: THREE.Texture
  /**
   * Cropping / atlas configuration applied to `texture` after loading.
   * All fields optional — configure when ready.
   */
  dataX?: TextureCropData
  // ── Standard material controls ──────────────────────────────────────────
  color?: THREE.ColorRepresentation
  roughness?: number
  metalness?: number
  /** Use sRGB colour space on the texture (default: true) */
  sRGB?: boolean
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

/**
 * TexturedObj
 *
 * Applies a custom texture (with optional `dataX` cropping / atlas data) to a
 * cloned mesh geometry via MeshStandardMaterial.
 *
 * The `dataX` prop is typed but intentionally flexible — fill in the fields
 * you need (UV offset/repeat, pixel crop, atlas index) when you're ready.
 * The internal `applyDataX` function is the single place to add new crop logic.
 *
 * @example
 * const tex = useTexture('/assets/atlas.png')
 * <TexturedObj
 *   mesh={glassMesh}
 *   texture={tex}
 *   dataX={{ uvOffset: [0.25, 0], uvRepeat: [0.25, 1] }}
 * />
 */
export function TexturedObj({
  mesh,
  texture,
  dataX,
  color,
  roughness = 0.5,
  metalness = 0,
  sRGB = true,
  position,
  rotation,
  scale,
}: TexturedObjProps) {
  const ref = useRef<THREE.Mesh>(null)
  const geometry = mesh.geometry.clone()

  // Clone texture so we don't mutate the caller's instance
  const tex = useRef<THREE.Texture>(texture.clone())

  const matRef = useRef(
    new THREE.MeshStandardMaterial({
      ...(color !== undefined ? { color: new THREE.Color(color) } : {}),
      roughness,
      metalness,
      map: tex.current,
    })
  )

  // Apply sRGB colour space + dataX on texture change
  useEffect(() => {
    const t = texture.clone()
    if (sRGB) t.colorSpace = THREE.SRGBColorSpace
    if (dataX) applyDataX(t, dataX)

    tex.current = t
    matRef.current.map = t
    matRef.current.needsUpdate = true

    return () => { t.dispose() }
  }, [texture, sRGB, dataX])

  // Sync other material props reactively
  useEffect(() => {
    const mat = matRef.current
    if (color !== undefined) mat.color.set(color)
    mat.roughness = roughness
    mat.metalness = metalness
    mat.needsUpdate = true
  }, [color, roughness, metalness])

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
