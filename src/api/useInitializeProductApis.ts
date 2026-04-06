import { useEffect, useRef } from 'react';
import { ProductManager } from '../state/product/ProductManager';
import { ProductType } from '../state/product/types';
import { UiManager } from '../state/ui/UiManager';
import { CachedAssets } from '../loaders/CachedAssets';
import { Parser } from './Parser';
import {
  useBucklesQuery,
  useCollectionProductsQuery,
  useCollectionsQuery,
  useEngravingFontsQuery,
  useLeashVariantsQuery,
  usePatternByIdQuery,
  useProductVariantsQuery,
} from './hooks/useProductApiHooks';

export const useInitializeProductApis = (
  productManager: ProductManager,
  uiManager: UiManager,
  productType: ProductType = ProductType.DOG_COLLAR,
  initialPatternId: number | null = null,
) => {
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
  const {
    data: leashes,
    isLoading: isLeashesLoading,
    isError: isLeashesError,
  } = useLeashVariantsQuery(productType);

  const targetPatternId =
    typeof initialPatternId === 'number' && Number.isFinite(initialPatternId)
      ? initialPatternId
      : null;

  const {
    data: patternData,
    isLoading: isPatternLoading,
    isError: isPatternError,
  } = usePatternByIdQuery(targetPatternId);

  let collectionIdToFetch = null;
  if (patternData?.product?.collectionId) {
    collectionIdToFetch = patternData.product.collectionId;
  } else if (isPatternError || targetPatternId === null) {
    const firstCollectionId = collections?.custom_collections?.[0]?.id;
    if (firstCollectionId !== undefined && firstCollectionId !== null) {
      collectionIdToFetch = String(firstCollectionId);
    }
  }

  if (patternData) {
    const preloadImage = patternData.product.png_image;
    if (!preloadImage) return;
    void CachedAssets.loadTexture(preloadImage);
  }

  const { data: collectionProducts, isLoading: isCollectionProductsLoading } =
    useCollectionProductsQuery(collectionIdToFetch);

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
    // Ensure we don't prematurely finish loading if we haven't even decided what collection to fetch yet but we should
    (!collections &&
      isCollectionsLoading === false &&
      isCollectionsError === false);

  const isDataError =
    isVariantsError ||
    isBucklesError ||
    isEngravingFontsError ||
    isCollectionsError;

  useEffect(() => {
    uiManager.setDataLoading(isDataLoading);
  }, [isDataLoading, uiManager]);

  useEffect(() => {
    if (isDataError) {
      uiManager.setDataError('Could not load product data. Please try again.');
    } else {
      uiManager.setDataError(null);
    }
  }, [isDataError, uiManager]);

  const lastProcessedProductType = useRef<ProductType | null>(null);
  const lastProcessedPatternId = useRef<number | null | undefined>(undefined);

  useEffect(() => {
    if (isDataLoading || isDataError) return;
    if (!variants || !engravingFonts || !collections) return;

    // Prevent redundant syncs if the deps haven't actually changed in a way that requires re-initialization
    if (
      lastProcessedProductType.current === productType &&
      lastProcessedPatternId.current === initialPatternId
    )
      return;

    lastProcessedProductType.current = productType;
    lastProcessedPatternId.current = initialPatternId;

    // Changing pattern route should not reset the currently active tab.
    // Only reset full product state when the actual product type changes.
    if (productManager.productId !== productType) {
      productManager.setProduct(productType);
    }

    const { webbingFonts, engravingFonts: parsedEngravingFonts } =
      Parser.parseFonts(engravingFonts);
    productManager.webbingText.setAvailableFonts(webbingFonts);
    productManager.engravingManager.setAvailableFonts(parsedEngravingFonts);

    const { sizeMap } = Parser.parseSizes(variants);
    productManager.sizeManager.setAvailableSizes(sizeMap);

    const { collections: parsedCollections } = Parser.parseCollections(
      collections,
      productManager.textureManager,
    );
    productManager.textureManager.setAvailableCollections(parsedCollections);

    if (buckles) {
      const { metalColors, plasticColors, breakawayColors } =
        Parser.parseBuckles(buckles);
      productManager.buckleManager.setMetalColors(metalColors);
      productManager.buckleManager.setPlasticColors(plasticColors);
      productManager.buckleManager.setBreakawayColors(breakawayColors);
    }

    if (collectionProducts) {
      let finalPatternTarget = null;
      if (
        patternData &&
        patternData.product.collectionId === collectionIdToFetch
      ) {
        finalPatternTarget = targetPatternId;
      }

      const { parsedCollectionId, patterns, matchedPatternId } =
        Parser.parsePatterns(collectionProducts, finalPatternTarget);
      productManager.textureManager.setSelectedCollections([
        parsedCollectionId,
      ]);
      productManager.textureManager.setAvailablePatterns(
        parsedCollectionId,
        patterns,
      );
      productManager.textureManager.setSelectedPattern(matchedPatternId);

      const selectedPattern = productManager.textureManager.selectedPattern;
      if (selectedPattern?.pngImage) {
        void CachedAssets.loadTexture(selectedPattern.pngImage);
      }
    }

    if (productType === ProductType.DOG_COLLAR && leashes) {
      const { orderedLengths, orderedLengthPrices } =
        Parser.parseLeashVariants(leashes);
      productManager.sizeManager.setAvailableLengths(orderedLengths);
      productManager.sizeManager.setLengthPrices(orderedLengthPrices);
    }
  }, [
    isDataLoading,
    isDataError,
    variants,
    engravingFonts,
    collections,
    buckles,
    collectionProducts,
    productType,
    initialPatternId,
    leashes,
    patternData,
    targetPatternId,
    collectionIdToFetch,
    productManager,
  ]);
};
