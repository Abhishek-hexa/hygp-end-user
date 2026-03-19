import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../hooks/useMainContext';
import { LeashLengthType } from '../../../state/product/types';
import { SelectedItemIcon } from '../../icons/Icons';
import {
  fetchReviewCopy,
  FetchFeature,
  formatPrice,
  getFetchHeading,
  leashLabelMap,
  parsePrice,
  productSummaryLabelMap,
  shippingCopy,
  sizeLabelMap,
} from './shared/fetchSummary';

type FetchMeowTabProps = {
  feature: FetchFeature;
};

export const FetchMeowTab = observer(({ feature }: FetchMeowTabProps) => {
  const mainContext = useMainContext();
  const productManager = mainContext.designManager.productManager;
  const { sizeManager } = productManager;
  const heading = getFetchHeading(feature);
  const isDogCollar = productManager.productId === 'DOG_COLLAR';

  const selectedSize = sizeManager.selectedSize;
  const selectedSizeDescription = selectedSize
    ? sizeManager.availableSizes.get(selectedSize)
    : null;
  const selectedSizePriceNumber = parsePrice(selectedSizeDescription?.price);
  const selectedSizePriceLabel = formatPrice(selectedSizePriceNumber);

  const leashLengths = sizeManager.availableLengths;
  const selectedLeashLength = sizeManager.selectedLength;
  const selectedLeashPriceNumber = selectedLeashLength
    ? parsePrice(sizeManager.lengthPrices.get(selectedLeashLength))
    : 0;
  const totalPriceNumber = parsePrice(sizeManager.totalPrice);

  const selectedLeashLabel = selectedLeashLength
    ? `${leashLabelMap[selectedLeashLength] ?? `${selectedLeashLength} Foot`} LEASH`
    : 'NO LEASH';

  const leashOptions = [
    {
      id: 'none',
      name: 'No Leash',
      price: '$0.00',
      selected: sizeManager.selectedLength === null,
    },
    ...leashLengths.map((length) => ({
      id: length,
      name: leashLabelMap[length] ?? `${length} Foot`,
      price: formatPrice(parsePrice(sizeManager.lengthPrices.get(length))),
      selected: sizeManager.selectedLength === length,
    })),
  ];

  return (
    <div className="flex min-h-[520px] flex-col p-4 text-gray-700">
      <section className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900">{heading}</h3>
        <p className="text-xs text-gray-500">{fetchReviewCopy}</p>
      </section>

      {isDogCollar && (
        <section className="mt-6 space-y-3">
          <h4 className="text-sm font-semibold text-gray-600">Matching Leash?</h4>
          <div
            className="feature-tabs-scroll -mx-1 flex gap-3 overflow-x-auto px-1 whitespace-nowrap md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {leashOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  sizeManager.setLength(option.id === 'none' ? null : (option.id as LeashLengthType))
                }
                className={`relative min-w-[130px] shrink-0 rounded-md border px-4 py-3 text-left transition-colors md:min-w-0 ${
                  option.selected
                    ? 'border-primary-dark bg-primary/5'
                    : 'border-gray-200 bg-white hover:border-primary/40'
                }`}>
                <div className="text-xs font-semibold text-gray-900">{option.name}</div>
                <div className="text-xs text-gray-600">{option.price}</div>
                {option.selected ? (
                  <SelectedItemIcon className="absolute right-1 top-1" />
                ) : null}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 rounded-xl border border-primary/20 bg-primary-dark/5 p-5">
        <div className="space-y-2 text-xs font-semibold text-primary-dark">
          <div className="flex items-center justify-between">
            <span>
              {`${productSummaryLabelMap[productManager.productId] ?? 'CUSTOM PRODUCT'} (${sizeLabelMap[selectedSize ?? ''] ?? 'No Size'})`}
            </span>
            <span>{selectedSizePriceLabel}</span>
          </div>
          {isDogCollar && (
            <div className="flex items-center justify-between">
              <span>{selectedLeashLabel}</span>
              <span>{selectedLeashLength ? formatPrice(selectedLeashPriceNumber) : '$0.00'}</span>
            </div>
          )}
        </div>

        <div className="my-4 border-t-2 border-primary-dark/40" />

        <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
          <span>TOTAL AMOUNT</span>
          <span>{formatPrice(totalPriceNumber)}</span>
        </div>

        <p className="mt-3 text-center text-sm text-[#58AB88]">{shippingCopy}</p>
      </section>
    </div>
  );
});
