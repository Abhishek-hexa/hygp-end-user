import * as THREE from 'three';
import { BuckleMaterialType } from '../../../state/product/types';

export type MaterialProps = Partial<{
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

const getMeshProps = (
  meshName: string,
  buckleMaterial: BuckleMaterialType,
): MaterialProps => {
  if (meshName === 'D_Ring') {
    return METAL_PROPS;
  }

  if (meshName === 'Cat_Buckle') {
    return buckleMaterial === 'BREAKAWAY' ? BREAKAWAY_PROPS : PLASTIC_PROPS;
  }

  if (meshName === 'Buckle' || meshName === 'Tri_Glide') {
    return buckleMaterial === 'METAL' ? METAL_PROPS : PLASTIC_PROPS;
  }

  return {};
};

export const applyMaterialProps = (
  material: THREE.Material,
  props: MaterialProps,
): void => {
  const materialMap = material as unknown as Record<string, unknown>;

  if (props.color !== undefined && materialMap.color instanceof THREE.Color) {
    (materialMap.color as THREE.Color).set(props.color);
    material.needsUpdate = true;
  }

  const setNumberProp = (key: string, value: number | undefined) => {
    if (value !== undefined && typeof materialMap[key] === 'number') {
      materialMap[key] = value;
    }
  };

  const setBooleanProp = (key: string, value: boolean | undefined) => {
    if (value !== undefined && typeof materialMap[key] === 'boolean') {
      materialMap[key] = value;
    }
  };

  setNumberProp('metalness', props.metalness);
  setNumberProp('roughness', props.roughness);
  setNumberProp('clearcoat', props.clearcoat);
  setNumberProp('clearcoatRoughness', props.clearcoatRoughness);
  setNumberProp('reflectivity', props.reflectivity);
  setNumberProp('specularIntensity', props.specularIntensity);
  setNumberProp('envMapIntensity', props.envMapIntensity);
  setBooleanProp('toneMapped', props.toneMapped);

  if (props.normalScale && materialMap.normalScale instanceof THREE.Vector2) {
    (materialMap.normalScale as THREE.Vector2).set(...props.normalScale);
  }
};

export const applyPropsToMeshMaterials = (
  mesh: THREE.Mesh,
  props: MaterialProps,
) => {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  materials.forEach((material) => {
    applyMaterialProps(material, props);
  });
};

export const applyBuckleMaterial = (
  mesh: THREE.Mesh,
  buckleMaterial: BuckleMaterialType,
  colorHex: string,
) => {
  const materialProps = getMeshProps(mesh.name, buckleMaterial);
  applyPropsToMeshMaterials(mesh, { color: colorHex, ...materialProps });
};
