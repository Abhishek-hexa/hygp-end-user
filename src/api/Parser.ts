import {
  Collection,
  ColorDescription,
  FontDescription,
  LeashLengthType,
  MiscPatternID,
  PatternType,
  ProductSizeType,
  SizeDescription,
} from '../state/product/types';
import {
  BuckleApiItem,
  BucklesApiResponse,
  CollectionProductsApiResponse,
  EngravingFontsApiResponse,
  LeashVariantsApiResponse,
  ProductVariantApiItem,
  ProductVariantsApiResponse,
  ShopifyCollectionApiItem,
  ShopifyCollectionsApiResponse,
} from './types/api.types';

export class Parser {
  public static parseFonts = (
    engravingFontsResponse: EngravingFontsApiResponse,
  ) => {
    const fontOptions = engravingFontsResponse.data;

    const webbingFonts: Map<number, FontDescription> = new Map();
    const engravingFonts: Map<number, FontDescription> = new Map();
    const fontPreviewImages = new Set<string>();

    fontOptions.forEach((font) => {
      if (font.preview) {
        fontPreviewImages.add(font.preview);
      }

      if (font.use_case.includes('webbing')) {
        webbingFonts.set(font.id, {
          font_path: font.font_path,
          id: font.id,
          name: font.name,
          preview: font.preview,
        });
      }
      if (font.use_case.includes('buckle')) {
        engravingFonts.set(font.id, {
          font_path: font.font_path,
          id: font.id,
          name: font.name,
          preview: font.preview,
        });
      }
    });

    return {
      engravingFonts,
      fontPreviewImages: Array.from(fontPreviewImages),
      webbingFonts,
    };
  };

  public static parseSizes = (sizeOptions: ProductVariantsApiResponse) => {
    const sizes = sizeOptions.variants
      ? sizeOptions.variants
      : sizeOptions.data;
    const sizeMap: Map<ProductSizeType, SizeDescription> = new Map();

    sizes.forEach((size: ProductVariantApiItem) => {
      const parsedSize = this.recordValue(size);
      if (!parsedSize) {
        return;
      }

      const sizeDescription: SizeDescription = {
        id: typeof size.id === 'string' ? parseInt(size.id) : size.id,
        model: size.model,
        plasticModel: size.plasticModel,
        prefix: size.prefix,

        price: size.price ? size.price : size.withoutBellPrice,
        // Keep one canonical enum value across app state/UI/render logic.
        size: parsedSize,
        sizeImage: size.sizeImage ? size.sizeImage : '',
      };

      sizeMap.set(parsedSize, sizeDescription);
    });

    return { sizeMap };
  };

  public static recordValue = (
    size: ProductVariantApiItem,
  ): ProductSizeType | null => {
    const normalized = String(size?.size)
      .toUpperCase()
      .replace(/\s+/g, '')
      .replace(/-/g, '');
    const normalizedPrefix = String(size?.prefix ?? '')
      .toUpperCase()
      .replace(/\s+/g, '')
      .replace(/-/g, '');

    const sizeLookup: Record<string, ProductSizeType> = {
      EXTRALARGE: 'XLARGE',
      EXTRASMALL: 'EXTRA_SMALL',
      LARGE: 'LARGE',
      LG: 'LARGE',
      MD: 'MEDIUM',
      MEDIUM: 'MEDIUM',
      MEDIUMNARROW: 'MEDIUM_NARROW',
      MEDIUMWIDE: 'MEDIUM_WIDE',
      MN: 'MEDIUM_NARROW',
      MW: 'MEDIUM_WIDE',
      SM: 'SMALL',
      SMALL: 'SMALL',
      XL: 'XLARGE',
      XLARGE: 'XLARGE',
      XS: 'EXTRA_SMALL',
      XXL: 'XXLARGE',
      XXLARGE: 'XXLARGE',
    };

    return sizeLookup[normalized] ?? sizeLookup[normalizedPrefix] ?? null;
  };

  public static parseCollections = (
    collectionsResponse: ShopifyCollectionsApiResponse,
  ) => {
    const allCollections = collectionsResponse.custom_collections;

    const filteredCollections = allCollections.filter((collection) => {
      return collection.id !== MiscPatternID.MISC;
    });

    const collections: Collection[] = [];

    filteredCollections.forEach((collection: ShopifyCollectionApiItem) => {
      const parsedCollection: Collection = {
        id: parseInt(collection.id),
        image: collection.image,
        title: collection.title,
      };
      collections.push(parsedCollection);
    });

    return { collections };
  };

  public static parseBuckles = (bucklesResponse: BucklesApiResponse) => {
    const buckles = bucklesResponse.data;
    const metalColors: ColorDescription[] = [];
    const plasticColors: ColorDescription[] = [];
    const breakawayColors: ColorDescription[] = [];

    buckles.forEach((buckle: BuckleApiItem) => {
      if (buckle.metal_color) {
        const parsedMetalColor = {
          hex: buckle.metal_color,
          id: buckle.id,
          materialId: buckle.material_id,
          materialType: buckle.material_type
            ? {
                id: buckle.material_type.id,
                name: buckle.material_type.name,
              }
            : { id: 0, name: 'METAL' },
          name: buckle.name,
          preview: buckle.preview,
        };
        metalColors.push(parsedMetalColor);
      }

      if (buckle.plastic_color) {
        const parsedPlasticColor = {
          hex: buckle.plastic_color,
          id: buckle.id,
          materialId: buckle.material_id,
          materialType: buckle.material_type
            ? {
                id: buckle.material_type.id,
                name: buckle.material_type.name,
              }
            : { id: 0, name: 'PLASTIC' },
          name: buckle.name,
          preview: buckle.preview,
        };
        plasticColors.push(parsedPlasticColor);
      }

      if (buckle.breakaway_color) {
        const parsedBreakawayColor = {
          hex: buckle.breakaway_color,
          id: buckle.id,
          materialId: buckle.material_id,
          materialType: buckle.material_type
            ? {
                id: buckle.material_type.id,
                name: buckle.material_type.name,
              }
            : { id: 0, name: 'BREAKAWAY' },
          name: buckle.name,
          preview: buckle.preview,
        };
        breakawayColors.push(parsedBreakawayColor);
      }
    });

    return { breakawayColors, metalColors, plasticColors };
  };

  public static parsePatterns = (
    collectionProductsResponse: CollectionProductsApiResponse,
    preferredPatternId: number | null = null,
  ) => {
    const { collectionId, products } = collectionProductsResponse;
    const patterns: PatternType[] = [];

    products.forEach((product) => {
      const parsedProduct: PatternType = {
        collectionId: parseInt(product.collection_Id),
        dataX: product.dataX,
        id: parseInt(product.id),
        name: product.name,
        pngImage: product.png_image,
        preview: product.preview,
      };
      patterns.push(parsedProduct);
    });
    const parsedCollectionId = parseInt(collectionId);
    const matchedPatternId =
      preferredPatternId !== null &&
      patterns.some((pattern) => pattern.id === preferredPatternId)
        ? preferredPatternId
        : (patterns[0]?.id ?? null);

    return { matchedPatternId, parsedCollectionId, patterns };
  };

  public static parseLeashVariants = (
    leashVariantsResponse: LeashVariantsApiResponse,
  ) => {
    const availableLengths: LeashLengthType[] = [];
    const seen = new Set<LeashLengthType>();
    const lengthPrices: Map<LeashLengthType, string> = new Map();

    leashVariantsResponse.data.forEach((variant) => {
      variant.length?.forEach((lengthLabel) => {
        const parsedLength = this.parseLeashLengthLabel(lengthLabel);
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
    const orderedLengthPrices = new Map<LeashLengthType, string>();
    orderedLengths.forEach((length) => {
      const price = lengthPrices.get(length);
      if (price) {
        orderedLengthPrices.set(length, price);
      }
    });

    return { orderedLengthPrices, orderedLengths };
  };

  public static parseLeashLengthLabel = (
    lengthLabel: string,
  ): LeashLengthType | null => {
    const parsed = String(lengthLabel).match(/[3-6]/)?.[0];
    if (parsed === '3' || parsed === '4' || parsed === '5' || parsed === '6') {
      return parsed;
    }
    return null;
  };
}
