import { Environment } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { loadHdrEnvMapCached } from './hdrEnvMapCache';

export const LoadEnvironment = observer(() => {
    const [texture, setTexture] = useState(new THREE.Texture());

    useEffect(() => {
        loadHdrEnvMapCached('/assets/texture/texture/metro_vijzelgracht_1k2.hdr').then((texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.NearestFilter;
            setTexture(texture);
        });
    }, []);
    return (
        <Environment>
            <mesh rotation={[-1.86, 0.78, 0.06]} scale={100}>
                <sphereGeometry />
                <meshBasicMaterial
                    transparent
                    opacity={1}
                    map={texture ? texture : null}
                    side={THREE.BackSide}
                    toneMapped={false}
                />
            </mesh>
        </Environment>
    );
});

export default LoadEnvironment;
