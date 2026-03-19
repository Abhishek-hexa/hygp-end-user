import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMainContext } from '../../../hooks/useMainContext';
import { productTypeToSlug } from '../../../state/product/productRouting';
import { ProductType } from '../../../state/product/types';
import { CartIcon, ChevronDownIcon } from '../../icons/Icons';
import { LazyImage } from '../../shared/LazyImage';
import { MobileNavMenu } from './MobileNavMenu';

const shopItems: Array<{ label: string; productType: ProductType }> = [
  { label: 'Cat Collars', productType: 'CAT_COLLAR' },
  { label: 'Dog Bandanas', productType: 'BANDANA' },
  { label: 'Dog Collars', productType: 'DOG_COLLAR' },
  { label: 'Dog Leashes', productType: 'LEASH' },
  { label: 'Dog Harnesses', productType: 'HARNESS' },
  { label: 'Martingale Collars', productType: 'MARTINGALE' },
];

const moreItems = ['Bulk Order', 'Contact US', 'FAQ'] as const;
type MoreItem = (typeof moreItems)[number];

export const NavBar = observer(() => {
  const mainContext = useMainContext();
  const productManager = mainContext.designManager.productManager;
  const uiManager = mainContext.uiManager;
  const navigate = useNavigate();
  const [isShopsOpen, setIsShopsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const shopsMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const handleShopSelect = (productType: ProductType) => {
    if (productManager.productId === productType) {
      setIsShopsOpen(false);
      return;
    }

    setIsShopsOpen(false);
    navigate(`/${productTypeToSlug(productType)}`);
  };

  const handleMoreSelect = (item: MoreItem) => {
    uiManager.setBulkMode(item === 'Bulk Order');
    setIsMoreOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!shopsMenuRef.current) {
        setIsShopsOpen(false);
      }
      if (!moreMenuRef.current) {
        setIsMoreOpen(false);
      }
      if (
        shopsMenuRef.current &&
        !shopsMenuRef.current.contains(event.target as Node)
      ) {
        setIsShopsOpen(false);
      }
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setIsMoreOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <div className="h-16 w-full bg-primary lg:h-20">
        <div className="mx-auto flex h-full w-full items-center justify-between px-3 lg:px-5">
          <div className="flex items-center">
            <LazyImage
              src="/logo/mobileNavbar.png"
              alt="Here You Go Pup Logo"
              className="h-8 w-auto lg:hidden"
            />
            <LazyImage
              src="/logo/desktopNavbar.png"
              alt="Here You Go Pup Logo"
              className="hidden h-16 w-auto lg:block"
            />
          </div>
          <MobileNavMenu
            shopItems={shopItems}
            currentProductType={productManager.productId}
            onShopSelect={handleShopSelect}
          />
          <nav className="hidden font-ranchers items-center gap-10 text-xl font-normal tracking-wide text-amber-50 lg:flex">
            <button type="button" className="uppercase">
              Size Guide
            </button>
            <div ref={shopsMenuRef} className="relative">
              <button
                type="button"
                className="uppercase flex items-center gap-1"
                onClick={() => {
                  setIsShopsOpen((prev) => !prev);
                  setIsMoreOpen(false);
                }}>
                Shops <ChevronDownIcon />
              </button>
              {isShopsOpen ? (
                <div className="absolute left-1/2 top-full z-20 mt-3 -translate-x-1/2 bg-primary px-5 py-4 shadow-xl">
                  <div className="flex flex-col gap-4 text-2xl text-nowrap leading-1 uppercase text-[#fbf2e8]">
                    {shopItems.map((shopItem) => (
                      <button
                        key={shopItem.productType}
                        type="button"
                        className="text-left transition-opacity hover:opacity-80"
                        onClick={() => handleShopSelect(shopItem.productType)}>
                        {shopItem.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <button type="button" className="uppercase">
              Sell Your Own
            </button>
            <div ref={moreMenuRef} className="relative">
              <button
                type="button"
                className="uppercase flex items-center gap-1"
                onClick={() => {
                  setIsMoreOpen((prev) => !prev);
                  setIsShopsOpen(false);
                }}>
                More <ChevronDownIcon />
              </button>
              {isMoreOpen ? (
                <div className="absolute left-1/2 top-full z-20 mt-3 -translate-x-1/2 bg-primary px-5 py-4 shadow-xl">
                  <div className="flex flex-col gap-4 text-2xl text-nowrap leading-1 uppercase text-[#fbf2e8]">
                    {moreItems.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="text-left transition-opacity hover:opacity-80"
                        onClick={() => handleMoreSelect(item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-sm font-semibold text-gray-700">
              <CartIcon />
            </button>
          </nav>
        </div>
      </div>
      {uiManager.isBulkMode ? (
        <div className="flex h-8 w-full items-center justify-center bg-[#e6c8a2] px-3">
          <p className="font-ranchers text-base uppercase tracking-[0.16em] text-[#6f9e9d] lg:text-[1.45rem]">
            Bulk Order Mode Active
          </p>
        </div>
      ) : null}
    </header>
  );
});
