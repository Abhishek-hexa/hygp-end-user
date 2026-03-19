import { useEffect, useRef, useState } from 'react';

import { useMainContext } from '../../../hooks/useMainContext';
import { ProductType } from '../../../state/product/types';
import { CartIcon, ChevronDownIcon } from '../../icons/Icons';

const moreItems = ['Bulk Order', 'Contact US', 'FAQ'] as const;
type MoreItem = (typeof moreItems)[number];

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
  const mainContext = useMainContext();
  const uiManager = mainContext.uiManager;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopsOpen, setIsMobileShopsOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
        setIsMobileShopsOpen(false);
        setIsMobileMoreOpen(false);
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
    setIsMobileMoreOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleMobileMoreSelect = (item: MoreItem) => {
    if (item === 'Bulk Order') {
      uiManager.setBulkMode(!uiManager.isBulkMode);
    } else {
      uiManager.setBulkMode(false);
    }
    setIsMobileMoreOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <div ref={mobileMenuRef} className="relative lg:hidden">
      <button
        type="button"
        className="font-ranchers inline-flex items-center gap-2 rounded-full bg-[#fbf2e8] px-4 py-1.5 text-lg uppercase leading-none tracking-wider text-primary-orange lg:gap-3 lg:px-5 lg:py-2 lg:text-xl"
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
        onClick={() => {
          setIsMobileMenuOpen((prev) => !prev);
          if (isMobileMenuOpen) {
            setIsMobileShopsOpen(false);
            setIsMobileMoreOpen(false);
          }
        }}>
        <span>Menu</span>
        <span className="relative block h-3.5 w-5">
          <span
            className={`absolute left-0 top-0 h-0.5 w-5 bg-primary-orange transition-transform duration-200 ${
              isMobileMenuOpen ? 'translate-y-[6px] rotate-45' : ''
            }`}
          />
          <span
            className={`absolute left-0 top-[6px] h-0.5 w-5 bg-primary-orange transition-opacity duration-200 ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0 top-[12px] h-0.5 w-5 bg-primary-orange transition-transform duration-200 ${
              isMobileMenuOpen ? '-translate-y-[6px] -rotate-45' : ''
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
              onClick={() => {
                setIsMobileShopsOpen((prev) => !prev);
                setIsMobileMoreOpen(false);
              }}>
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
                    onClick={() =>
                      handleMobileShopSelect(shopItem.productType)
                    }>
                    {shopItem.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <button type="button" className="text-left uppercase">
            Sell Your Own
          </button>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="flex items-center justify-between uppercase"
              onClick={() => {
                setIsMobileMoreOpen((prev) => !prev);
                setIsMobileShopsOpen(false);
              }}>
              More
              <ChevronDownIcon />
            </button>
            {isMobileMoreOpen ? (
              <div className="flex flex-col gap-3 pl-3 text-lg text-[#fbf2e8]">
                {moreItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="flex items-center gap-2 text-left transition-opacity hover:opacity-80"
                    onClick={() => handleMobileMoreSelect(item)}>
                    {item === 'Bulk Order' && uiManager.isBulkMode ? (
                      <span className="h-2 w-2 rounded-full bg-[#6f9e9d]" />
                    ) : null}
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-sm font-semibold text-gray-700">
            <CartIcon />
          </button>
        </nav>
      ) : null}
    </div>
  );
};
