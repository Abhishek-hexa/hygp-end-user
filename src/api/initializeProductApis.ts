import axios from 'axios';

import { ProductManager } from '../state/product/ProductManager';
import { BuckleManager } from '../state/product/managers/BuckleManager';
import { EngravingManager } from '../state/product/managers/EngravingManager';
import { TextureManager } from '../state/product/managers/TextureManager';
import { WebbingTextManager } from '../state/product/managers/WebbingTextManager';
import {
  Collection,
  ColorDescription,
  FontDescription,
  LeashLengthType,
  PatternType,
  ProductSizeType,
  ProductType,
  SizeDescription,
} from '../state/product/types';
import { apiEndPointMap } from './ApiEndPointMap';
import {
  BucklesApiResponse,
  CollectionProductsApiResponse,
  EngravingFontsApiResponse,
  LeashVariantsApiResponse,
  ProductVariantApiItem,
  ProductVariantsApiResponse,
  ShopifyCollectionApiItem,
  ShopifyCollectionsApiResponse,
} from './types/api.types';

const fetchJson = async <T>(
  baseUrl: string,
  path: string,
  label: string,
): Promise<T> => {
  const { data } = await axios.get<T>(`${baseUrl}${path}`);
  // eslint-disable-next-line no-console
  // console.log(`[product-init] ${label}`, data);
  return data;
};

export const initializeProductApis = async (
  productManager: ProductManager,
  productType: ProductType = 'DOG_COLLAR',
) => {
  console.log(
    `[product-init] Starting API initialization for product type: ${productType}`,
  );
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

    // Fetch patterns for the first collection by default.
    const firstCollectionId = collections?.custom_collections?.[0]?.id;
    let firstCollectionProducts: CollectionProductsApiResponse | null = null;

    if (firstCollectionId !== undefined && firstCollectionId !== null) {
      const res = await fetchJson<CollectionProductsApiResponse>(
        baseUrl,
        `/shopify-collection/products/${String(firstCollectionId)}`,
        'collection products',
      );
      firstCollectionProducts = res;
    }

    parseFonts(
      engravingFonts,
      productManager.webbingText,
      productManager.engravingManager,
    );

    parseSizes(variants, productManager);
    parseCollections(collections, productManager.textureManager);
    parseBuckles(buckles, productManager.buckleManager);

    if (firstCollectionProducts) {
      parsePatterns(firstCollectionProducts, productManager.textureManager);
    }

    if (productType === 'DOG_COLLAR' && leashes) {
      parseLeashVariants(leashes, productManager.sizeManager);
    }

    console.log('[product-init] API initialization completed successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[product-init] API initialization failed', error);
  }
};

const parseFonts = (
  engravingFontsResponse: EngravingFontsApiResponse,
  webbingTextManager: WebbingTextManager,
  engravingManager: EngravingManager,
) => {
  const fontOptions = engravingFontsResponse.data;

  const webbingFonts: Map<number, FontDescription> = new Map();
  const engravingFonts: Map<number, FontDescription> = new Map();

  fontOptions.forEach((font) => {
    if (font.use_case.includes('webbing')) {
      webbingFonts.set(font.id, {
        id: font.id,
        name: font.name,
        preview: font.preview,
        font_path: font.font_path,
      });
    }
    if (font.use_case.includes('buckle')) {
      engravingFonts.set(font.id, {
        id: font.id,
        name: font.name,
        preview: font.preview,
        font_path: font.font_path,
      });
    }
  });

  webbingTextManager.setAvailableFonts(webbingFonts);
  engravingManager.setAvailableFonts(engravingFonts);
};

const parseSizes = (
  sizeOptions: ProductVariantsApiResponse,
  productManager: ProductManager,
) => {
  const sizes = sizeOptions.variants ? sizeOptions.variants : sizeOptions.data;
  const sizeMap: Map<ProductSizeType, SizeDescription> = new Map();

  sizes.forEach((size: ProductVariantApiItem) => {
    const parsedSize = recordValue(size);
    if (!parsedSize) {
      return;
    }

    const sizeDescription: SizeDescription = {
      id: typeof size.id === 'string' ? parseInt(size.id) : size.id,
      price: size.price ? size.price : size.withoutBellPrice,
      model: size.model,
      plasticModel: size.plasticModel,
    };

    sizeMap.set(parsedSize, sizeDescription);
  });

  productManager.sizeManager.setAvailableSizes(sizeMap);
};

const recordValue = (size: ProductVariantApiItem): ProductSizeType | null => {
  const normalized = String(size?.size)
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/-/g, '');

  const sizeLookup: Record<string, ProductSizeType> = {
    EXTRASMALL: 'EXTRA_SMALL',
    SMALL: 'SMALL',
    MEDIUMNARROW: 'MEDIUM_NARROW',
    MEDIUMWIDE: 'MEDIUM_WIDE',
    LARGE: 'LARGE',
    XLARGE: 'XLARGE',
    XXLARGE: 'XXLARGE',
  };

  return sizeLookup[normalized] ?? null;
};

const parseCollections = (
  collectionsResponse: ShopifyCollectionsApiResponse,
  textureManager: TextureManager,
) => {
  const allCollections = collectionsResponse.custom_collections;

  const collections: Collection[] = [];
  allCollections.forEach((collection: ShopifyCollectionApiItem) => {
    const parsedCollection: Collection = {
      id: parseInt(collection.id),
      image: collection.image,
      title: collection.title,
    };
    collections.push(parsedCollection);
  });
  textureManager.setAvailableCollections(collections);
};

const parseBuckles = (
  bucklesResponse: BucklesApiResponse,
  buckleManager: BuckleManager,
) => {
  const buckles = bucklesResponse.data;
  const metalColors: ColorDescription[] = [];
  const plasticColors: ColorDescription[] = [];
  const breakawayColors: ColorDescription[] = [];

  buckles.forEach((buckle: any) => {
    if (buckle.metal_color) {
      const parsedMetalColor = {
        id: buckle.id,
        material_id: buckle.material_id,
        name: buckle.name,
        material_type: buckle.material_type
          ? {
              id: buckle.material_type.id,
              name: buckle.material_type.name,
            }
          : { id: 0, name: 'METAL' },
        hex: buckle.metal_color,
        preview: buckle.preview,
      };
      metalColors.push(parsedMetalColor);
    }

    if (buckle.plastic_color) {
      const parsedPlasticColor = {
        id: buckle.id,
        material_id: buckle.material_id,
        name: buckle.name,
        material_type: buckle.material_type
          ? {
              id: buckle.material_type.id,
              name: buckle.material_type.name,
            }
          : { id: 0, name: 'PLASTIC' },
        hex: buckle.plastic_color,
        preview: buckle.preview,
      };
      plasticColors.push(parsedPlasticColor);
    }

    if (buckle.breakaway_color) {
      const parsedBreakawayColor = {
        id: buckle.id,
        material_id: buckle.material_id,
        name: buckle.name,
        material_type: buckle.material_type
          ? {
              id: buckle.material_type.id,
              name: buckle.material_type.name,
            }
          : { id: 0, name: 'BREAKAWAY' },
        hex: buckle.breakaway_color,
        preview: buckle.preview,
      };
      breakawayColors.push(parsedBreakawayColor);
    }
  });
  buckleManager.setMetalColors(metalColors);
  buckleManager.setPlasticColors(plasticColors);
  buckleManager.setBreakawayColors(breakawayColors);
};

const parsePatterns = (
  collectionProductsResponse: CollectionProductsApiResponse,
  textureManager: TextureManager,
) => {
  const { collectionId, products } = collectionProductsResponse;
  const patterns: PatternType[] = [];

  products.forEach((product) => {
    const parsedProduct: PatternType = {
      id: parseInt(product.id),
      name: product.name,
      dataX: product.dataX,
      pngImage: product.png_image,
      preview: product.preview,
    };
    patterns.push(parsedProduct);
  });
  const parsedCollectionId = parseInt(collectionId);
  textureManager.setSelectedCollection(parsedCollectionId);
  textureManager.setAvailablePatterns(parsedCollectionId, patterns);
  textureManager.setSelectedPattern(patterns[0]?.id ?? null);
};

const parseLeashVariants = (
  leashVariantsResponse: LeashVariantsApiResponse,
  sizeManager: ProductManager['sizeManager'],
) => {
  const availableLengths: LeashLengthType[] = [];
  const seen = new Set<LeashLengthType>();
  const lengthPrices: Map<LeashLengthType, string> = new Map();

  leashVariantsResponse.data.forEach((variant) => {
    variant.length?.forEach((lengthLabel) => {
      const parsedLength = parseLeashLengthLabel(lengthLabel);
      if (!parsedLength || seen.has(parsedLength)) {
        return;
      }

      seen.add(parsedLength);
      availableLengths.push(parsedLength);
      lengthPrices.set(parsedLength, variant.price);
    });
  });

  const orderedLengths = (['3', '4', '5', '6'] as LeashLengthType[]).filter(
    (length) => seen.has(length),
  );
  sizeManager.setAvailableLengths(orderedLengths);
  const orderedLengthPrices = new Map<LeashLengthType, string>();
  orderedLengths.forEach((length) => {
    const price = lengthPrices.get(length);
    if (price) {
      orderedLengthPrices.set(length, price);
    }
  });
  sizeManager.setLengthPrices(orderedLengthPrices);
};

const parseLeashLengthLabel = (
  lengthLabel: string,
): LeashLengthType | null => {
  const parsed = String(lengthLabel).match(/[3-6]/)?.[0];
  if (
    parsed === '3' ||
    parsed === '4' ||
    parsed === '5' ||
    parsed === '6'
  ) {
    return parsed;
  }
  return null;
};
