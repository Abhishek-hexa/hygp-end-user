import { CartIcon } from '../../icons/Icons';

interface CartButtonProps {
  addToCartPrice?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const CartButton = ({
  addToCartPrice,
  onClick,
  type = 'button',
  className = '',
}: CartButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-1.5 rounded-full bg-primary-orange px-4 xs:px-7.5 md:px-4 py-2.5 md:py-2 font-ranchers text-sm font-normal uppercase tracking-[0.8px] text-white transition-opacity hover:opacity-95 ${className}`}>
      <CartIcon stroke="#fff" />

      <p className="text-lg md:text-base">
        Add to Cart
        {addToCartPrice && (
          <span className="hidden md:inline"> - ${addToCartPrice}</span>
        )}
      </p>
    </button>
  );
};
