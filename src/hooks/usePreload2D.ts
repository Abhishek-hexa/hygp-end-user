import { useEffect, useMemo } from 'react';
import { Parser } from '../api/Parser';
import { EngravingFontsApiResponse } from '../api/types/api.types';
import { preloadImages } from './useLazyImage';

export function usePreload2D(
  engravingFonts?: EngravingFontsApiResponse,
  enabled = true,
) {
  const fontPreviewImages = useMemo(() => {
    if (!engravingFonts) return [];
    return Parser.parseFonts(engravingFonts).fontPreviewImages;
  }, [engravingFonts]);

  useEffect(() => {
    if (!enabled) return;
    if (fontPreviewImages.length === 0) return;
    void preloadImages(fontPreviewImages).catch(() => undefined);
  }, [enabled, fontPreviewImages]);
}
