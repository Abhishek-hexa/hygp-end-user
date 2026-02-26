import { IReactionDisposer, makeAutoObservable, reaction, runInAction } from 'mobx';
import * as THREE from 'three';

import { MeshInfo } from '../../../core/MeshInfo';
import { MeshManager } from './MeshManager';
import { ModelRuntimeManager } from './ModelRuntimeManager';
import { StateManager } from '../../StateManager';
import { TextureRuntimeManager } from './TextureRuntimeManager';

type Product3DState = {
  modelUrl: string | null;
  textureUrl: string | null;
};

export class Product3DSyncManager {
  private _libState: StateManager;
  private _meshManager: MeshManager;
  private _modelRuntimeManager: ModelRuntimeManager;
  private _textureRuntimeManager: TextureRuntimeManager;

  private _isSyncing = false;
  private _error: string | null = null;
  private _syncRequestId = 0;
  private _appliedModelUrl: string | null = null;
  private _appliedTextureUrl: string | null = null;
  private _disposer: IReactionDisposer | null = null;

  constructor(
    libState: StateManager,
    meshManager: MeshManager,
    modelRuntimeManager: ModelRuntimeManager,
    textureRuntimeManager: TextureRuntimeManager,
  ) {
    this._libState = libState;
    this._meshManager = meshManager;
    this._modelRuntimeManager = modelRuntimeManager;
    this._textureRuntimeManager = textureRuntimeManager;

    makeAutoObservable(this);
    this.bindReactions();
  }

  get isSyncing() {
    return this._isSyncing;
  }

  get error() {
    return this._error;
  }

  private bindReactions() {
    this._disposer = reaction(
      () => {
        const productManager = this._libState.designManager.productManager;
        return {
          modelUrl: productManager.resolvedModelPath,
          textureUrl: productManager.material.material,
        };
      },
      (state) => {
        void this.syncFromProductState(state);
      },
      { fireImmediately: true },
    );
  }

  private async syncFromProductState(state: Product3DState) {
    const currentRequestId = ++this._syncRequestId;
    runInAction(() => {
      this._isSyncing = true;
      this._error = null;
    });

    try {
      const shouldReloadModel = state.modelUrl !== this._appliedModelUrl;
      if (shouldReloadModel) {
        const meshInfos = await this._modelRuntimeManager.loadMeshInfos(
          state.modelUrl,
        );
        if (currentRequestId !== this._syncRequestId) {
          return;
        }

        this._meshManager.setMeshInfos(meshInfos);
        this._meshManager.setGroupRef(null);
        this._appliedModelUrl = state.modelUrl;
      }

      const shouldApplyTexture =
        shouldReloadModel || state.textureUrl !== this._appliedTextureUrl;

      if (shouldApplyTexture) {
        const texture = await this._textureRuntimeManager.loadTexture(
          state.textureUrl,
        );
        if (currentRequestId !== this._syncRequestId) {
          return;
        }

        this.applyTextureToMeshes(this._meshManager.meshInfos, texture);
        this._appliedTextureUrl = state.textureUrl;
        this._textureRuntimeManager.disposeAllExcept(
          state.textureUrl ? [state.textureUrl] : [],
        );
      }
    } catch (error) {
      if (currentRequestId !== this._syncRequestId) {
        return;
      }
      runInAction(() => {
        this._error = String(error);
      });
    } finally {
      if (currentRequestId === this._syncRequestId) {
        runInAction(() => {
          this._isSyncing = false;
        });
      }
    }
  }

  private applyTextureToMeshes(
    meshInfos: MeshInfo[],
    texture: THREE.Texture | null,
  ) {
    meshInfos.forEach((meshInfo) => {
      this.applyTextureToMesh(meshInfo.item, texture);
    });
  }

  private applyTextureToMesh(mesh: THREE.Mesh, texture: THREE.Texture | null) {
    const { material } = mesh;
    if (Array.isArray(material)) {
      material.forEach((entry) => this.applyTextureToMaterial(entry, texture));
      return;
    }

    this.applyTextureToMaterial(material, texture);
  }

  private applyTextureToMaterial(
    material: THREE.Material,
    texture: THREE.Texture | null,
  ) {
    if ('map' in material) {
      material.map = texture;
      material.needsUpdate = true;
    }
  }

  dispose() {
    this._disposer?.();
    this._disposer = null;
  }
}
