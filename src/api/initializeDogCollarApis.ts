import axios from 'axios';

import { ProductManager } from '../state/product/ProductManager';
import { WebbingTextManager } from '../state/product/managers/WebbingTextManager';
import { EngravingManager } from '../state/product/managers/EngravingManager';
import { BuckleType, Collection, ColorDescription, PatternType, ProductSizeType, SizeDescription } from '../state/product/types';
import { TextureManager } from '../state/product/managers/TextureManager';
import { BuckleManager } from '../state/product/managers/BuckleManager';
import { BucklesApiResponse, CollectionProductsApiResponse, EngravingFontsApiResponse, ProductVariantsApiResponse, ShopifyCollectionsApiResponse } from './types/api.types';

const fetchJson = async <T>(
  baseUrl: string,
  path: string,
  label: string,
): Promise<T> => {
  const { data } = await axios.get<T>(`${baseUrl}${path}`);
  // eslint-disable-next-line no-console
  // console.log(`[dog-collar-init] ${label}`, data);
  return data;
};

export const initializeDogCollarApis = async (
  productManager: ProductManager,
) => {
  productManager.setProduct('DOG_COLLAR');

  const baseUrl = String(import.meta.env.VITE_API_BASE_URL ?? '').replace(
    /\/$/,
    '',
  );

  try {
    const [variants, buckles, engravingFonts, collections] = await Promise.all([
      fetchJson<ProductVariantsApiResponse>(
        baseUrl,
        '/product/variants/8969048817879',
        'product variants'
      ),

      fetchJson<BucklesApiResponse>(
        baseUrl,
        '/buckle',
        'buckles'
      ),

      fetchJson<EngravingFontsApiResponse>(
        baseUrl,
        '/engraving-fonts',
        'engraving fonts'
      ),

      fetchJson<ShopifyCollectionsApiResponse>(
        baseUrl,
        '/shopify-collection/',
        'collections'
      ),
    ])

    // fetching first collection's Pattern
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
    
    // Parsing and setting up values to our managers
    parseFonts(
      engravingFonts, 
      productManager.webbingText, 
      productManager.engravingManager
    );

    parseSizes(variants, productManager);

    parseCollections(collections, productManager.textureManager);

    parseBuckles(buckles, productManager.buckleManager);

    if(firstCollectionProducts){
      parsePatterns(firstCollectionProducts, productManager.textureManager);
    }

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[dog-collar-init] API initialization failed', error);
  }
};

const parseFonts = (engravingFontsResponse: any, WebbingTextManager: WebbingTextManager, EngravingManager: EngravingManager) => {
  const fontOptions = engravingFontsResponse.data;

  const webbingFonts: Map<string, string> = new Map();
  const engravingFonts: Map<string, string> = new Map();

  fontOptions.forEach((font: any) =>{
    if(font.use_case.includes("webbing")){
      webbingFonts.set(font.name, font.font_path);
    }
    if(font.use_case.includes("buckle")){
      engravingFonts.set(font.name, font.font_path);
    }
  })

  WebbingTextManager.fontManager.setAvailableFonts(webbingFonts);
  EngravingManager.setAvailableFonts(engravingFonts);
}

const parseSizes = (sizeOptions: any, productManager: ProductManager) => {
  const sizes = sizeOptions?.variants ?? [];
  const sizeMap: Map<ProductSizeType, SizeDescription> = new Map();
  
  sizes.forEach((size: any) => {
    const parsedSize = recordValue(size);
    if (!parsedSize) {
      return;
    }

    const sizeDescription: SizeDescription = {
      id: size.id,
      price: size.price,
      model: size.model,
      plasticModel: size.plasticModel,
    }

    
    sizeMap.set(parsedSize, sizeDescription);
  });
  
  productManager.sizeManager.setAvailableSizes(sizeMap);
};

const recordValue = (size: any): ProductSizeType | null => {
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

const parseCollections = (collectionsResponse: any, textureManager: TextureManager) => {
  const allCollections = collectionsResponse.custom_collections;
  console.log(allCollections);

  const collections: Collection[] = [];
  allCollections.forEach((collection: any) => {
    const parsedCollection: Collection = {
      id: parseInt(collection.id),
      image: collection.image,
      title: collection.title,
    }
    collections.push(parsedCollection);
  });
  textureManager.setAvailableCollections(collections);
}

const parseBuckles = (bucklesResponse: any, buckleManager: BuckleManager) => {
  const buckles = bucklesResponse.data;
  const buckleTypes: BuckleType[] = [];
  const metalColors: ColorDescription[] = [];
  const plasticColors: ColorDescription[] = [];
  const breakawayColors: ColorDescription[] = [];

  buckles.forEach((buckle: any) => {
    if(buckle.metal_color) {
      const parsedMetalColor = {
        id: buckle.id,
        material_id: buckle.material_id,
        name: buckle.name,
        material_type: {
          id : buckle.material_type.id,
          name: buckle.material_type.name
        },
        hex: buckle.metal_color,
        preview: buckle.preview,
      }
      if(!buckleTypes.includes('METAL')) {
        buckleTypes.push('METAL');
      }
      metalColors.push(parsedMetalColor);
    }
    
    if(buckle.plastic_color) {
      const parsedPlasticColor = {
        id: buckle.id,
        material_id: buckle.material_id,
        name: buckle.name,
        material_type: {
          id : buckle.material_type.id,
          name: buckle.material_type.name
        },
        hex: buckle.plastic_color,
        preview: buckle.preview,
      }
      if(!buckleTypes.includes('PLASTIC')) {
        buckleTypes.push('PLASTIC');
      }
      plasticColors.push(parsedPlasticColor);
    }

    if(buckle.breakaway_color) {
      const parsedBreakawayColor = {
        id: buckle.id,
        material_id: buckle.material_id,
        name: buckle.name,
        material_type: {
          id : buckle.material_type.id,
          name: buckle.material_type.name
        },
        hex: buckle.breakaway_color,
        preview: buckle.preview,
      }
      if(!buckleTypes.includes('BREAKAWAY')) {
        buckleTypes.push('BREAKAWAY');
      }
      breakawayColors.push(parsedBreakawayColor);
    }
  })
  buckleManager.setAvailableBuckles(buckleTypes);
  buckleManager.setMetalColors(metalColors);
  buckleManager.setPlasticColors(plasticColors);
  buckleManager.setBreakawayColors(breakawayColors);

  const defaultType = buckleTypes[0];
  if (defaultType) {
    buckleManager.setType(defaultType);
    const defaultColor = buckleManager.currentColors[0]?.name;
    if (defaultColor) {
      buckleManager.setSelectedColor(defaultColor);
    }
  }
}

const parsePatterns = (
  collectionProductsResponse: CollectionProductsApiResponse, 
  textureManager: TextureManager) => {
    const { collectionId, products } = collectionProductsResponse;
    const patterns: PatternType[] = [];

    products.forEach((product) =>{
      const parsedProduct: PatternType = {
        id: parseInt(product.id),
        name: product.name,
        dataX: product.dataX,
        pngImage: product.png_image,
        preview: product.preview,
      }
      patterns.push(parsedProduct);
    })
    textureManager.setSelectedCollection(parseInt(collectionId));
    textureManager.setAvailablePatterns(parseInt(collectionId), patterns);
}