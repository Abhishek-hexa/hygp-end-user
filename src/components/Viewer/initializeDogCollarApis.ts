import axios, { all } from 'axios';

import { ProductManager } from '../../state/product/ProductManager';
import { WebbingTextManager } from '../../state/product/managers/WebbingTextManager';
import { EngravingManager } from '../../state/product/managers/EngravingManager';
import { ProductSizeType } from '../../state/product/types';
import { SizeDescription } from '../../state/product/managers/SizeManager';
import { Collection, TextureManager } from '../../state/product/managers/TextureManager';
import { text } from 'node:stream/consumers';

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
      fetchJson<unknown>(
        baseUrl,
        '/product/variants/8969048817879',
        'product variants',
      ),
      fetchJson<unknown>(baseUrl, '/buckle', 'buckles'),
      fetchJson<unknown>(baseUrl, '/engraving-fonts', 'engraving fonts'),
      fetchJson<{ collections?: Array<{ id?: number | string }> }>(
        baseUrl,
        '/shopify-collection/',
        'collections',
      ),
    ]);

    const firstCollectionId = collections?.collections?.[0]?.id;

    if (firstCollectionId !== undefined && firstCollectionId !== null) {
      await fetchJson(
        baseUrl,
        `/shopify-collection/products/${String(firstCollectionId)}`,
        'collection products',
      );
    }
    
    parseFonts(
      engravingFonts, 
      productManager.webbingText, 
      productManager.engravingManager
    );

    parseSizes(variants, productManager);

    parseTextures(collections, productManager.textureManager);

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[dog-collar-init] API initialization failed', error);
  }
};

const parseFonts = (engravingFontsResponse: any, WebbingTextManager: WebbingTextManager, EngravingManager: EngravingManager) => {
  const fontOptions = engravingFontsResponse.data;

  const webbingFonts: Map<string, string> = new Map();
  const engravingFonts: Map<string, string> = new Map();

  fontOptions.map((font: any) =>{
    if(font.use_case.includes("webbing")){
      webbingFonts.set(font.name, font.font_path);
    } else if(font.use_case.includes("buckle")){
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

const parseTextures = (collectionsResponse: any, textureManager: TextureManager) => {
  console.log('collectionsResponse', collectionsResponse);
  const allCollections = collectionsResponse.custom_collections;

  const collections: Collection[] = [];
  allCollections.map((collection: any) => {
    const parsedCollection: Collection = {
      id: parseInt(collection.id),
      image: collection.image,
      title: collection.title,
    }
    collections.push(parsedCollection);
  });
  textureManager.setAvailableCollections(collections);
}