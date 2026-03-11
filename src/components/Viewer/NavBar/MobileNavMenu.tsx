import { useEffect, useRef, useState } from 'react';

import { ProductType } from '../../../state/product/types';
import { CartIcon, ChevronDownIcon } from '../../icons/Icons';

type ShopItem = {
  label: string;
  productType: ProductType;
};

type MobileNavMenuProps = {
  shopItems: ShopItem[];
  currentProductType: ProductType;
  onShopSelect: (productType: ProductType) => void;
};


export const MobileNavMenu = ({
  shopItems,
  currentProductType,
  onShopSelect,
}: MobileNavMenuProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopsOpen, setIsMobileShopsOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
        setIsMobileShopsOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMobileShopSelect = (productType: ProductType) => {
    if (currentProductType !== productType) {
      onShopSelect(productType);
    }
    setIsMobileShopsOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <div ref={mobileMenuRef} className="relative lg:hidden">
      <button
        type="button"
        className="font-ranchers inline-flex items-center gap-3 rounded-full bg-[#fbf2e8] px-5 py-2 text-xl uppercase leading-none tracking-wider text-primaryOrange"
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
        onClick={() => {
          setIsMobileMenuOpen((prev) => !prev);
          if (isMobileMenuOpen) {
            setIsMobileShopsOpen(false);
          }
        }}
      >
        <span>Menu</span>
        <span className="relative block h-4 w-5">
          <span
            className={`absolute left-0 top-0 h-0.5 w-5 bg-primaryOrange transition-transform duration-200 ${
              isMobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`absolute left-0 top-[7px] h-0.5 w-5 bg-primaryOrange transition-opacity duration-200 ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0 top-[14px] h-0.5 w-5 bg-primaryOrange transition-transform duration-200 ${
              isMobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </span>
      </button>
      {isMobileMenuOpen ? (
        <nav className="font-ranchers absolute right-0 top-full mt-3 flex w-[min(88vw,320px)] flex-col gap-4 rounded-2xl bg-primary p-5 text-xl uppercase tracking-wide text-amber-50 shadow-xl">
          <button type="button" className="text-left uppercase">
            Size Guide
          </button>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="flex items-center justify-between uppercase"
              onClick={() => setIsMobileShopsOpen((prev) => !prev)}
            >
              Shops
              <ChevronDownIcon />
            </button>
            {isMobileShopsOpen ? (
              <div className="flex flex-col gap-3 pl-3 text-lg text-[#fbf2e8]">
                {shopItems.map((shopItem) => (
                  <button
                    key={shopItem.productType}
                    type="button"
                    className="text-left transition-opacity hover:opacity-80"
                    onClick={() => handleMobileShopSelect(shopItem.productType)}
                  >
                    {shopItem.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <button type="button" className="text-left uppercase">
            Sell Your Own
          </button>
          <button type="button" className="text-left uppercase">
            More
          </button>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-sm font-semibold text-gray-700"
          >
            <CartIcon />
          </button>
        </nav>
      ) : null}
    </div>
  );
};
