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
  const { productStore } = mainContext.designManager;
  const heading = getFetchHeading(feature);
  const storeProducts = productStore.products ?? [];
  const activeStoreProduct = storeProducts[storeProducts.length - 1] ?? null;

  const selectedSize = activeStoreProduct?.size.size ?? null;
  const selectedSizePriceNumber = parsePrice(activeStoreProduct?.price);
  const selectedSizePriceLabel = formatPrice(selectedSizePriceNumber);
  const totalAmountNumber = parsePrice(productStore.totalPrice);

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
              {`${productSummaryLabelMap[activeStoreProduct?.productId ?? ''] ?? 'CUSTOM PRODUCT'} (${sizeLabelMap[selectedSize ?? ''] ?? 'No Size'})`}
            </span>
            <span>{selectedSizePriceLabel}</span>
          </div>
        </div>

        <div className="my-4 border-t-2 border-primary-dark/40" />

        <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
          <span>TOTAL AMOUNT</span>
          <span>{formatPrice(totalAmountNumber)}</span>
        </div>

        <p className="mt-3 text-center text-sm text-[#58AB88]">{shippingCopy}</p>
      </section>
    </div>
  );
});
