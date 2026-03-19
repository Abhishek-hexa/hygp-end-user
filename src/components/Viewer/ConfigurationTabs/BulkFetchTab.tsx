import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';

type FetchMeowTabProps = {
  feature: 'FETCH' | 'MEOW';
};

const sizeLabelMap: Record<string, string> = {
  EXTRA_SMALL: 'Extra Small',
  LARGE: 'Large',
  MEDIUM: 'Medium',
  MEDIUM_NARROW: 'Medium Narrow',
  MEDIUM_WIDE: 'Medium Wide',
  SMALL: 'Small',
  XLARGE: 'XLarge',
  XXLARGE: 'XXLarge',
};

const productSummaryLabelMap: Record<string, string> = {
  BANDANA: 'CUSTOM BANDANA',
  CAT_COLLAR: 'CUSTOM COLLAR',
  DOG_COLLAR: 'CUSTOM COLLAR',
  HARNESS: 'CUSTOM HARNESS',
  LEASH: 'CUSTOM LEASH',
  MARTINGALE: 'CUSTOM MARTINGALE COLLAR',
};

const parsePrice = (value: string | null | undefined): number => {
  const parsed = Number.parseFloat(String(value ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatPrice = (value: number): string => `$${value.toFixed(2)}`;

export const BulkFetchTab = observer(({ feature }: FetchMeowTabProps) => {
  const mainContext = useMainContext();
  const productManager = mainContext.designManager.productManager;
  const { sizeManager } = productManager;
  const heading = feature === 'MEOW' ? 'Ready to Meow!' : 'Ready to Fetch!';

  const selectedSize = sizeManager.selectedSize;
  const selectedSizeDescription = selectedSize
    ? sizeManager.availableSizes.get(selectedSize)
    : null;
  const selectedSizePriceNumber = parsePrice(selectedSizeDescription?.price);
  const selectedSizePriceLabel = formatPrice(selectedSizePriceNumber);

  return (
    <div className="flex min-h-[520px] flex-col p-4 text-gray-700">
      <section className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900">{heading}</h3>
        <p className="text-xs text-gray-500">Review your design and add matching items.</p>
      </section>

      <section className="mt-6 rounded-xl border border-primary/20 bg-primary-dark/5 p-5">
        <div className="space-y-2 text-xs font-semibold text-primary-dark">
          <div className="flex items-center justify-between">
            <span>
              {`${productSummaryLabelMap[productManager.productId] ?? 'CUSTOM PRODUCT'} (${sizeLabelMap[selectedSize ?? ''] ?? 'No Size'})`}
            </span>
            <span>{selectedSizePriceLabel}</span>
          </div>
        </div>

        <div className="my-4 border-t-2 border-primary-dark/40" />

        <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
          <span>TOTAL AMOUNT</span>
          <span>{formatPrice(selectedSizePriceNumber)}</span>
        </div>

        <p className="mt-3 text-center text-sm text-[#58AB88]">
          Includes standard shipping and handling
        </p>
      </section>
    </div>
  );
});
