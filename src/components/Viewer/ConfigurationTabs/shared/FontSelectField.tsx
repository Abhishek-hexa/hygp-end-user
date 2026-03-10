import { useEffect, useRef, useState } from 'react';
import { FontDescription } from '../../../../state/product/types';
import { AIcon, ChevronDownIcon } from '../../../icons/Icons';

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

  const fontNameById = new Map(fonts.map((font) => [font.id, font.name]));
  const selectedFontName =
    selectedFont !== null ? fontNameById.get(selectedFont) : null;

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
        className="flex w-full items-center rounded-lg border border-primary bg-white px-3 py-2 text-primary">
        <AIcon className="h-5 w-5 text-primary" />
        <span
          className="flex-1 truncate text-center text-lg"
          style={
            selectedFontName ? { fontFamily: selectedFontName } : undefined
          }>
          {selectedFontName ?? 'Select font'}
        </span>
        <ChevronDownIcon className="ml-auto h-4 w-4 text-primary" />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-lg border border-primaryOrange bg-white shadow-lg">
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
                } ${index !== fonts.length - 1 ? 'border-b border-primary/50' : ''}`}
              >
                <div className='h-8 w-full flex items-center justify-center'>
                  <img  
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
