import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { LUTCubeLoader } from 'three/examples/jsm/loaders/LUTCubeLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

import { Logger } from './Logger';

export class Utils3D {
  static gltfLoader = new GLTFLoader();
  static loadGLTF = (url: string) => {
    return new Promise<THREE.Group>((resolve, reject) => {
      if (!url) {
        return resolve(new THREE.Group());
      }
      Utils3D.gltfLoader.load(
        url,
        (gltf) => {
          resolve(gltf.scene);
        },
        () => {},
        (error) => {
          reject(error);
        },
      );
    });
  };
  static async loadEnvironmentTexture(file: File): Promise<THREE.Texture> {
    const url = URL.createObjectURL(file);
    const rgbeLoader = new RGBELoader();
    try {
      const texture = await rgbeLoader.loadAsync(url);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      URL.revokeObjectURL(url);
      return texture;
    } catch (error) {
      URL.revokeObjectURL(url);
      Logger.error(`Error loading environment map: ${error}`);
      throw error;
    }
  }
  static loadNodeMapForGLTF = async (url: string) => {
    const scene = await Utils3D.loadGLTF(url);
    const nodeMap: { [key: string]: THREE.Mesh } = {};
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        nodeMap[child.name] = child;
      }
    });
    return nodeMap;
  };
  static loadTexture = async (url: string) => {
    const texture = await new THREE.TextureLoader().loadAsync(url);
    return texture;
  };

  static loadLut = async (url: string) => {
    const lut = await new LUTCubeLoader().loadAsync(url);
    return lut;
  };

  static getImageUrlFromTexture(inTexture: THREE.Texture): string | null {
    const canvas = document.createElement('canvas');
    canvas.width = 2000;
    canvas.height = 2000;

    const repeat = inTexture.repeat ?? new THREE.Vector2(1, 1);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      Logger.error('Failed to get 2D context');
      return null;
    }

    const pattern = ctx.createPattern(
      inTexture.image as HTMLImageElement,
      'repeat',
    );
    if (pattern) {
      ctx.fillStyle = pattern;

      ctx.save();
      ctx.scale(1 / repeat.x, 1 / repeat.y);
      ctx.fillRect(0, 0, canvas.width * repeat.x, canvas.height * repeat.y);

      ctx.restore();
    } else {
      Logger.error('Failed to create pattern');
      return null;
    }

    return canvas.toDataURL();
  }

  static getBoundingBox = (objects: THREE.Object3D[]) => {
    const boundingBox = new THREE.Box3();

    objects.forEach((obj) => {
      boundingBox.expandByObject(obj);
    });

    return boundingBox;
  };
  static getCenterPointAndNormal = (mesh: THREE.Mesh) => {
    const geometry = mesh.geometry;
    const positions = geometry.attributes.position;
    const normals = geometry.attributes.normal;
    const uvs = geometry.attributes.uv as THREE.BufferAttribute;
    const matrixWorld = mesh.matrixWorld;

    if (!positions || !normals || !uvs) {
      // find center of the bounding box
      const boundingBox = Utils3D.getBoundingBox([mesh]);
      const center = boundingBox.getCenter(new THREE.Vector3());
      return {
        center,
        normal: new THREE.Vector3(0, 0, 1),
        uv: new THREE.Vector2(0.5, 0.5),
      };
    }

    const center = new THREE.Vector3(0, 0, 0);
    const count = positions.count;

    // Calculate the center in 3D space
    for (let i = 0; i < count; i++) {
      const vertex = new THREE.Vector3()
        .fromBufferAttribute(positions, i)
        .applyMatrix4(matrixWorld);
      center.add(vertex);
    }
    center.divideScalar(count);

    // Find the closest vertex to the center
    let closestDistance = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < count; i++) {
      const vertex = new THREE.Vector3()
        .fromBufferAttribute(positions, i)
        .applyMatrix4(matrixWorld);
      const distance = vertex.distanceTo(center);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    const normal = new THREE.Vector3()
      .fromBufferAttribute(normals, closestIndex)
      .applyMatrix4(matrixWorld);

    const position = new THREE.Vector3()
      .fromBufferAttribute(positions, closestIndex)
      .applyMatrix4(matrixWorld);

    const uv = new THREE.Vector2().fromBufferAttribute(uvs, closestIndex);

    return {
      center: position,
      normal,
      uv,
    };
  };
  static getSizeAndCenter = (obj: THREE.Object3D) => {
    const boundingBox = Utils3D.getBoundingBox([obj]);
    const size = boundingBox.getSize(new THREE.Vector3());
    const center = boundingBox.getCenter(new THREE.Vector3());
    return {
      boundingBox,
      center,
      size,
    };
  };
}
