import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { useMainContext } from '../../../../hooks/useMainContext';
import WebTextured from '../EffectObj/WebTextured';
import { Buckle } from './Buckle';
import { Stitches } from './Stitches';
import EngravedBuckle from './EngravedBuckle';
import { observer } from 'mobx-react-lite';

type LoadCollarProps = {
  url: string;
  plasticUrl: string;
};

export const LoadCollar = observer(({ url, plasticUrl }: LoadCollarProps) => {
  const { design3DManager } = useMainContext();
  const { meshManager } = design3DManager;
  const { scene } = useGLTF(url);
  const plasticRes = useGLTF(plasticUrl);
  const plasticScene = plasticRes.scene;

  useEffect(() => {
    meshManager.setMeshGroup(url, scene, 'DEFAULT');
    meshManager.setMeshGroup(plasticUrl, plasticScene, 'PLASTIC');
  }, [meshManager, plasticScene, plasticUrl, scene, url]);

  return (
    <>
      <Buckle />
      <Stitches />
      <WebTextured texturedName="Web" />
      <EngravedBuckle />
    </>
  );
})
