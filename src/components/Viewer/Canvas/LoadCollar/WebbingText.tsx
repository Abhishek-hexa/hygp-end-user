import { useFrame, useLoader } from '@react-three/fiber';
import { FabricText, StaticCanvas } from 'fabric';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadHdrEnvMapCached } from '../EffectObj/hdrEnvMapCache';
import { TextSize } from '../../../../state/product/types';

export interface WebbingTextProps {
  mesh: THREE.Mesh | undefined;
  text: string;
  fontUrl?: string;
  fontFamilyFallback?: string;
  color?: string;
  fontSize?: TextSize;
  side?: boolean;
}

const fontScaleRecord: Record<TextSize, number> = {
  SMALL: 0.5,
  MEDIUM: 0.75,
  LARGE: 1,
};

export const WebbingText = observer(
  ({
    mesh,
    text,
    fontUrl,
    fontFamilyFallback = 'Arial',
    color = '#2d9ce6',
    fontSize = 'MEDIUM',
    side = false,
  }: WebbingTextProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    const [localEnvMap, setLocalEnvMap] = useState<THREE.Texture | null>(null);

    useEffect(() => {
      loadHdrEnvMapCached('/assets/texture/texture/white1.hdr').then(
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          setLocalEnvMap(texture);
        },
      );
    }, []);

    useFrame(() => {
      if (!meshRef.current || !mesh) return;
      meshRef.current.position.copy(mesh.position);
      meshRef.current.rotation.copy(mesh.rotation);
      meshRef.current.scale.copy(mesh.scale);
    });

    useEffect(() => {
      if (!text || !mesh || text.trim().length === 0) {
        setTexture(null);
        return;
      }

      let active = true;

      const generateTexture = async () => {
        let fontFamily = fontFamilyFallback;

        if (fontUrl) {
          const familySlug = fontUrl.replace(/[^a-zA-Z0-9]/g, '_');
          fontFamily = `webbing-font-${familySlug}`;

          let fontLoaded = false;
          document.fonts.forEach((f) => {
            if (f.family === fontFamily) fontLoaded = true;
          });

          if (!fontLoaded) {
            try {
              const fontFace = new FontFace(fontFamily, `url(${fontUrl})`);
              await fontFace.load();
              document.fonts.add(fontFace);
            } catch {
              fontFamily = fontFamilyFallback;
            }
          }
        }

        if (!active) return;

        const geometry = mesh.geometry;
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        if (!box) return;

        const size = new THREE.Vector3();
        box.getSize(size);

        const canvasWidth = size.x * 100;
        const canvasHeight = size.y * 100;
        const canvasEl = document.createElement('canvas');
        canvasEl.width = canvasWidth;
        canvasEl.height = canvasHeight;

        const staticCanvas = new StaticCanvas(canvasEl, {
          height: canvasHeight,
          width: canvasWidth,
        });

        const sizeMultiplier = fontScaleRecord[fontSize];
        const baseFontSize = canvasHeight * 0.7 * sizeMultiplier;

        const textObj = new FabricText(text, {
          fill: color,
          strokeWidth: 10,
          stroke: '#000000',
          paintFirst: 'stroke',
          strokeUniform: true,
          fontFamily: fontFamily,
          fontSize: baseFontSize,
          originX: 'left',
          originY: 'center',
          textAlign: 'left',
          top: canvasHeight / 2,
        });

        textObj.set({
          scaleX: 0.681, // tuned value from canvas
          scaleY: 1, // keep aspect ratio
        });

        staticCanvas.add(textObj);
        staticCanvas.renderAll();

        if (!active) {
          await staticCanvas.dispose();
          return;
        }

        const blob = await staticCanvas.toBlob();
        await staticCanvas.dispose();

        if (!active || !blob) return;

        const url = URL.createObjectURL(blob);
        const loader = new THREE.TextureLoader();

        loader.load(url, (loadedTexture) => {
          if (!active) {
            loadedTexture.dispose();
            URL.revokeObjectURL(url);
            return;
          }
          loadedTexture.colorSpace = THREE.SRGBColorSpace;
          loadedTexture.needsUpdate = true;

          // For webbing text, standard mappings often require flipping Y
          loadedTexture.flipY = false;

          setTexture(loadedTexture);
          URL.revokeObjectURL(url);
        });
      };

      generateTexture();

      return () => {
        active = false;
      };
    }, [text, fontUrl, fontFamilyFallback, color, fontSize, mesh]);

    useEffect(() => {
      return () => {
        texture?.dispose();
      };
    }, [texture]);

    const sourceMaterial =
      mesh?.material instanceof THREE.MeshStandardMaterial ||
      mesh?.material instanceof THREE.MeshPhysicalMaterial
        ? mesh.material
        : null;
    const envMap = localEnvMap || (sourceMaterial?.envMap ?? null);

    if (!mesh || !texture) return null;

    return (
      <group>
        <mesh ref={meshRef} geometry={mesh.geometry}>
          <meshPhysicalMaterial
            map={texture}
            transparent
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            roughness={0.8}
            metalness={1}
            envMap={envMap}
            envMapIntensity={envMap ? 6.5 : 1}
            side={side ? THREE.DoubleSide : THREE.FrontSide}
          />
        </mesh>
      </group>
    );
  },
);

export default WebbingText;
