import { PatternType } from '../../../../state/product/types';
import { SelectedItemIcon } from '../../../icons/Icons';
import { LazyImage } from '../../../shared/LazyImage';

type PatternGridProps = {
  onSelectPattern: (id: number) => void;
  patterns: PatternType[];
  selectedPatternId: number | null;
};

export const PatternGrid = ({
  onSelectPattern,
  patterns,
  selectedPatternId,
}: PatternGridProps) => {
  return (
    <div>
      <p className="hidden text-right text-xs py-2 px-4 font-normal text-gray-500 md:block">
        Showing {patterns.length} result
        {patterns.length === 1 ? '' : 's'}
      </p>
      <div className="grid grid-cols-5 gap-4 sm:grid-cols-4 lg:grid-cols-5 p-4 md:px-4 md:p-2">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            type="button"
            onClick={() => onSelectPattern(pattern.id)}
            className={`group relative overflow-hidden rounded-md  transition-all ${
              selectedPatternId === pattern.id
                ? 'scale-102 ring-4 ring-pink p-0.75'
                : 'border-gray-pattern border'
            }`}>
            <LazyImage
              src={pattern.preview}
              alt={pattern.name}
              className="aspect-square w-full object-cover"
            />
            {selectedPatternId === pattern.id ? (
              <SelectedItemIcon
                className="absolute left-[50%] top-[50%] h-6 w-6 -translate-x-1/2 -translate-y-1/2"
                version="white"
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
};
