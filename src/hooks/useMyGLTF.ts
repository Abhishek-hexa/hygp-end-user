import { useGLTF } from '@react-three/drei';

export function useMyGLTF(url: string) {
  return useGLTF(url);
}

useMyGLTF.preload = (url: string) => useGLTF.preload(url);
