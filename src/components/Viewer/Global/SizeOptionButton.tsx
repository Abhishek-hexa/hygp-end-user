// components/shared/SizeOptionButton.tsx
import { SelectedItemIcon } from '../../icons/Icons';

interface SizeOptionButtonProps {
  id: string;
  label: string;
  price: number | string;
  isSelected: boolean;
  onClick: () => void;
}

export const SizeOptionButton = ({
  id,
  label,
  price,
  isSelected,
  onClick,
}: SizeOptionButtonProps) => {
  return (
    <button
      key={id}
      type="button"
      onClick={onClick}
      className={`relative flex font-roboto min-w-32.5 shrink-0 flex-col items-start justify-center rounded-lg border border-border p-2.5 transition-colors lg:min-w-0 md:px-2 custom:px-4! lg:py-3 ${
        isSelected ? 'border-primary-dark bg-selected text-primary' : ''
      }`}>
      <span
        className={`text-xs font-semibold text-left text-font w-full leading-tight whitespace-normal ${isSelected ? '' : ''}`}>
        {label}
      </span>

      <span className="mt-1 text-xs font-normal text-font whitespace-normal">
        ${price}
      </span>

      {isSelected && (
        <div className="absolute right-1 top-1 shrink-0">
          <SelectedItemIcon />
        </div>
      )}
    </button>
  );
};
