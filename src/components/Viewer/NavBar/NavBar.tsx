import { observer } from 'mobx-react-lite';

export const NavBar = observer(() => {
  return (
    <header className="fixed left-0 right-0 top-0 z-[1300] h-[72px] bg-[#88a69c] shadow-none">
      <div className="mx-auto flex h-[72px] items-center px-4 md:px-8">
        <h1 className="text-3xl font-extrabold tracking-[0.5px] text-[#f7f2ea]">
          HERE YOU GO PUP
        </h1>
        <nav className="ml-auto hidden gap-8 md:flex">
          <span className="font-bold text-[#f7f2ea]">SIZE GUIDE</span>
          <span className="font-bold text-[#f7f2ea]">SHOPS</span>
          <span className="font-bold text-[#f7f2ea]">SELL YOUR OWN</span>
          <span className="font-bold text-[#f7f2ea]">MORE</span>
        </nav>
      </div>
    </header>
  );
});
