import { useEffect, useRef, useState } from 'react';

type ImageStatus = 'loading' | 'loaded' | 'error';

const cache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

function load(src: string): Promise<string> {
  if (cache.has(src)) return Promise.resolve(cache.get(src)!);
  if (pending.has(src)) return pending.get(src)!;

  const p = fetch(src)
    .then((r) => r.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      cache.set(src, url);
      pending.delete(src);
      return url;
    })
    .catch((err) => {
      pending.delete(src);
      throw err;
    });

  pending.set(src, p);
  return p;
}

export function useLazyImage(src: string) {
  const [status, setStatus] = useState<ImageStatus>(cache.has(src) ? 'loaded' : 'loading');
  const [imgSrc, setImgSrc] = useState<string | undefined>(cache.get(src));
  const latest = useRef(src);

  useEffect(() => {
    latest.current = src;

    const cached = cache.get(src);
    if (cached) {
      setStatus('loaded');
      setImgSrc(cached);
      return;
    }

    setStatus('loading');
    setImgSrc(undefined);

    load(src)
      .then((url) => {
        if (latest.current !== src) return;
        setStatus('loaded');
        setImgSrc(url);
      })
      .catch(() => {
        if (latest.current !== src) return;
        setStatus('error');
      });
  }, [src]);

  return { imgSrc, status };
}
