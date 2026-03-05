import { observer } from 'mobx-react-lite';

export const NavBar = observer(() => {
  return (
    <header className="fixed left-0 top-0 z-50 h-20 w-full bg-lime-800">
      <div className="mx-auto flex h-full w-full items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-50 text-lg text-amber-50">
            O
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wide text-amber-50">
            Here You Go Pup
          </h1>
        </div>
        <nav className="hidden items-center gap-10 text-base font-bold uppercase tracking-wide text-amber-50 lg:flex">
          <button type="button">Size Guide</button>
          <button type="button">Shops</button>
          <button type="button">Sell Your Own</button>
          <button type="button">More</button>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-300 text-sm font-semibold text-gray-700"
          >
            Cart
          </button>
        </nav>
      </div>
    </header>
  );
});
