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

const toArray = <T>(value: unknown, preferredKeys: string[] = []): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  const obj = value as Record<string, unknown>;

  for (const key of preferredKeys) {
    const candidate = obj[key];
    if (Array.isArray(candidate)) {
      return candidate as T[];
    }
  }

  for (const candidate of Object.values(obj)) {
    if (Array.isArray(candidate)) {
      return candidate as T[];
    }
  }

  return [];
};

const normalizeSize = (size: unknown): ApiProductVariant['size'] => {
  const normalized = String(size ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ');

  const sizeMap: Record<string, ApiProductVariant['size']> = {
    'EXTRA SMALL': 'EXTRA SMALL',
    XSMALL: 'EXTRA SMALL',
    'X SMALL': 'EXTRA SMALL',
    SMALL: 'SMALL',
    MEDIUM: 'MEDIUM',
    'MEDIUM WIDE': 'MEDIUM WIDE',
    'MEDIUM NARROW': 'MEDIUM NARROW',
    LARGE: 'LARGE',
    XLARGE: 'XLARGE',
    'X LARGE': 'XLARGE',
    XXLARGE: 'XXLARGE',
    'XX LARGE': 'XXLARGE',
  };

  return sizeMap[normalized] ?? 'MEDIUM';
};

const normalizeBuckleType = (type: unknown): ApiBuckleOption['type'] => {
  const normalized = String(type ?? '').toUpperCase();

  if (
    normalized === 'METAL' ||
    normalized === 'PLASTIC' ||
    normalized === 'BREAKAWAY'
  ) {
    return normalized;
  }

  return 'PLASTIC';
};

const extractBuckleColors = (option: Record<string, unknown>): string[] => {
  if (Array.isArray(option.colors)) {
    return option.colors.map((color) => String(color));
  }

  const derived = [
    option.preview,
    option.plastic_color,
    option.metal_color,
  ].filter((color): color is string => typeof color === 'string' && !!color);

  return Array.from(new Set(derived));
};

const normalizeCollectionName = (collection: Record<string, unknown>, index: number) => {
  const rawName = collection.name ?? collection.title ?? '';
  const name = String(rawName).trim();
  return name || `Collection ${index + 1}`;
};

const parseNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const resolveVariantPrice = (
  productId: ProductId,
  variant: Record<string, unknown>,
): number => {
  const commonCandidates = [
    variant.price,
    variant.finalPrice,
    variant.salePrice,
    variant.sellingPrice,
  ];

  if (productId === 'catCollar') {
    commonCandidates.unshift(variant.withoutBellPrice, variant.withBellPrice);
  }

  for (const candidate of commonCandidates) {
    const value = parseNumber(candidate);
    if (value !== null) {
      return value;
    }
  }

  return 0;
};

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
    const options = toArray<Record<string, unknown>>(data, [
      'buckleOptions',
      'buckles',
      'data',
      'results',
    ]);

    return options.map((option, index) => ({
      colors: extractBuckleColors(option),
      id: String(option.id ?? option._id ?? `buckle-${index}`),
      metalColor:
        typeof option.metal_color === 'string' ? option.metal_color : undefined,
      name: typeof option.name === 'string' ? option.name : undefined,
      plasticColor:
        typeof option.plastic_color === 'string'
          ? option.plastic_color
          : undefined,
      previewColor:
        typeof option.preview === 'string' ? option.preview : undefined,
      type: normalizeBuckleType(option.type),
    }));
  },

  async getCollections(): Promise<ApiCollection[]> {
    const { data } = await apiClient.get<unknown>(apiRoutes.collections);
    const collections = toArray<Record<string, unknown>>(data, [
      'custom_collections',
      'collections',
      'data',
      'results',
    ]);

    return collections.map((collection, index) => ({
      id: String(collection.id ?? collection._id ?? `collection-${index}`),
      name: normalizeCollectionName(collection, index),
    }));
  },

  async getEngravingFonts(isAdmin = false): Promise<ApiFontOption[]> {
    const { data } = await apiClient.get<unknown>(apiRoutes.engravingFonts(isAdmin));
    const fonts = toArray<Record<string, unknown>>(data, [
      'fonts',
      'data',
      'results',
    ]);

    return fonts.map((font, index) => ({
      family: String(font.family ?? font.name ?? font.fontFamily ?? 'Default'),
      fontUrl: String(font.font_path ?? font.fontUrl ?? ''),
      id: String(font.id ?? font._id ?? `font-${index}`),
      previewUrl: String(font.preview ?? font.previewUrl ?? font.preview_url ?? ''),
      useCases: Array.isArray(font.use_case)
        ? font.use_case.map((entry) => String(entry))
        : undefined,
    }));
  },

  async getPatterns(webbingId: string): Promise<ApiPattern[]> {
    if (!webbingId) {
      return [];
    }

    const { data } = await apiClient.get<unknown>(
      apiRoutes.collectionProducts(webbingId),
    );
    const patterns = toArray<Record<string, unknown>>(data, [
      'patterns',
      'data',
      'results',
      'products',
    ]);

    return patterns.map((pattern, index) => ({
      dataX: String(pattern.dataX ?? pattern.data_x ?? ''),
      id: String(pattern.id ?? pattern._id ?? `pattern-${index}`),
      image: String(pattern.preview ?? pattern.image ?? pattern.thumbnail ?? ''),
      name: String(pattern.name ?? pattern.title ?? `Pattern ${index + 1}`),
      previewUrl: String(pattern.preview ?? pattern.image ?? ''),
      textureUrl: String(
        pattern.png_image ??
          pattern.textureUrl ??
          pattern.texture_url ??
          pattern.image ??
          '',
      ),
    }));
  },

  async getProductVariants(
    productId: ProductId,
  ): Promise<ProductVariantsResponse> {
    const route = resolveProductVariantsRoute(productId);
    const { data } = await apiClient.get<unknown>(route);
    const variants = toArray<Record<string, unknown>>(data, [
      'variants',
      'data',
      'results',
      'items',
    ]);

    return {
      variants: variants.map((variant, index) => ({
        id: String(variant.id ?? variant.variantId ?? `variant-${index}`),
        modelUrl: String(variant.model ?? variant.modelUrl ?? ''),
        name: String(variant.name ?? variant.size ?? `Variant ${index + 1}`),
        plasticModelUrl: String(
          variant.plasticModel ?? variant.plastic_model ?? '',
        ),
        prefix: String(variant.prefix ?? ''),
        price: resolveVariantPrice(productId, variant),
        sizeImageUrl: String(
          variant.sizeImage ?? variant.size_image ?? variant.image ?? '',
        ),
        size: normalizeSize(variant.size),
      })),
    };
  },
};
