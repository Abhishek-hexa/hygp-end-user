import { makeAutoObservable } from 'mobx';
import { StateManager } from '../../StateManager';

export class FontLoadManager {
  private _libState: StateManager;
  private _fontCache = new Map<string, FontFace>();

  constructor(libState: StateManager) {
    this._libState = libState;
    makeAutoObservable(this);
  }

  async loadFonts(urls: string[]): Promise<void> {
    const pending = urls.filter(url => !this._fontCache.has(url));
    if (pending.length === 0) return;
    
    await Promise.all(pending.map(url => this.loadSingleFont(url)));
  }

  private async loadSingleFont(url: string): Promise<void> {
    const familySlug = this.urlToFamilySlug(url);
    const familyName = `engraving-font-${familySlug}`;
    const fontId = `font-${familySlug}`;

    this._libState.uiManager.add3DLoadingItem(fontId);
    try {
      const fontFace = new FontFace(familyName, `url(${url})`);
      await fontFace.load();
      document.fonts.add(fontFace);
      this._fontCache.set(url, fontFace);
    } catch (e) {
      console.error(`Failed to load font from URL: ${url}`, e);
    } finally {
      this._libState.uiManager.remove3DLoadingItem(fontId);
    }
  }

  getFontFamily(url: string | undefined | null, defaultFamily: string): string {
    if (!url) return defaultFamily;
    return `engraving-font-${this.urlToFamilySlug(url)}`;
  }

  private urlToFamilySlug(url: string): string {
    return url.replace(/[^a-zA-Z0-9]/g, '_');
  }
}
