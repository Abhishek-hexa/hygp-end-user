import { observer } from 'mobx-react-lite';

export const NavBar = observer(() => {
  return (
    <header className="fixed left-0 top-0 z-[1300] h-16 w-full bg-blue-700">
      <div className="mx-auto flex h-full w-full items-center px-4">
        <h1 className="text-xl font-semibold text-white">
          Product Viewer
        </h1>
      </div>
    </header>
  );
});
