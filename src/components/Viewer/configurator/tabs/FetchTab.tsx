import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../../hooks/useMainContext';

export const FetchTab = observer(() => {
  const { designManager } = useMainContext();
  const { productManager } = designManager;
  const selectedVariant =
    productManager.backendVariants.find(
      (variant) => variant.size === productManager.size.selectedSize,
    ) ?? null;
  const totalAmount = selectedVariant?.price ?? 0;

  return (
    <>
      <h2 className="mb-2 text-[32px] font-bold">Fetch</h2>
      <p className="mb-1 font-bold text-[#6E8D84]">Matching Leash?</p>
      <select
        value={productManager.matchingLeash}
        onChange={(event) =>
          productManager.setMatchingLeash(String(event.target.value))
        }
        className="mb-3 w-full rounded-md border border-[#B8CCC5] bg-white px-3 py-2 text-sm text-[#2d3d37] outline-none focus:border-[#7AA79A]">
        <option value="No Leash">No Leash - $0.00</option>
      </select>
      <hr className="mb-2 border-0 border-t border-[#d8d8d8]" />
      <p className="text-sm font-bold text-[#6E8D84]">Total Amount</p>
      <p className="mb-2 text-[42px] font-extrabold text-[#4A4A4A]">
        ${totalAmount.toFixed(2)}
      </p>
      <button className="w-full rounded-full bg-[#EE8F90] py-1.5 text-[22px] font-extrabold text-white">
        Add to Cart
      </button>
    </>
  );
});
