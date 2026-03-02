import { ProductId } from '../../state/product/types';
import { apiClient } from '../httpClient';
import { apiRoutes, resolveProductVariantsRoute } from '../routes';
import {
  ApiBuckleOption,
  ApiCollection,
  ApiFontOption,
  ApiPattern,
  ApiProductVariant,
  ProductVariantsResponse,
} from '../types';

type RawObject = Record<string, unknown>;

const readArray = (payload: unknown, keys: string[]): RawObject[] => {
  if (Array.isArray(payload)) {
    return payload as RawObject[];
  }
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const obj = payload as RawObject;

  for (const key of keys) {
    if (Array.isArray(obj[key])) {
      return obj[key] as RawObject[];
    }
  }

  for (const value of Object.values(obj)) {
    if (Array.isArray(value)) {
      return value as RawObject[];
    }
  }

  return [];
};

const text = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const textOrNumber = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return fallback;
};

const idText = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value);
    }
  }
  return '';
};

const numberValue = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeSize = (value: unknown): ApiProductVariant['size'] => {
  const input = textOrNumber(value).trim().toUpperCase().replace(/\s+/g, ' ');

  const sizeMap: Record<string, ApiProductVariant['size']> = {
    'EXTRA SMALL': 'EXTRA SMALL',
    LARGE: 'LARGE',
    MEDIUM: 'MEDIUM',
    'MEDIUM NARROW': 'MEDIUM NARROW',
    'MEDIUM WIDE': 'MEDIUM WIDE',
    SMALL: 'SMALL',
    'X LARGE': 'XLARGE',
    'X SMALL': 'EXTRA SMALL',
    XLARGE: 'XLARGE',
    XSMALL: 'EXTRA SMALL',
    'XX LARGE': 'XXLARGE',
    XXLARGE: 'XXLARGE',
  };

  return sizeMap[input] ?? 'MEDIUM';
};

const normalizeBuckleType = (value: unknown): ApiBuckleOption['type'] => {
  const type = textOrNumber(value).toUpperCase();
  if (type === 'METAL' || type === 'PLASTIC' || type === 'BREAKAWAY') {
    return type;
  }
  return 'PLASTIC';
};

const resolveVariantPrice = (
  productId: ProductId,
  variant: RawObject,
): number => {
  const values =
    productId === 'catCollar'
      ? [
          variant.withoutBellPrice,
          variant.withBellPrice,
          variant.price,
          variant.finalPrice,
          variant.salePrice,
          variant.sellingPrice,
        ]
      : [
          variant.price,
          variant.finalPrice,
          variant.salePrice,
          variant.sellingPrice,
        ];

  for (const value of values) {
    const parsed = numberValue(value);
    if (parsed !== null) {
      return parsed;
    }
  }
  return 0;
};

const mapBuckleOption = (option: RawObject, index: number): ApiBuckleOption => {
  const colors = Array.isArray(option.colors)
    ? option.colors
        .filter(
          (color): color is string | number =>
            typeof color === 'string' || typeof color === 'number',
        )
        .map((color) => String(color))
    : [option.preview, option.plastic_color, option.metal_color]
        .filter(
          (color): color is string => typeof color === 'string' && !!color,
        )
        .filter(
          (color, currentIndex, all) => all.indexOf(color) === currentIndex,
        );

  return {
    colors,
    id: idText(option.id, option._id, `buckle-${index}`),
    metalColor: text(option.metal_color) || undefined,
    name: text(option.name) || undefined,
    plasticColor: text(option.plastic_color) || undefined,
    previewColor: text(option.preview) || undefined,
    type: normalizeBuckleType(option.type),
  };
};

const mapCollection = (collection: RawObject, index: number): ApiCollection => {
  const name =
    text(collection.name) ||
    text(collection.title) ||
    `Collection ${index + 1}`;
  return {
    id: idText(collection.id, collection._id, `collection-${index}`),
    name: name.trim(),
  };
};

const mapFont = (font: RawObject, index: number): ApiFontOption => ({
  family:
    text(font.family) || text(font.name) || text(font.fontFamily) || 'Default',
  fontUrl: text(font.font_path) || text(font.fontUrl) || '',
  id: idText(font.id, font._id, `font-${index}`),
  previewUrl:
    text(font.preview) || text(font.previewUrl) || text(font.preview_url) || '',
  useCases: Array.isArray(font.use_case)
    ? font.use_case.map((entry) => String(entry))
    : undefined,
});

const mapPattern = (pattern: RawObject, index: number): ApiPattern => ({
  dataX: text(pattern.dataX) || text(pattern.data_x) || '',
  id: idText(pattern.id, pattern._id, `pattern-${index}`),
  image:
    text(pattern.preview) ||
    text(pattern.image) ||
    text(pattern.thumbnail) ||
    '',
  name: text(pattern.name) || text(pattern.title) || `Pattern ${index + 1}`,
  previewUrl: text(pattern.preview) || text(pattern.image) || '',
  textureUrl:
    text(pattern.png_image) ||
    text(pattern.textureUrl) ||
    text(pattern.texture_url) ||
    text(pattern.image) ||
    '',
});

const mapVariant = (
  productId: ProductId,
  variant: RawObject,
  index: number,
): ApiProductVariant => ({
  id: idText(variant.id, variant.variantId, `variant-${index}`),
  modelUrl: text(variant.model) || text(variant.modelUrl) || '',
  name: text(variant.name) || text(variant.size) || `Variant ${index + 1}`,
  plasticModelUrl:
    text(variant.plasticModel) || text(variant.plastic_model) || '',
  prefix: text(variant.prefix) || '',
  price: resolveVariantPrice(productId, variant),
  size: normalizeSize(variant.size),
  sizeImageUrl:
    text(variant.sizeImage) ||
    text(variant.size_image) ||
    text(variant.image) ||
    '',
});

const buckleRouteByProductId: Record<ProductId, string | null> = {
  bandana: null,
  catCollar: apiRoutes.catBuckle,
  dogCollar: apiRoutes.buckle,
  harness: apiRoutes.harnessBuckle,
  leash: apiRoutes.buckle,
  martingale: null,
};

export const productService = {
  async getBuckleOptions(productId: ProductId): Promise<ApiBuckleOption[]> {
    const route = buckleRouteByProductId[productId];
    if (!route) {
      return [];
    }

    const { data } = await apiClient.get<unknown>(route);
    return readArray(data, ['buckleOptions', 'buckles', 'data', 'results']).map(
      mapBuckleOption,
    );
  },

  async getCollections(): Promise<ApiCollection[]> {
    const { data } = await apiClient.get<unknown>(apiRoutes.collections);
    return readArray(data, [
      'custom_collections',
      'collections',
      'data',
      'results',
    ]).map(mapCollection);
  },

  async getEngravingFonts(isAdmin = false): Promise<ApiFontOption[]> {
    const { data } = await apiClient.get<unknown>(
      apiRoutes.engravingFonts(isAdmin),
    );
    return readArray(data, ['fonts', 'data', 'results']).map(mapFont);
  },

  async getPatterns(webbingId: string): Promise<ApiPattern[]> {
    if (!webbingId) {
      return [];
    }

    const { data } = await apiClient.get<unknown>(
      apiRoutes.collectionProducts(webbingId),
    );
    return readArray(data, ['patterns', 'data', 'results', 'products']).map(
      mapPattern,
    );
  },

  async getProductVariants(
    productId: ProductId,
  ): Promise<ProductVariantsResponse> {
    const route = resolveProductVariantsRoute(productId);
    const { data } = await apiClient.get<unknown>(route);

    return {
      variants: readArray(data, ['variants', 'data', 'results', 'items']).map(
        (variant, index) => mapVariant(productId, variant, index),
      ),
    };
  },
};
