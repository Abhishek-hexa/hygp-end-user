import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import {
  fetchReviewCopy,
  FetchFeature,
  formatPrice,
  getFetchHeading,
  parsePrice,
  productSummaryLabelMap,
  shippingCopy,
  sizeLabelMap,
} from './shared/fetchSummary';

type FetchMeowTabProps = {
  feature: FetchFeature;
};

export const BulkFetchTab = observer(({ feature }: FetchMeowTabProps) => {
  const mainContext = useMainContext();
  const productManager = mainContext.designManager.productManager;
  const { sizeManager } = productManager;
  const heading = getFetchHeading(feature);

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
        <p className="text-xs text-gray-500">{fetchReviewCopy}</p>
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

        <p className="mt-3 text-center text-sm text-[#58AB88]">{shippingCopy}</p>
      </section>
    </div>
  );
});
