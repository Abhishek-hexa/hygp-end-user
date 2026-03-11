type ColorSwatchesProps = {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
};

export const ColorSwatches = ({ colors, selectedColor, onSelectColor }: ColorSwatchesProps) => {
  return (
    <div className="flex flex-wrap gap-2 lg:gap-3">
      {colors.map((color, index) => {
        const isSelected = selectedColor.toUpperCase() === color.toUpperCase();
        return (
          <button
            key={`${color}-${index}`}
            type="button"
            onClick={() => onSelectColor(color)}
            className={`h-7 w-7 rounded-full border-2 transition-colors lg:h-8 lg:w-8 ${
              isSelected ? 'border-primaryOrange' : 'border-primary/40'
            }`}
            style={{ background: color }}
            aria-label={`Text color ${index + 1}`}
          />
        );
      })}
    </div>
  );
};
