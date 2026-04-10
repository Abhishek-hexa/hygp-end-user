import { observer } from 'mobx-react-lite';

import { useCheckoutPayload } from '../../../hooks/useCheckoutPayload';
import { useMainContext } from '../../../hooks/useMainContext';
import { CartPayload, ProductType } from '../../../state/product/types';
import { CartIcon } from '../../icons/Icons';

type CartType =
  | 'bandana'
  | 'cat'
  | 'collar'
  | 'harness'
  | 'leash'
  | 'martingale';

export const PRODUCT_ID_TO_CART_TYPE: Record<ProductType, CartType> = {
  [ProductType.CAT_COLLAR]: 'cat',
  [ProductType.BANDANA]: 'bandana',
  [ProductType.DOG_COLLAR]: 'collar',
  [ProductType.HARNESS]: 'harness',
  [ProductType.LEASH]: 'leash',
  [ProductType.MARTINGALE]: 'martingale',
};

interface CartButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  onBeforePost?: (payload: CartPayload) => CartPayload;
}

export const CartButton = observer(
  ({ type = 'button', onClick, onBeforePost }: CartButtonProps) => {
    const { takeCartScreenshot, isLoading } = useCheckoutPayload(onBeforePost);
    const { designManager } = useMainContext();
    const productManager = designManager.productManager;
    const sizeManager = productManager.sizeManager;

    const cartType: CartType =
      PRODUCT_ID_TO_CART_TYPE[productManager.productId] ?? 'collar';

    const isBandana = cartType === 'bandana';

    const handleAddToCart = async (redirectToCollar = false): Promise<void> => {
      window.parent.postMessage('cartLoader', '*');
      onClick?.();
      await takeCartScreenshot(cartType, redirectToCollar);
    };

    return (
      <>
        <button
          type={type}
          disabled={isLoading}
          onClick={() => {
            void handleAddToCart(false);
          }}
          className="flex h-10 w-full items-center justify-center rounded-full bg-primary-orange px-4 font-ranchers text-sm font-normal uppercase tracking-[0.8px] text-white transition-opacity hover:opacity-95 disabled:opacity-60">
          <span className="flex items-center gap-2">
            <CartIcon stroke="#fff" />
            {isLoading ? 'Adding…' : `Add to cart $${sizeManager.totalPrice}`}
          </span>
        </button>

        {isBandana && (
          <button
            type={type}
            disabled={isLoading}
            onClick={() => {
              void handleAddToCart(true);
            }}
            className="mt-2 flex h-10 w-full items-center justify-center rounded-full border border-primary-orange px-4 font-ranchers text-sm font-normal uppercase tracking-[0.8px] text-primary-orange transition-opacity hover:opacity-95 disabled:opacity-60">
            <span className="flex items-center gap-2">
              <CartIcon stroke="currentColor" />
              {isLoading
                ? 'Adding…'
                : `Add to cart + matching collar $${sizeManager.totalPrice}`}
            </span>
          </button>
        )}
      </>
    );
  },
);
