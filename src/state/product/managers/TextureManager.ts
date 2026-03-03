import { makeAutoObservable } from 'mobx';
import { ApiPattern } from '../types';

export interface Collection {
  id: number;
  image: string;
  title: string;
}

export class TextureManager {
  private _texture: string | null = null;

  private _availableCollections: Map<number, Collection> = new Map();
  private _selectedCollection: Collection | null = null;

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

  setMaterial(inTexture: string) {
    this._texture = inTexture;
  }

  setSelectedCollection(id: number) {
    this._selectedCollection = this._availableCollections.get(id) ?? null;
  }

  setAvailableCollections(collections: Collection[]) {
    this._availableCollections = new Map();
    collections.forEach(collection => {
      this._availableCollections.set(collection.id, collection);
    });
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
