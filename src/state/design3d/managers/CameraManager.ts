import { makeAutoObservable, reaction } from 'mobx';
import { StateManager } from '../../StateManager';
import type CameraControlsImpl from 'camera-controls';
import * as THREE from 'three';
import { Feature } from '../../product/types';

export class CameraManager {
  private _target = new THREE.Vector3(0, 0, 0);
  private _fov = 26;
  private _near = 100;
  private _far = 2000;
  private _minDistance = 200;
  private _maxDistance = 800;
  private _isAutoRotate = false;
  private _autoRotateSpeed = 0.5;
  private _controllRef: CameraControlsImpl | null = null;
  private stateManager: StateManager;

  constructor(stateManager: StateManager) {
    this.stateManager = stateManager;
    makeAutoObservable(this);
    this.setupReactions();
  }

  private setupReactions() {
    reaction(
      () => ({
        activeFeature: this.stateManager.designManager.productManager.activeFeature,
        modelKey: this.stateManager.designManager.productManager.activeModelKey,
        controlsRef: this.controllRef,
      }),
      ({ activeFeature, modelKey, controlsRef }, previous) => {
        if (!controlsRef) return;

        const controlsRefChangedToInstance = !previous?.controlsRef && controlsRef !== null;
        const featureChanged = activeFeature !== previous?.activeFeature;
        const modelChanged = modelKey !== previous?.modelKey;

        // Only run if the feature tab changed, OR if we're on the SIZE tab and the model changed,
        // OR if controlsRef just became available
        if (
          !controlsRefChangedToInstance &&
          !featureChanged &&
          !(activeFeature === Feature.SIZE && modelChanged)
        ) {
          return;
        }

        const meshManager = this.stateManager.design3DManager.meshManager;

        if (activeFeature === Feature.BUCKLE || activeFeature === Feature.ENGRAVING) {
          const buckleMesh = meshManager.buckleMesh;
          if (!buckleMesh) return;

          // Reset the camera to directly face the front of the buckle,
          // so it doesn't zoom in on the side/back if the user previously spun the model.
          void controlsRef.rotateTo(0, Math.PI / 2, true);

          void controlsRef.fitToBox(buckleMesh, true, {
            paddingTop: 10,
            paddingLeft: 10,
            paddingBottom: 10,
            paddingRight: 10,
          });
          return;
        }

        if (
          activeFeature === Feature.COLLAR_TEXT ||
          activeFeature === Feature.HARNESS_TEXT ||
          activeFeature === Feature.LEASH_TEXT
        ) {
          const webTextMesh = meshManager.webTextMesh;
          if (!webTextMesh) return;

          // Rotate to the side of the collar so the text faces the camera directly
          void controlsRef.rotateTo(Math.PI / 2, Math.PI / 2, true);

          void controlsRef.fitToBox(webTextMesh, true, {
            paddingTop: 20,
            paddingLeft: 20,
            paddingBottom: 20,
            paddingRight: 20,
          });
          return;
        }

        const modelGroup = modelKey
          ? meshManager.getMeshGroup(modelKey)
          : undefined;
        if (!modelGroup) return;

        void controlsRef.fitToBox(modelGroup, true);

        if (modelKey) {
          const center = meshManager.getVisibleMeshCenter(modelKey);
          if (center) {
            this.setTarget(center);
            controlsRef.setTarget(center.x, center.y, center.z, true);
          }
        }
      }
    );
  }

  updateCameraAnimation(delta: number) {
    const activeFeature = this.stateManager.designManager.productManager.activeFeature;
    const controlsRef = this.controllRef;

    if (activeFeature === Feature.DESIGN && controlsRef) {
      // Apply a subtle continuous rotation.
      // 0.2 radians per second is relatively slow and subtle.
      controlsRef.azimuthAngle += 0.3 * delta;

      // Prevent the angle from winding up infinitely so it doesn't
      // aggressively "anti-rotate" when transitioning back to the front facing view.
      if (controlsRef.azimuthAngle > Math.PI) {
        controlsRef.azimuthAngle -= 2 * Math.PI;
      } else if (controlsRef.azimuthAngle < -Math.PI) {
        controlsRef.azimuthAngle += 2 * Math.PI;
      }
    }
  }

  get target() {
    return this._target;
  }

  get fov() {
    return this._fov;
  }

  get near() {
    return this._near;
  }

  get far() {
    return this._far;
  }

  get minDistance() {
    return this._minDistance;
  }

  get maxDistance() {
    return this._maxDistance;
  }

  get isAutoRotate() {
    return this._isAutoRotate;
  }

  get autoRotateSpeed() {
    return this._autoRotateSpeed;
  }

  get controllRef() {
    return this._controllRef;
  }


  setTarget(inTarget: THREE.Vector3) {
    this._target = inTarget.clone();
  }

  setNear(inNear: number) {
    this._near = inNear
  }

  setFar(inFar: number) {
    this._far = inFar
  }

  setMinDistance(inMinDistance: number) {
    this._minDistance = inMinDistance
  }

  setMaxDistance(inMaxDistance: number) {
    this._maxDistance = inMaxDistance
  }

  setControllRef(inControllRef: CameraControlsImpl | null) {
    this._controllRef = inControllRef;
  }
}
