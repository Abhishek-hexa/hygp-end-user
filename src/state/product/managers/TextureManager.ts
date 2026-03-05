import { makeAutoObservable } from 'mobx';

import { Collection } from '../types';

export interface PatternType {
  id: number;
  name: string;
  dataX: string;
  pngImage: string;
  preview: string;
}

export class TextureManager {

  private _availableCollections: Map<number, Collection> = new Map(); // id: Collection Description
  private _selectedCollection: number | null = null;

  private _availablePatterns: Map<number, PatternType[]> = new Map();
  private _selectedPatternId: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get availableCollections() {
    return this._availableCollections;
  }

  get selectedCollection() {
    return (
      this._availableCollections.get(this._selectedCollection ?? -1) ?? null
    );
  }

  get selectedCollectionId() {
    return this._selectedCollection;
  }

  get selectedPatternId() {
    return this._selectedPatternId;
  }

  get availablePatterns(): PatternType[] | null {
    if (this._selectedCollection === null) {
      return null;
    }
    return this._availablePatterns.get(this._selectedCollection) ?? null;
  }

  setSelectedCollection(id: number) {
    this._selectedCollection = id;
  }

  setAvailableCollections(collections: Collection[]) {
    this._availableCollections = new Map();
    collections.forEach((collection) => {
      this._availableCollections.set(collection.id, collection);
    });
    if (collections.length > 0 && this._selectedCollection === null) {
      this._selectedCollection = collections[0].id;
    }
  }

  setSelectedPattern(inPatternId: number) {
    this._selectedPatternId = inPatternId;
  }

  setAvailablePatterns(inCollectionId: number, inPatterns: PatternType[]) {
    this._availablePatterns.set(inCollectionId, inPatterns);
  }

  reset() {
    this._availableCollections = new Map();
    this._selectedCollection = null;
    this._availablePatterns = new Map();
    this._selectedPatternId = null;
  }
}
