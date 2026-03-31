import { LeashLengthType } from '../../../../state/product/types';

export type FetchFeature = 'FETCH' | 'MEOW';

export const leashLabelMap: Record<LeashLengthType, string> = {
  '3': '3 Foot',
  '4': '4 Foot',
  '5': '5 Foot',
  '6': '6 Foot',
};

export const sizeLabelMap: Record<string, string> = {
  EXTRA_SMALL: 'Extra Small',
  LARGE: 'Large',
  MEDIUM: 'Medium',
  MEDIUM_NARROW: 'Medium Narrow',
  MEDIUM_WIDE: 'Medium Wide',
  SMALL: 'Small',
  XLARGE: 'XLarge',
  XXLARGE: 'XXLarge',
};

export const productSummaryLabelMap: Record<string, string> = {
  BANDANA: 'BANDANA',
  CAT_COLLAR: 'CAT COLLAR',
  DOG_COLLAR: 'DOG COLLAR',
  HARNESS: 'HARNESS',
  LEASH: 'LEASH',
  MARTINGALE: 'MARTINGALE COLLAR',
};

export const parsePrice = (value: string | null | undefined): number => {
  const parsed = Number.parseFloat(String(value ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatPrice = (value: number): string => `${value.toFixed(2)}`;

export const getFetchHeading = (feature: FetchFeature): string =>
  feature === 'MEOW' ? 'Ready to Meow!' : 'Ready to Fetch!';

export const fetchReviewCopy = 'Review your design and add matching items.';

export const shippingCopy = 'Includes standard shipping and handling';
