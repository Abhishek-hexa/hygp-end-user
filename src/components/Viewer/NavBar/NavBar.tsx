import { observer } from 'mobx-react-lite';

export const NavBar = observer(() => {
  return (
    <header className="fixed left-0 top-0 z-50 h-20 w-full bg-primary">
      <div className="mx-auto flex h-full w-full items-center justify-between px-5">
        <div className="flex items-center">
          <img
            src="https://hereyougopup.com/cdn/shop/files/Logo_circle_Here_you_go_big.svg?v=1745832236&width=1070"
            alt="Here You Go Pup Logo"
            className="h-16 w-auto"
          />
        </div>
        <nav className="hidden font-ranchers items-center gap-10 text-xl font-normal tracking-wide text-amber-50 lg:flex">
          <button type="button" className="uppercase">Size Guide</button>
          <button type="button" className="uppercase">Shops</button>
          <button type="button" className="uppercase">Sell Your Own</button>
          <button type="button" className="uppercase">More</button>
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
