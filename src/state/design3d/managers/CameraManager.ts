import { makeAutoObservable, reaction } from 'mobx';
import { ProductType } from '../../product/types';
import { StateManager } from '../../StateManager';

export type Vec3 = [number, number, number];

export const CAMERA_POSITIONS_BY_PRODUCT: Record<ProductType, Vec3> = {
  DOG_COLLAR: [0, 0, 200],
  CAT_COLLAR: [0, 0, 200],
  MARTINGALE: [0, 0, 200],
  LEASH: [0, 0, 350],
  BANDANA: [0, 0, 300],
  HARNESS: [0, 0, 600],
};

export class CameraManager {
  private _libState: StateManager;
  private _position: Vec3;
  private _target: Vec3 = [0, 0, 0];
  private _fov = 26;
  private _near = 0.1;
  private _far = 10000;
  private _isAutoRotate = false;
  private _autoRotateSpeed = 0.5;

  constructor(libState: StateManager) {
    this._libState = libState;
    this._position =
      CAMERA_POSITIONS_BY_PRODUCT[this._libState.designManager.productManager.productId];
    makeAutoObservable(this, {}, { autoBind: true });
    reaction(
      () => this.productType,
      (productType) => {
        this._position = CAMERA_POSITIONS_BY_PRODUCT[productType];
      },
      { fireImmediately: true },
    );
  }

  get position() {
    return this._position;
  }

  get productType(): ProductType {
    return this._libState.designManager.productManager.productId;
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

  get isAutoRotate() {
    return this._isAutoRotate;
  }

  get autoRotateSpeed() {
    return this._autoRotateSpeed;
  }

  setPosition(position: Vec3) {
    this._position = position;
  }

  applyProductCameraPosition(productId: ProductType) {
    this._position = CAMERA_POSITIONS_BY_PRODUCT[productId];
  }

  setTarget(target: Vec3) {
    this._target = target;
  }

  setFov(fov: number) {
    this._fov = fov;
  }

  setNear(near: number) {
    this._near = near;
  }

  setFar(far: number) {
    this._far = far;
  }

  setAutoRotate(isAutoRotate: boolean) {
    this._isAutoRotate = isAutoRotate;
  }

  setAutoRotateSpeed(speed: number) {
    this._autoRotateSpeed = speed;
  }
}
