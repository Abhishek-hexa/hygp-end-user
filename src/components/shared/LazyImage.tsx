import { type ComponentProps } from 'react';

import { useLazyImage } from '../../hooks/useLazyImage';

type LazyImageProps = ComponentProps<'img'>;

export const LazyImage = ({ src = '', alt, className, ...rest }: LazyImageProps) => {
  const { imgSrc, status } = useLazyImage(src);

  if (status === 'loading') {
    return (
      <div
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
