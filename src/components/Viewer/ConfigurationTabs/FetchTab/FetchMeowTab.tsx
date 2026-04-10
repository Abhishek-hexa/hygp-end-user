import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../../hooks/useMainContext';
import { LeashLengthType, ProductType } from '../../../../state/product/types';
import SectionHeader from '../../Global/SectionHeader';
import { SizeOptionButton } from '../../Global/SizeOptionButton';
import {
  FetchFeature,
  formatPrice,
  getFetchHeading,
  leashLabelMap,
  parsePrice,
  productSummaryLabelMap,
  shippingCopy,
  sizeLabelMap,
} from '../shared/fetchSummary';
import { MobileCartSection } from './MobileCartSection';
import { PriceSummaryDetails } from './PriceSummaryDetails';

type FetchMeowTabProps = {
  feature: FetchFeature;
};

export const FetchMeowTab = observer(({ feature }: FetchMeowTabProps) => {
  const mainContext = useMainContext();
  const productManager = mainContext.designManager.productManager;
  const { sizeManager } = productManager;
  const heading = getFetchHeading(feature);
  const isDogCollar = productManager.productId === ProductType.DOG_COLLAR;

  const selectedSize = sizeManager.selectedSizeData;
  const selectedSizePriceNumber = parsePrice(selectedSize?.price);
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
      price: '0.00',
      selected: sizeManager.selectedLength === null,
    },
    ...leashLengths.map((length) => ({
      id: length,
      name: leashLabelMap[length] ?? `${length} Foot`,
      price: formatPrice(parsePrice(sizeManager.lengthPrices.get(length))),
      selected: sizeManager.selectedLength === length,
    })),
  ];

  const lineItems = [
    {
      label: `${productSummaryLabelMap[productManager.productId] ?? 'CUSTOM PRODUCT'} (${sizeLabelMap[selectedSize?.size ?? ''] ?? 'No Size'})`,
      value: selectedSizePriceLabel,
    },
    ...(isDogCollar
      ? [
          {
            label: selectedLeashLabel,
            value: selectedLeashLength
              ? formatPrice(selectedLeashPriceNumber)
              : '$0.00',
          },
        ]
      : []),
  ];

  return (
    <div className="">
      <div className="p-4 lg:p-6">
        <SectionHeader title={heading} />
        {isDogCollar && (
          <div className="mt-4 md:mt-7">
            <h4 className="mb-3 text-sm md:text-base font-semibold text-innerTitle leading-5.5">
              Matching Leash?
            </h4>
            <div
              className="feature-tabs-scroll -mx-1 flex gap-3 overflow-x-auto px-1 whitespace-nowrap md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {leashOptions.map((option) => (
                <SizeOptionButton
                  key={option.id}
                  id={option.id}
                  label={option.name}
                  price={option.price}
                  isSelected={option.selected}
                  onClick={() =>
                    sizeManager.setLength(
                      option.id === 'none'
                        ? null
                        : (option.id as LeashLengthType),
                    )
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 lg:p-6 border-t border-divider hidden md:block">
        <PriceSummaryDetails
          lineItems={lineItems}
          totalAmount={formatPrice(totalPriceNumber)}
          shippingCopy={shippingCopy}
        />
      </div>
      <div className="pb-2 block md:hidden">
        <MobileCartSection
          lineItems={lineItems}
          totalAmount={formatPrice(totalPriceNumber)}
          shippingCopy={shippingCopy}
        />
      </div>
    </div>
  );
});
