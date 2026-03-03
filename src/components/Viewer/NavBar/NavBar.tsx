import { observer } from 'mobx-react-lite';

export const NavBar = observer(() => {
  return (
    <header className="fixed left-0 top-0 z-[1300] h-20 w-full bg-[#86a8a1]">
      <div className="mx-auto flex h-full w-full items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#f6f1e8] text-lg text-[#f6f1e8]">
            ◉
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wide text-[#f6f1e8]">
            Here You Go Pup
          </h1>
        </div>
        <nav className="hidden items-center gap-10 text-base font-bold uppercase tracking-wide text-[#f6f1e8] lg:flex">
          <button type="button">Size Guide</button>
          <button type="button">Shops</button>
          <button type="button">Sell Your Own</button>
          <button type="button">More</button>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1c35a] text-xl text-[#525252]"
          >
            🛒
          </button>
        </nav>
      </div>
    </header>
  );
});
