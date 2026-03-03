import { makeAutoObservable } from 'mobx';
import { ApiCollection, ApiPattern } from '../types';

export class TextureManager {
  private _texture: string | null = null;

  private _availableCollections: string[] = [];
  private _selectedCollection: ApiCollection[] | null = null;

  private _availablePatterns: ApiPattern[] = [];
  private _selectedPattern: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get material() {
    return this._texture;
  }

  get availableCollections() {
    return this._availableCollections;
  }

  get selectedCollection() {
    return this._selectedCollection;
  }

  get availablePatterns() {
    return this._availablePatterns;
  }

  get selectedPattern() {
    return this._selectedPattern;
  }

  setMaterial(material: string) {
    this._texture = material;
  }

  setSelectedCollection(collection: ApiCollection[]) {
    this._selectedCollection = collection;
  }

  setAvailableCollections(collections: string[]) {
    this._availableCollections = collections;
  }

  setSelectedPattern(pattern: string) {
    this._selectedPattern = pattern;
  }

  setAvailablePatterns(patterns: ApiPattern[]) {
    this._availablePatterns = patterns;
  }

  reset() {
    this._texture = null;
  }
}
