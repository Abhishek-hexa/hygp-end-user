import { observer } from 'mobx-react-lite';

import { Camera } from './Camera/Camera.';
import { Canvas3D } from './Canvas3D/Canvas3D';
import { Env } from './Env/Env';
import { Light } from './Light/Light';
import { MeshCompute } from './MeshCompute/MeshCompute';

export const Viewer3D = observer(() => {
  return (
    <Canvas3D>
      <Camera />
      <Light />
      <Env />
      <MeshCompute />
    </Canvas3D>
  );
});
