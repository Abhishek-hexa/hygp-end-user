import { makeAutoObservable } from 'mobx';

import { ApiCollection, ApiPattern } from '../../../api/types';

export class TextureManager {
  private _texture: string | null = null;
  private _backendCollections: ApiCollection[] = [];
  private _backendPatterns: ApiPattern[] = [];
  private _selectedCollectionId = '';

  constructor() {
    makeAutoObservable(this);
  }

  get material() {
    return this._texture;
  }

  get backendCollections() {
    return this._backendCollections;
  }

  get backendPatterns() {
    return this._backendPatterns;
  }

  get selectedCollectionId() {
    return this._selectedCollectionId;
  }

  setMaterial(material: string) {
    this._texture = material;
  }

  setBackendCollections(collections: ApiCollection[]) {
    this._backendCollections = Array.isArray(collections) ? collections : [];
  }

  setBackendPatterns(patterns: ApiPattern[]) {
    this._backendPatterns = Array.isArray(patterns) ? patterns : [];
  }

  setSelectedCollectionId(collectionId: string) {
    this._selectedCollectionId = collectionId;
  }

  reset() {
    this._texture = null;
    this._backendCollections = [];
    this._backendPatterns = [];
    this._selectedCollectionId = '';
  }
}
