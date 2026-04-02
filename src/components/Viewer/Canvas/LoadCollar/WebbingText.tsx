import { FabricText, StaticCanvas } from 'fabric';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { TextSize } from '../../../../state/product/types';
import { CachedAssets } from '../../../../loaders/CachedAssets';
import { useMyHdr } from '../../../../hooks/useMyHdr';
import { useMyTexture } from '../../../../hooks/useMyTexture';

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
    const [generatedTextureUrl, setGeneratedTextureUrl] = useState<
      string | null
    >(null);
    const texture = useMyTexture(generatedTextureUrl, { trackLoading: false });
    const localEnvMap = useMyHdr('/assets/texture/texture/white1.hdr');

    useEffect(() => {
      if (!text || !mesh || text.trim().length === 0) {
        setGeneratedTextureUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        return;
      }

      let active = true;

      const generateTexture = async () => {
        let fontFamily = fontFamilyFallback;

        if (fontUrl) {
          try {
            const fontResult = await CachedAssets.loadFont(fontUrl);
            if (!fontResult.isError) {
              fontFamily = CachedAssets.getFontFamily(fontUrl);
            }
          } catch {
            fontFamily = fontFamilyFallback;
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
        if (!active) {
          URL.revokeObjectURL(url);
          return;
        }
        setGeneratedTextureUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      };

      generateTexture();

      return () => {
        active = false;
      };
    }, [text, fontUrl, fontFamilyFallback, color, fontSize, mesh]);

    useEffect(() => {
      return () => {
        if (generatedTextureUrl) URL.revokeObjectURL(generatedTextureUrl);
      };
    }, [generatedTextureUrl]);

    useEffect(() => {
      if (!texture) return;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      texture.flipY = false;
      return () => {
        texture.dispose();
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
        <mesh
          geometry={mesh.geometry}
          position={mesh.position}
          rotation={mesh.rotation}
          scale={mesh.scale}>
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
