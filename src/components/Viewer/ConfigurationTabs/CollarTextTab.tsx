import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { TextSize } from '../../../state/product/types';
import {
  AIcon,
  ChevronDownIcon,
  TextIcon,
  SelectedItemIcon,
} from '../../icons/Icons';

const MAX_TEXT_LENGTH = 20;

const textSizes: Array<{ label: string; value: TextSize }> = [
  { label: 'Small', value: 'SMALL' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Large', value: 'LARGE' },
];

const textColors = [
  '#2d9ce6',
  '#374b67',
  '#4dc4b4',
  '#dfb029',
  '#44ddd7',
];

export const CollarTextTab = observer(() => {
  const { designManager } = useMainContext();
  const webbingTextManager = designManager.productManager.webbingText;
  const fonts = Array.from(webbingTextManager.availableFonts.values());
  const fontNameById = new Map(fonts.map((font) => [font.id, font.name]));

  return (
    <div className="space-y-5 text-gray-700 p-4">
      <section className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-900">
          Collar Custom Text
        </h3>
        <p className="text-sm text-gray-500">
          Make it unique with custom text on the strap.
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-400">Custom Text</h4>
        <div className='flex gap-2 justify-between p-2'>
          <TextIcon className="h-5 w-5 shrink-0 text-primary/70 mt-2" />
          <div className="flex-col space-y-3 w-full">
            <div className="flex flex-1 items-center rounded-lg border border-primary/65 px-3 py-2">
              <input
                type="text"
                value={webbingTextManager.value}
                maxLength={MAX_TEXT_LENGTH}
                placeholder="Type Your text here"
                onChange={(event) =>
                  webbingTextManager.setText(event.target.value)
                }
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
              <span className="ml-3 text-sm text-gray-500">
                {webbingTextManager.value.length}/{MAX_TEXT_LENGTH}
              </span>
            </div>

            <div className="relative flex items-center rounded-lg border border-primary/65 bg-[#f8f8f8] px-3 py-2">
              {webbingTextManager.selectedFont !== null ? (
                <span className="truncate pr-2 text-sm text-primary/80">
                  {fontNameById.get(webbingTextManager.selectedFont) ??
                    'Select font'}
                </span>
              ) : (
                <AIcon className="h-5 w-5 text-primary/80" />
              )}
              <ChevronDownIcon className="ml-auto h-4 w-4 text-primary/70" />
              <select
                aria-label="Select collar text font"
                value={webbingTextManager.selectedFont ?? ''}
                onChange={(event) =>
                  webbingTextManager.setFont(Number(event.target.value))
                }
                className="absolute inset-0 cursor-pointer opacity-0">
                <option value="" disabled>
                  Select font
                </option>
                {fonts.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-200" />

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-400">Color of text</h4>
        <div className="flex flex-wrap gap-3">
          {textColors.map((color, index) => {
            const isSelected = webbingTextManager.selectedColor === color;
            return (
              <button
                key={`${color}-${index}`}
                type="button"
                onClick={() => webbingTextManager.setColor(color)}
                className={`h-8 w-8 rounded-full border-2 transition-colors ${
                  isSelected ? 'border-primaryOrange' : 'border-primary/40'
                }`}
                style={{ background: color }}
                aria-label={`Text color ${index + 1}`}
              />
            );
          })}
        </div>
      </section>

      <div className="border-t border-gray-200" />

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-400">Size of text</h4>
        <div className="flex flex-wrap gap-2">
          {textSizes.map((size) => {
            const isSelected = webbingTextManager.size === size.value;
            return (
              <button
                key={size.value}
                type="button"
                onClick={() => webbingTextManager.setSize(size.value)}
                className={`relative min-w-24 rounded-lg border px-6 py-2 text-sm font-medium transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-gray-900'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}>
                {size.label}
                {isSelected ? (
                  <SelectedItemIcon
                    className="absolute right-1.5 top-1.5 h-3.5 w-3.5"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
});
