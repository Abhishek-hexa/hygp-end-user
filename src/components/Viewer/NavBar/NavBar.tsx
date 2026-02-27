import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../hooks/useMainContext';
import { ProductId } from '../../../state/product/types';

const SHOPS: { label: string; id: ProductId }[] = [
  { label: 'Dog Collar', id: 'dogCollar' },
  { label: 'Cat Collar', id: 'catCollar' },
  { label: 'Martingale', id: 'martingale' },
  { label: 'Leash', id: 'leash' },
  { label: 'Bandana', id: 'bandana' },
  { label: 'Harness', id: 'harness' },
];

export const NavBar = observer(() => {
  const { designManager } = useMainContext();
  const { productManager } = designManager;

  return (
    <header className="fixed left-0 right-0 top-0 z-[1300] h-[72px] bg-[#88a69c] shadow-none">
      <div className="mx-auto flex h-[72px] items-center px-4 md:px-8">
        <h1 className="text-3xl font-extrabold tracking-[0.5px] text-[#f7f2ea]">
          HERE YOU GO PUP
        </h1>
        <nav className="ml-auto hidden h-full gap-8 md:flex">
          <div className="flex h-full cursor-pointer items-center">
            <span className="font-bold text-[#f7f2ea]">SIZE GUIDE</span>
          </div>

          <div className="group relative flex h-full cursor-pointer items-center">
            <span className="font-bold text-[#f7f2ea]">SHOPS</span>
            <div className="absolute left-0 top-full z-50 hidden w-48 flex-col overflow-hidden rounded-b-md border-t-2 border-[#88a69c] bg-white shadow-lg group-hover:flex">
              {SHOPS.map((shop) => (
                <button
                  key={shop.id}
                  className={`px-4 py-3 text-left text-sm font-bold uppercase transition-colors hover:bg-gray-50 hover:text-[#88a69c] ${
                    productManager.productId === shop.id
                      ? 'bg-[#f7f7f5] text-[#88a69c]'
                      : 'text-gray-700'
                  }`}
                  onClick={() => productManager.setProduct(shop.id)}
                >
                  {shop.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex h-full cursor-pointer items-center">
            <span className="font-bold text-[#f7f2ea]">SELL YOUR OWN</span>
          </div>
          <div className="flex h-full cursor-pointer items-center">
            <span className="font-bold text-[#f7f2ea]">MORE</span>
          </div>
        </nav>
      </div>
    </header>
  );
});
