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

  const totalAmountNumber = parsePrice(productStore.totalPrice);

  return (
    <div className="flex min-h-[520px] flex-col p-4 text-gray-700">
      <section className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900">{heading}</h3>
        <p className="text-xs text-gray-500">{fetchReviewCopy}</p>
      </section>

      <section className="mt-6 rounded-xl border border-primary/20 bg-primary-dark/5 p-5">

        <section className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-primary-dark">
            Manage Items
          </h4>
          {storeProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No items in bundle yet.</p>
          ) : (
            <div className="space-y-2">
              {storeProducts.map((product) => {
                const itemPrice = parsePrice(product.price);
                const itemTotal = itemPrice * product.qty;
                const itemSize = product.size.size;
                return (
                  <div
                    key={product.key}
                    className="rounded-lg border border-primary/20 bg-white px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold uppercase text-primary-dark">
                          {productSummaryLabelMap[product.productId] ?? 'PRODUCT'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {sizeLabelMap[itemSize ?? ''] ?? 'No Size'}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">
                        {formatPrice(itemTotal)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            productStore.decreaseQuantity(product.key)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 text-sm font-semibold text-primary-dark">
                          -
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold text-gray-700">
                          {product.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            productStore.increaseQuantity(product.key)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 text-sm font-semibold text-primary-dark">
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => productStore.removeProduct(product.key)}
                        className="text-xs font-semibold uppercase text-red-500">
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

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
