import { useEffect, useRef, useState } from 'react';

import { FontDescription } from '../../../../state/product/types';
import { AIcon, ChevronDownIcon } from '../../../icons/Icons';
import { LazyImage } from '../../../shared/LazyImage';

type FontSelectFieldProps = {
  ariaLabel: string;
  containerClassName?: string;
  fonts: FontDescription[];
  onSelectFont: (fontId: number) => void;
  selectedFont: number | null;
};

export const FontSelectField = ({
  ariaLabel,
  containerClassName,
  fonts,
  onSelectFont,
  selectedFont,
}: FontSelectFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fontById = new Map(fonts.map((font) => [font.id, font]));
  const selectedFontData =
    selectedFont !== null ? fontById.get(selectedFont) : null;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelect = (fontId: number) => {
    onSelectFont(fontId);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${containerClassName ?? ''}`}
      aria-label={ariaLabel}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full h-12 items-center rounded-lg border border-primary bg-white p-3 text-primary">
        <AIcon className="h-6 w-6 text-primary" />
        <div className="mx-3 flex h-8 flex-1 items-center justify-center overflow-hidden">
          {selectedFontData ? (
            <LazyImage
              className="max-h-full max-w-full object-contain"
              src={selectedFontData.preview}
              alt={selectedFontData.name}
            />
          ) : (
            <span className="truncate text-base text-gray-400">Select font</span>
          )}
        </div>
        <ChevronDownIcon className="ml-auto h-4 w-4 text-primary" />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-lg border border-primary-orange bg-white shadow-lg">
          {fonts.map((font, index) => {
            const isSelected = selectedFont === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => handleSelect(font.id)}
                className={`flex w-full items-center justify-center p-2 text-center transition-colors ${
                  isSelected
                    ? 'bg-primary text-white'
                    : 'text-gray-800 hover:bg-gray-50'
                } ${index !== fonts.length - 1 ? 'border-b border-primary/50' : ''}`}>
                <div className="h-8 w-full flex items-center justify-center">
                  <LazyImage
                    className={`max-h-full max-w-full object-contain ${isSelected ? 'brightness-0 invert' : ''}`}
                    src={font.preview}
                    alt={font.name}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
