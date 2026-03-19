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
      <p className="mb-2 hidden text-right text-xs font-medium text-gray-500 md:block">
        Showing {patterns.length} result
        {patterns.length === 1 ? '' : 's'}
      </p>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-4 lg:grid-cols-5 px-2 md:px-">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            type="button"
            onClick={() => onSelectPattern(pattern.id)}
            className={`group relative overflow-hidden rounded-md  transition-all ${
              selectedPatternId === pattern.id
                ? 'scale-102 ring-2 ring-pink'
                : 'border-gray-200'
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
