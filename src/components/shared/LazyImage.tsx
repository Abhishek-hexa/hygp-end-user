import { type ComponentProps } from 'react';

import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useLazyImage } from '../../hooks/useLazyImage';

type LazyImageProps = ComponentProps<'img'>;

export const LazyImage = ({
  src = '',
  alt,
  className,
  ...rest
}: LazyImageProps) => {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>();
  const { imgSrc, status } = useLazyImage(src, isVisible);

  if (status === 'idle' || status === 'loading') {
    return (
      <div
        ref={ref}
        className={`skeleton-image ${className ?? ''}`}
        role="img"
        aria-label={alt ?? ''}
      />
    );
  }

  if (status === 'error') {
    return (
      <div
        className={className}
        role="img"
        aria-label={alt ?? 'Image failed to load'}
        style={{ backgroundColor: '#fecaca' }}
      />
    );
  }

  return <img src={imgSrc} alt={alt} className={className} {...rest} />;
};
