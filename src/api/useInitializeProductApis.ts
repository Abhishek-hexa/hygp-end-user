import { useEffect, useMemo, useRef } from 'react';

import { usePreload2D } from '../hooks/usePreload2D';
import { CachedAssets } from '../loaders/CachedAssets';
import { ProductManager } from '../state/product/ProductManager';
import { ProductType } from '../state/product/types';
import { UiManager } from '../state/ui/UiManager';
import {
  useBucklesQuery,
  useCollectionProductsQuery,
  useCollectionsQuery,
  useEngravingFontsQuery,
  useLeashVariantsQuery,
  usePatternByIdQuery,
  useProductVariantsQuery,
} from './hooks/useProductApiHooks';
import { Parser } from './Parser';

export const useInitializeProductApis = (
  productManager: ProductManager,
  uiManager: UiManager,
  productType: ProductType = ProductType.DOG_COLLAR,
  initialPatternId: number | null = null,
) => {
  /** ---------------------------------------
   * 🔹 Queries
   * -------------------------------------- */
  const {
    data: variants,
    isLoading: isVariantsLoading,
    isError: isVariantsError,
  } = useProductVariantsQuery(productType);

  const {
    data: buckles,
    isLoading: isBucklesLoading,
    isError: isBucklesError,
  } = useBucklesQuery(productType);

  const {
    data: engravingFonts,
    isLoading: isEngravingFontsLoading,
    isError: isEngravingFontsError,
  } = useEngravingFontsQuery(productType);

  const {
    data: collections,
    isLoading: isCollectionsLoading,
    isError: isCollectionsError,
  } = useCollectionsQuery(productType);

  const { data: leashes, isLoading: isLeashesLoading } =
    useLeashVariantsQuery(productType);

  /** ---------------------------------------
   * 🔹 Derived State
   * -------------------------------------- */
  const targetPatternId = useMemo(() => {
    return typeof initialPatternId === 'number' &&
      Number.isFinite(initialPatternId)
      ? initialPatternId
      : null;
  }, [initialPatternId]);

  const {
    data: patternData,
    isLoading: isPatternLoading,
    isError: isPatternError,
  } = usePatternByIdQuery(targetPatternId);

  const collectionIdToFetch = useMemo(() => {
    if (patternData?.product?.collectionId) {
      return patternData.product.collectionId;
    }

    if (isPatternError || targetPatternId === null) {
      return collections?.custom_collections?.[0]?.id ?? null;
    }

    return null;
  }, [patternData, isPatternError, targetPatternId, collections]);

  const { data: collectionProducts, isLoading: isCollectionProductsLoading } =
    useCollectionProductsQuery(collectionIdToFetch);

  /** ---------------------------------------
   * 🔹 Preload Fonts
   * -------------------------------------- */
  usePreload2D(engravingFonts, uiManager.isDefaultLoaded);

  /** ---------------------------------------
   * 🔹 Loading & Error State
   * -------------------------------------- */
  const isInitialQueriesLoading =
    isVariantsLoading ||
    isBucklesLoading ||
    isEngravingFontsLoading ||
    isCollectionsLoading ||
    isLeashesLoading;

  const isDataLoading =
    isInitialQueriesLoading ||
    (targetPatternId !== null && isPatternLoading) ||
    (collectionIdToFetch !== null && isCollectionProductsLoading) ||
    (!collections && !isCollectionsLoading && !isCollectionsError);

  const isDataError =
    isVariantsError ||
    isBucklesError ||
    isEngravingFontsError ||
    isCollectionsError;

  /** ---------------------------------------
   * 🔹 UI State Effects
   * -------------------------------------- */
  useEffect(() => {
    uiManager.setDataLoading(isDataLoading);
  }, [isDataLoading, uiManager]);

  useEffect(() => {
    uiManager.setDataError(
      isDataError ? 'Could not load product data. Please try again.' : null,
    );
  }, [isDataError, uiManager]);

  /** ---------------------------------------
   * 🔹 Reset on Product Type Change
   * -------------------------------------- */
  const hasInitializedCollectionsRef = useRef(false);

  useEffect(() => {
    if (productManager.productId !== productType) {
      productManager.setProduct(productType);
      hasInitializedCollectionsRef.current = false;
    }
  }, [productType, productManager]);

  /** ---------------------------------------
   * 🔹 Fonts
   * -------------------------------------- */
  useEffect(() => {
    if (!engravingFonts) return;

    const { webbingFonts, engravingFonts: parsed } =
      Parser.parseFonts(engravingFonts);

    productManager.webbingText.setAvailableFonts(webbingFonts);
    productManager.engravingManager.setAvailableFonts(parsed);
  }, [engravingFonts, productManager]);

  /** ---------------------------------------
   * 🔹 Sizes
   * -------------------------------------- */
  useEffect(() => {
    if (!variants) return;

    const { sizeMap } = Parser.parseSizes(variants);
    productManager.sizeManager.setAvailableSizes(sizeMap);
  }, [variants, productManager]);

  /** ---------------------------------------
   * 🔹 Collections
   * -------------------------------------- */
  useEffect(() => {
    if (!collections) return;

    const { collections: parsed } = Parser.parseCollections(collections);
    productManager.textureManager.setAvailableCollections(parsed);
  }, [collections, productManager]);

  /** ---------------------------------------
   * 🔹 Buckles
   * -------------------------------------- */
  useEffect(() => {
    if (!buckles) return;

    const { metalColors, plasticColors, breakawayColors } =
      Parser.parseBuckles(buckles);

    productManager.buckleManager.setMetalColors(metalColors);
    productManager.buckleManager.setPlasticColors(plasticColors);
    productManager.buckleManager.setBreakawayColors(breakawayColors);
  }, [buckles, productManager]);

  /** ---------------------------------------
   * 🔹 Patterns
   * -------------------------------------- */
  useEffect(() => {
    if (!collectionProducts) return;

    let finalPatternTarget = null;

    if (
      patternData &&
      patternData.product.collectionId === collectionIdToFetch
    ) {
      finalPatternTarget = targetPatternId;
    }

    const { parsedCollectionId, patterns, matchedPatternId } =
      Parser.parsePatterns(collectionProducts, finalPatternTarget);

    if (!hasInitializedCollectionsRef.current) {
      productManager.textureManager.setSelectedCollections([
        parsedCollectionId,
      ]);
      hasInitializedCollectionsRef.current = true;
    }

    productManager.textureManager.setAvailablePatterns(
      parsedCollectionId,
      patterns,
    );

    productManager.textureManager.setSelectedPattern(matchedPatternId);
  }, [
    collectionProducts,
    patternData,
    collectionIdToFetch,
    targetPatternId,
    productManager,
  ]);

  /** ---------------------------------------
   * 🔹 Leash Logic
   * -------------------------------------- */
  useEffect(() => {
    if (productType !== ProductType.DOG_COLLAR || !leashes) return;

    const { orderedLengths, orderedLengthPrices } =
      Parser.parseLeashVariants(leashes);

    productManager.sizeManager.setAvailableLengths(orderedLengths);
    productManager.sizeManager.setLengthPrices(orderedLengthPrices);
  }, [leashes, productType, productManager]);

  /** ---------------------------------------
   * 🔹 Image Preloading
   * -------------------------------------- */
  useEffect(() => {
    if (!patternData?.product?.png_image) return;

    void CachedAssets.loadTexture(patternData.product.png_image);
  }, [patternData]);

  useEffect(() => {
    const selectedPattern = productManager.textureManager.selectedPattern;

    if (selectedPattern?.pngImage) {
      void CachedAssets.loadTexture(selectedPattern.pngImage);
    }
  }, [productManager.textureManager.selectedPattern]);
};
