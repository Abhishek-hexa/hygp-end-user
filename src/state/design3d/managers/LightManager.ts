import { makeAutoObservable } from 'mobx';

export class LightManager {
  constructor() {
    makeAutoObservable(this);
  }
}
