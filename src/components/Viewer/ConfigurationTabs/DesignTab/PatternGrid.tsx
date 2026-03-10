import { PatternType } from '../../../../state/product/types';
import { SelectedItemIcon } from '../../../icons/Icons';

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
      <p className="mb-2 text-right text-xs font-medium text-gray-500">
        Showing {patterns.length} result
        {patterns.length === 1 ? '' : 's'}
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            type="button"
            onClick={() => onSelectPattern(pattern.id)}
            className={`group relative overflow-hidden rounded-md border transition-all ${
              selectedPatternId === pattern.id
                ? 'border-[#3f8f80] ring-2 ring-[#a7d3cc]'
                : 'border-gray-200 hover:border-[#8fb4ad]'
            }`}>
            <img
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
