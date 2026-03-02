import { observer } from 'mobx-react-lite';

import { NavBar } from './NavBar/NavBar';

export const Viewer = observer(() => {
  return (
    <div className="h-screen w-full bg-white">
      <NavBar />
      <div className="mt-16 flex h-[calc(100vh-64px)] w-full items-center justify-center text-[#444]">
        3D rendering is temporarily disabled.
      </div>
    </div>
  );
});
