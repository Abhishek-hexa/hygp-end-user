const normalizeHexColor = (value: string) => {
  const sanitized = value.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(sanitized)) {
    return null;
  }
  return `#${sanitized.toUpperCase()}`;
};

const presetColors = ['#2d9ce6', '#374b67', '#4dc4b4', '#dfb029', '#44ddd7'];

type CustomColorPickerProps = {
  selectedColor: string;
  onChange: (color: string) => void;
};

export const CustomColorPicker = ({
  selectedColor,
  onChange,
}: CustomColorPickerProps) => {
  const normalized = normalizeHexColor(selectedColor) ?? '#374B67';

  return (
    <div className="flex flex-wrap items-center gap-2 lg:gap-3">
      {presetColors.map((color, index) => {
        const isSelected = normalized.toUpperCase() === color.toUpperCase();
        return (
          <button
            key={`${color}-${index}`}
            type="button"
            onClick={() => onChange(color.toUpperCase())}
            className={`h-7 w-7 rounded-full border-2 transition-colors lg:h-8 lg:w-8 ${
              isSelected ? 'border-primary-orange' : 'border-primary/40'
            }`}
            style={{ background: color }}
            aria-label={`Text color ${index + 1}`}
          />
        );
      })}

      <label
        className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-primary/40 lg:h-8 lg:w-8"
        style={{
          background:
            'conic-gradient(from 0deg, #ff3b30, #ff9500, #ffcc00, #34c759, #00c7be, #007aff, #5856d6, #ff2d55, #ff3b30)',
        }}>
        <input
          type="color"
          value={normalized}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Pick custom text color"
        />
      </label>
    </div>
  );
};
