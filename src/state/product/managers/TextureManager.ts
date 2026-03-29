import { makeAutoObservable } from 'mobx';

import { Collection, PatternType } from '../types';

export class TextureManager {
  private _availableCollections: Map<number, Collection> = new Map(); // id: Collection Description
  private _selectedCollectionIds: number[] = [];
  private _activeCollectionId: number | null = null;

  private _availablePatterns: Map<number, PatternType[]> = new Map();
  private _selectedPatternId: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get availableCollections() {
    return this._availableCollections;
  }

  get selectedCollection() {
    if (this._activeCollectionId !== null) {
      return this._availableCollections.get(this._activeCollectionId) ?? null;
    }
    return (
      this._availableCollections.get(this._selectedCollectionIds[0] ?? -1) ??
      null
    );
  }

  get selectedCollectionId() {
    return this._activeCollectionId;
  }

  get selectedCollectionIds() {
    return this._selectedCollectionIds;
  }

  get selectedCollections() {
    return this._selectedCollectionIds
      .map((id) => this._availableCollections.get(id))
      .filter(
        (collection): collection is Collection => collection !== undefined,
      );
  }

  get selectedPatternId() {
    return this._selectedPatternId;
  }

  get selectedPattern(): PatternType | null {
    if (this._selectedPatternId === null) {
      return null;
    }

    return (
      this.availablePatterns?.find(
        (pattern) => pattern.id === this._selectedPatternId,
      ) ?? null
    );
  }

  get availablePatterns(): PatternType[] | null {
    if (this._selectedCollectionIds.length === 0) {
      return null;
    }
    const mergedPatterns = this._selectedCollectionIds.flatMap(
      (collectionId) => this._availablePatterns.get(collectionId) ?? [],
    );
    return mergedPatterns;
  }

  setSelectedCollection(id: number) {
    this._activeCollectionId = id;
    if (!this._selectedCollectionIds.includes(id)) {
      this._selectedCollectionIds = [...this._selectedCollectionIds, id];
    }
  }

  setSelectedCollections(ids: number[]) {
    const uniqueIds = Array.from(new Set(ids)).filter((id) =>
      this._availableCollections.has(id),
    );
    this._selectedCollectionIds = uniqueIds;
    if (!uniqueIds.includes(this._activeCollectionId ?? -1)) {
      this._activeCollectionId = uniqueIds[0] ?? null;
    }
    this.ensureSelectedPattern();
  }

  toggleSelectedCollection(id: number) {
    if (this._selectedCollectionIds.includes(id)) {
      this._selectedCollectionIds = this._selectedCollectionIds.filter(
        (collectionId) => collectionId !== id,
      );
      if (this._activeCollectionId === id) {
        this._activeCollectionId = this._selectedCollectionIds[0] ?? null;
      }
      this.ensureSelectedPattern();
      return;
    }
    this._selectedCollectionIds = [...this._selectedCollectionIds, id];
    this._activeCollectionId = id;
    this.ensureSelectedPattern();
  }

  removeSelectedCollection(id: number) {
    this._selectedCollectionIds = this._selectedCollectionIds.filter(
      (collectionId) => collectionId !== id,
    );
    if (this._activeCollectionId === id) {
      this._activeCollectionId = this._selectedCollectionIds[0] ?? null;
    }
    this.ensureSelectedPattern();
  }

  setAvailableCollections(inCollections: Collection[]) {
    this._availableCollections = new Map();
    inCollections.forEach((collection) => {
      this._availableCollections.set(collection.id, collection);
    });
    const validIds = new Set(inCollections.map((collection) => collection.id));
    this._selectedCollectionIds = this._selectedCollectionIds.filter((id) =>
      validIds.has(id),
    );
    if (this._selectedCollectionIds.length === 0 && inCollections.length > 0) {
      this._selectedCollectionIds = [inCollections[0].id];
    }
    if (
      this._activeCollectionId === null ||
      !validIds.has(this._activeCollectionId)
    ) {
      this._activeCollectionId = this._selectedCollectionIds[0] ?? null;
    }
    this.ensureSelectedPattern();
  }

  setSelectedPattern(inPatternId: number | null) {
    this.ensureSelectedPattern(inPatternId);
  }

  setAvailablePatterns(inCollectionId: number, inPatterns: PatternType[]) {
    this._availablePatterns.set(inCollectionId, inPatterns);
    this.ensureSelectedPattern();
  }

  hasPatternsForCollection(collectionId: number) {
    return this._availablePatterns.has(collectionId);
  }

  resetSelection() {
    this._activeCollectionId = this._selectedCollectionIds[0] ?? null;
    this.ensureSelectedPattern();
  }

  reset() {
    this._selectedCollectionIds = [];
    this._activeCollectionId = null;
    this._selectedPatternId = null;
  }

  
  private ensureSelectedPattern(preferredPatternId: number | null = null) {
    const patterns = this.availablePatterns ?? [];

    if (patterns.length === 0) {
      this._selectedPatternId = null;
      return;
    }

    const targetPatternId = preferredPatternId ?? this._selectedPatternId;
    const hasTargetPattern =
      targetPatternId !== null &&
      patterns.some((pattern) => pattern.id === targetPatternId);

    this._selectedPatternId = hasTargetPattern
      ? targetPatternId
      : patterns[0].id;
  }
}
