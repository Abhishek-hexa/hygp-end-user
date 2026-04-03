import { makeAutoObservable, reaction } from 'mobx';
import { StateManager } from '../../StateManager';
import type CameraControlsImpl from 'camera-controls';
import * as THREE from 'three';
import { Feature, type Features } from '../../product/types';
import type { MeshManager } from './MeshManager';

type CameraReactionState = {
  activeFeature: Features | null;
  modelKey: string | null;
  productId: string;
  controlsRef: CameraControlsImpl | null;
};

export class CameraManager {
  private static readonly DEFAULT_MIN_POLAR_ANGLE = Math.PI / 2.5;
  private static readonly DEFAULT_MAX_POLAR_ANGLE = Math.PI / 2;
  private static readonly LEASH_MIN_POLAR_ANGLE = 0;

  private _target = new THREE.Vector3(0, 0, 0);
  private _fov = 26;
  private _near = 100;
  private _far = 2000;
  private _minDistance = 200;
  private _maxDistance = 800;
  private _minPolarAngle = CameraManager.DEFAULT_MIN_POLAR_ANGLE;
  private _maxPolarAngle = CameraManager.DEFAULT_MAX_POLAR_ANGLE;
  private _isAutoRotate = false;
  private _autoRotateSpeed = 0.5;
  private _isUserControlling = false;
  private _controllRef: CameraControlsImpl | null = null;

  private stateManager: StateManager;

  constructor(stateManager: StateManager) {
    this.stateManager = stateManager;
    makeAutoObservable(this);
    this.setupReactions();
  }

  private setupReactions() {
    reaction(
      () => this.reactionState,
      (current, previous) => {
        const { controlsRef } = current;
        if (!controlsRef) return;

        if (!this.shouldRunReaction(current, previous)) return;

        this.handleCameraUpdate(current, controlsRef);
      },
    );
  }

  private get reactionState(): CameraReactionState {
    const productManager = this.stateManager.designManager.productManager;

    return {
      activeFeature: productManager.activeFeature,
      modelKey: productManager.activeModelKey,
      productId: productManager.productId,
      controlsRef: this.controllRef,
    };
  }

  private shouldRunReaction(
    current: CameraReactionState,
    previous?: CameraReactionState,
  ) {
    const controlsReady =
      !previous?.controlsRef && current.controlsRef !== null;
    const featureChanged = current.activeFeature !== previous?.activeFeature;
    const modelChanged = current.modelKey !== previous?.modelKey;
    const productChanged = current.productId !== previous?.productId;

    return (
      controlsReady ||
      featureChanged ||
      productChanged ||
      (current.activeFeature === Feature.SIZE && modelChanged)
    );
  }

  private handleCameraUpdate(
    state: CameraReactionState,
    controlsRef: CameraControlsImpl,
  ) {
    const meshManager = this.stateManager.design3DManager.meshManager;
    this.updatePolarAnglesForProduct(state.productId);

    if (state.modelKey) {
      const center = meshManager.getVisibleMeshCenter(state.modelKey);
      if (center) {
        this.setTarget(center);
        controlsRef.setTarget(center.x, center.y, center.z, true);
      }
    }

    switch (state.activeFeature) {
      case Feature.SIZE:
        this.focusSize(meshManager, controlsRef, state.modelKey);
        break;

      case Feature.BUCKLE:
      case Feature.ENGRAVING:
        this.focusBuckle(meshManager, controlsRef);
        break;

      case Feature.COLLAR_TEXT:
        this.focusCollarText(meshManager, controlsRef);
        break;

      case Feature.LEASH_TEXT:
        this.focusLeashText(meshManager, controlsRef);
        break;

      case Feature.HARDWARE:
        this.focusHardware(meshManager, controlsRef);
        break;

      default:
        this.focusModel(meshManager, state.modelKey, controlsRef);
        break;
    }

    if (state.modelKey) {
      const center = meshManager.getVisibleMeshCenter(state.modelKey);
      if (center) {
        this.setTarget(center);
        controlsRef.setTarget(center.x, center.y, center.z, true);
      }
    }
  }

  private focusBuckle(
    meshManager: MeshManager,
    controlsRef: CameraControlsImpl,
  ) {
    const mesh = meshManager.buckleMesh;
    if (!mesh) return;

    void controlsRef.rotateTo(0, Math.PI / 2, true);
    this.fitWithPadding(controlsRef, mesh, 10);
  }

  private focusCollarText(
    meshManager: MeshManager,
    controlsRef: CameraControlsImpl,
  ) {
    const mesh = meshManager.webTextMesh;
    if (!mesh) return;

    void controlsRef.rotateTo(Math.PI / 2, Math.PI / 2, true);
    this.fitWithPadding(controlsRef, mesh, 20);
  }

  private async focusLeashText(
    meshManager: MeshManager,
    controlsRef: CameraControlsImpl,
  ) {
    const mesh = meshManager.webTextMesh;
    if (!mesh) return;

    await controlsRef.rotateTo(Math.PI / 2, Math.PI / 8);
    this.fitWithPadding(controlsRef, mesh, 20);
  }

  private async focusHardware(
    meshManager: MeshManager,
    controlsRef: CameraControlsImpl,
  ) {
    if (
      this.stateManager.designManager.productManager.productId === 'CAT_COLLAR'
    ) {
      const mesh = meshManager.catBuckleMesh;
      if (!mesh) return;

      void controlsRef.rotateTo(0, Math.PI / 2, true);
      this.fitWithPadding(controlsRef, mesh, 10);
    }
    if (
      this.stateManager.designManager.productManager.productId === 'MARTINGALE'
    ) {
      const mesh = meshManager.dRingMesh;
      if (!mesh) return;

      void controlsRef.rotateTo(0, Math.PI / 2, true);
      this.fitWithPadding(controlsRef, mesh, 10);
    }
    const mesh = meshManager.hookMesh;
    if (!mesh) return;
    await controlsRef.rotateTo(Math.PI / 2, Math.PI / 8);

    this.fitWithPadding(controlsRef, mesh, 20);
  }

  private focusSize(
    meshManager: MeshManager,
    controlsRef: CameraControlsImpl,
    key: string | null,
  ) {
    if (!key) return;
    const mesh = meshManager.getMeshGroup(key);
    if (!mesh) return;
    controlsRef.rotateTo(0, Math.PI / 2);
    this.fitWithPadding(controlsRef, mesh, 20);
  }

  private focusModel(
    meshManager: MeshManager,
    modelKey: string | null,
    controlsRef: CameraControlsImpl,
  ) {
    if (!modelKey) return;

    const modelGroup = meshManager.getMeshGroup(modelKey);
    if (!modelGroup) return;

    void controlsRef.fitToBox(modelGroup, true);
  }

  private fitWithPadding(
    controlsRef: CameraControlsImpl,
    mesh: THREE.Object3D,
    padding: number,
  ) {
    void controlsRef.fitToBox(mesh, true, {
      paddingTop: padding,
      paddingLeft: padding,
      paddingBottom: padding,
      paddingRight: padding,
    });
  }

  private updatePolarAnglesForProduct(productId: string) {
    if (productId === 'LEASH') {
      this._minPolarAngle = CameraManager.LEASH_MIN_POLAR_ANGLE;
      this._maxPolarAngle = CameraManager.DEFAULT_MAX_POLAR_ANGLE;
      return;
    }

    this._minPolarAngle = CameraManager.DEFAULT_MIN_POLAR_ANGLE;
    this._maxPolarAngle = CameraManager.DEFAULT_MAX_POLAR_ANGLE;
  }

  updateCameraAnimation(delta: number) {
    const productManager = this.stateManager.designManager.productManager;
    const activeFeature = productManager.activeFeature;

    const controlsRef = this.controllRef;
    if (!controlsRef) return;

    if (activeFeature !== Feature.DESIGN) return;
    if (this._isUserControlling) return;

    if (productManager.activeModelKey) {
      const center =
        this.stateManager.design3DManager.meshManager.getVisibleMeshCenter(
          productManager.activeModelKey,
        );
      if (center && center.distanceToSquared(this._target) > 0.0001) {
        this.setTarget(center);
        controlsRef.setTarget(center.x, center.y, center.z, false);
      }
    }

    controlsRef.azimuthAngle += 0.3 * delta;

    if (controlsRef.azimuthAngle > Math.PI) {
      controlsRef.azimuthAngle -= 2 * Math.PI;
    } else if (controlsRef.azimuthAngle < -Math.PI) {
      controlsRef.azimuthAngle += 2 * Math.PI;
    }

    const targetPolarAngle = Math.PI / 2.15;
    const blend = Math.min(1, delta * 4);
    const nextPolarAngle = THREE.MathUtils.lerp(
      controlsRef.polarAngle,
      targetPolarAngle,
      blend,
    );
    controlsRef.polarAngle = THREE.MathUtils.clamp(
      nextPolarAngle,
      controlsRef.minPolarAngle,
      controlsRef.maxPolarAngle,
    );
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

  get minPolarAngle() {
    return this._minPolarAngle;
  }

  get maxPolarAngle() {
    return this._maxPolarAngle;
  }

  get isAutoRotate() {
    return this._isAutoRotate;
  }

  get autoRotateSpeed() {
    return this._autoRotateSpeed;
  }

  get isUserControlling() {
    return this._isUserControlling;
  }

  get controllRef() {
    return this._controllRef;
  }

  setTarget(inTarget: THREE.Vector3) {
    this._target = inTarget.clone();
  }

  setNear(inNear: number) {
    this._near = inNear;
  }

  setFar(inFar: number) {
    this._far = inFar;
  }

  setMinDistance(inMinDistance: number) {
    this._minDistance = inMinDistance;
  }

  setMaxDistance(inMaxDistance: number) {
    this._maxDistance = inMaxDistance;
  }

  setMinPolarAngle(inMinPolarAngle: number) {
    this._minPolarAngle = inMinPolarAngle;
  }

  setMaxPolarAngle(inMaxPolarAngle: number) {
    this._maxPolarAngle = inMaxPolarAngle;
  }

  setIsUserControlling(inIsUserControlling: boolean) {
    this._isUserControlling = inIsUserControlling;
  }

  setControllRef(inControllRef: CameraControlsImpl | null) {
    this._controllRef = inControllRef;
  }
}
