import { observer } from 'mobx-react-lite';

import { ConfiguratorPanel } from './configurator/ConfiguratorPanel';
import { CanvasPanel } from './layout/CanvasPanel';
import { NavBar } from './NavBar/NavBar';

export const Viewer = observer(() => {
  return (
    <div className="h-screen w-full bg-white">
      <NavBar />
      <div className="mt-[72px] h-[calc(100vh-72px)] w-full">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_560px]">
          <CanvasPanel />
          <ConfiguratorPanel />
        </div>
      </div>
    </div>
  );
});
