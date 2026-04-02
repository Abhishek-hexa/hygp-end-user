import axios from 'axios';

import { ProductManager } from '../state/product/ProductManager';
import { ProductType } from '../state/product/types';
import { UiManager } from '../state/ui/UiManager';
import { apiEndPointMap } from './ApiEndPointMap';
import { Parser } from './Parser';
import { CachedAssets } from '../loaders/CachedAssets';
import {
  BucklesApiResponse,
  CollectionProductsApiResponse,
  EngravingFontsApiResponse,
  LeashVariantsApiResponse,
  ProductByIdApiResponse,
  ProductVariantsApiResponse,
  ShopifyCollectionsApiResponse,
} from './types/api.types';

const fetchJson = async <T>(
  baseUrl: string,
  path: string,
  _label: string,
): Promise<T> => {
  const { data } = await axios.get<T>(`${baseUrl}${path}`);

  // console.log(`[product-init] ${label}`, data);
  return data;
};

export const initializeProductApis = async (
  productManager: ProductManager,
  uiManager: UiManager,
  productType: ProductType = 'DOG_COLLAR',
  initialPatternId: number | null = null,
) => {
  uiManager.setDataLoading(true);
  uiManager.setDataError(null);
  productManager.setProduct(productType);

  const endPoints = apiEndPointMap[productType];

  const baseUrl = String(import.meta.env.VITE_API_BASE_URL ?? '').replace(
    /\/$/,
    '',
  );

  try {
    const [variants, buckles, engravingFonts, collections, leashes] =
      await Promise.all([
        fetchJson<ProductVariantsApiResponse>(
          baseUrl,
          endPoints.productVariants,
          'product variants',
        ),

        fetchJson<BucklesApiResponse>(
          baseUrl,
          endPoints.buckles ?? '/buckle',
          'buckles',
        ),

        fetchJson<EngravingFontsApiResponse>(
          baseUrl,
          endPoints.engravingFonts,
          'engraving fonts',
        ),

        fetchJson<ShopifyCollectionsApiResponse>(
          baseUrl,
          endPoints.collections,
          'collections',
        ),

        productType === 'DOG_COLLAR' && endPoints.leashVariants
          ? fetchJson<LeashVariantsApiResponse>(
              baseUrl,
              endPoints.leashVariants,
              'leash variants',
            )
          : Promise.resolve<LeashVariantsApiResponse | null>(null),
      ]);

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

    const { metalColors, plasticColors, breakawayColors } =
      Parser.parseBuckles(buckles);
    productManager.buckleManager.setMetalColors(metalColors);
    productManager.buckleManager.setPlasticColors(plasticColors);
    productManager.buckleManager.setBreakawayColors(breakawayColors);

    const selectedPatternId =
      typeof initialPatternId === 'number' && Number.isFinite(initialPatternId)
        ? initialPatternId
        : null;

    let targetPatternId = selectedPatternId;
    let collectionProducts: CollectionProductsApiResponse | null = null;

    if (selectedPatternId !== null) {
      try {
        const selectedPatternResponse = await fetchJson<ProductByIdApiResponse>(
          baseUrl,
          `/product/${selectedPatternId}`,
          'pattern by id',
        );

        const selectedPattern = selectedPatternResponse.product;
        const selectedCollectionId = parseInt(selectedPattern.collectionId);

        if (selectedCollectionId !== null) {
          collectionProducts = await fetchJson<CollectionProductsApiResponse>(
            baseUrl,
            `/shopify-collection/products/${selectedCollectionId}`,
            'collection products',
          );
        } else {
          targetPatternId = null;
        }
      } catch (error) {
        targetPatternId = null;
        // eslint-disable-next-line no-console
        console.warn(
          '[product-init] Failed to resolve deep-link pattern',
          error,
        );
      }
    }

    if (!collectionProducts) {
      const firstCollectionId = collections?.custom_collections?.[0]?.id;

      if (firstCollectionId !== undefined && firstCollectionId !== null) {
        collectionProducts = await fetchJson<CollectionProductsApiResponse>(
          baseUrl,
          `/shopify-collection/products/${String(firstCollectionId)}`,
          'collection products',
        );
      }
      targetPatternId = null;
    }

    if (collectionProducts) {
      const { parsedCollectionId, patterns, matchedPatternId } =
        Parser.parsePatterns(
          collectionProducts,
          targetPatternId,
        );
      productManager.textureManager.setSelectedCollections([parsedCollectionId]);
      productManager.textureManager.setAvailablePatterns(
        parsedCollectionId,
        patterns,
      );
      productManager.textureManager.setSelectedPattern(matchedPatternId);

      // Preload the pattern image immediately so it's cached by the time
      // the 3D scene mounts — avoids the PNG loading last in the waterfall.
      const selectedPattern = productManager.textureManager.selectedPattern;
      if (selectedPattern?.pngImage) {
        void CachedAssets.loadTexture(selectedPattern.pngImage);
      }
    }

    if (productType === 'DOG_COLLAR' && leashes) {
      const { orderedLengths, orderedLengthPrices } =
        Parser.parseLeashVariants(leashes);
      productManager.sizeManager.setAvailableLengths(orderedLengths);
      productManager.sizeManager.setLengthPrices(orderedLengthPrices);
    }
  } catch (error) {
    uiManager.setDataError('Could not load product data. Please try again.');
    // eslint-disable-next-line no-console
    console.error('[product-init] API initialization failed', error);
  } finally {
    uiManager.setDataLoading(false);
  }
};
