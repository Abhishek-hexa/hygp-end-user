'use client';

import { useState } from 'react';

import { CartModalOpenIcon } from '../../../icons/Icons';
import { CartButton } from '../../Global/CartButton';
import { PriceSummaryDetails } from './PriceSummaryDetails';

interface LineItem {
  label: string;
  value: string;
}

interface MobileCartSectionProps {
  lineItems: LineItem[];
  totalAmount: string;
  shippingCopy: string;
  onAddToCart?: () => void;
}

export const MobileCartSection = ({
  lineItems,
  totalAmount,
  shippingCopy,
  onAddToCart,
}: MobileCartSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 right-0 z-50 px-4 pb-3 transition-all duration-300 ease-in-out ${
          isOpen
            ? 'bottom-20 opacity-100 translate-y-0'
            : 'bottom-20 opacity-0 translate-y-4 pointer-events-none'
        }`}>
        <PriceSummaryDetails
          lineItems={lineItems}
          totalAmount={totalAmount}
          shippingCopy={shippingCopy}
        />
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-white px-4 py-3 border-t border-primary-dark">
        {/* Left: Total Amount + toggle arrow */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex flex-col items-start gap-0.5 focus:outline-none"
          aria-label="Toggle price summary">
          <span className="flex items-center gap-1 text-base font-semibold uppercase text-primary-dark tracking-wide">
            TOTAL AMOUNT
            <CartModalOpenIcon
              className={`text-sm transition-transform duration-300 ${
                isOpen ? 'rotate-0' : 'rotate-180'
              }`}
            />
          </span>
          <span className="text-lg font-semibold text-text-dark-green uppercase">
            ${totalAmount}
          </span>
        </button>

        {/* Right: Add to Cart button */}
        <div>
          <CartButton onClick={onAddToCart} type="button" />
        </div>
      </div>

      {/* Bottom spacer so page content isn't hidden behind the bar */}
      <div className="h-18" />
    </>
  );
};
