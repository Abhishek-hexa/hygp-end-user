import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import * as THREE from 'three';
import { useMainContext } from '../../../hooks/useMainContext';

// Material helpers

type MaterialProps = Partial<{
  color: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  reflectivity: number;
  specularIntensity: number;
  envMapIntensity: number;
  toneMapped: boolean;
  normalScale: [number, number];
}>;

const applyMaterialProps = (material: THREE.Material, props: MaterialProps): void => {
  const m = material as unknown as Record<string, unknown>;

  if (props.color !== undefined && m.color instanceof THREE.Color) {
    (m.color as THREE.Color).set(props.color);
    material.needsUpdate = true;
  }

  const setNum = (key: string, value: number | undefined) => {
    if (value !== undefined && typeof m[key] === 'number') m[key] = value;
  };

  const setBool = (key: string, value: boolean | undefined) => {
    if (value !== undefined && typeof m[key] === 'boolean') m[key] = value;
  };

  setNum('metalness', props.metalness);
  setNum('roughness', props.roughness);
  setNum('clearcoat', props.clearcoat);
  setNum('clearcoatRoughness', props.clearcoatRoughness);
  setNum('reflectivity', props.reflectivity);
  setNum('specularIntensity', props.specularIntensity);
  setNum('envMapIntensity', props.envMapIntensity);
  setBool('toneMapped', props.toneMapped);

  if (props.normalScale && m.normalScale instanceof THREE.Vector2) {
    (m.normalScale as THREE.Vector2).set(...props.normalScale);
  }
};

// Look presets

const METAL_PROPS: MaterialProps = { metalness: 1, roughness: 0 };

const BREAKAWAY_PROPS: MaterialProps = {
  metalness: 0,
  roughness: 0.3,
  clearcoat: 1,
  clearcoatRoughness: 0.5,
  reflectivity: 0.6,
  specularIntensity: 0.5,
};

const PLASTIC_PROPS: MaterialProps = {
  metalness: 0,
  roughness: 1,
  clearcoat: 0.3,
  clearcoatRoughness: 1,
  reflectivity: 1,
  envMapIntensity: 1,
  toneMapped: false,
  normalScale: [0.8, -0.8],
};

const getMeshProps = (meshName: string, material: string): MaterialProps => {
  if (meshName === 'D_Ring') return METAL_PROPS;
  if (meshName === 'Cat_Buckle') return material === 'BREAKAWAY' ? BREAKAWAY_PROPS : PLASTIC_PROPS;
  if (meshName === 'Buckle' || meshName === 'Tri_Glide') return material === 'METAL' ? METAL_PROPS : PLASTIC_PROPS;
  return {};
};

// Component

export const Buckle = observer(() => {
  const { design3DManager, designManager } = useMainContext();
  const { meshManager } = design3DManager;
  const buckleManager = designManager.productManager.buckleManager;
  const selectedHex = buckleManager.currentSelectedColorDescription?.hex;
  const selectedMaterial = buckleManager.material;

  useEffect(() => {
    if (!selectedHex || !selectedMaterial) return;

    const applyToMaterial = (mesh: THREE.Mesh, material: THREE.Material) => {
      const props = getMeshProps(mesh.name, selectedMaterial);
      applyMaterialProps(material, { color: selectedHex, ...props });
    };

    meshManager.buckleMeshes.forEach((mesh) => {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => applyToMaterial(mesh, material));
    });
  }, [meshManager.buckleMeshes, selectedHex, selectedMaterial]);

  return (
    <>
      {meshManager.buckleMeshes.map((mesh) => (
        <primitive key={mesh.uuid} object={mesh} />
      ))}
    </>
  );
});
