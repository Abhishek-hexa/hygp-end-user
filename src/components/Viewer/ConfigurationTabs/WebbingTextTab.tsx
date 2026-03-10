import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { TextSize } from '../../../state/product/types';
import { SelectedItemIcon, TextIcon } from '../../icons/Icons';
import { FontSelectField } from './shared/FontSelectField';
import { TextInputWithCounter } from './shared/TextInputWithCounter';

const MAX_TEXT_LENGTH = 20;

type WebbingTextTarget = 'collar' | 'leash' | 'harness';

type WebbingTextCopy = {
  title: string;
  description: string;
  fontAriaLabel: string;
  inputPlaceholder: string;
};

const copyByTarget: Record<WebbingTextTarget, WebbingTextCopy> = {
  collar: {
    title: 'Collar Custom Text',
    description: 'Make it unique with custom text on the collar.',
    fontAriaLabel: 'Select collar text font',
    inputPlaceholder: 'Type your collar text here',
  },
  leash: {
    title: 'Leash Custom Text',
    description: 'Make it unique with custom text on the leash.',
    fontAriaLabel: 'Select leash text font',
    inputPlaceholder: 'Type your leash text here',
  },
  harness: {
    title: 'Harness Custom Text',
    description: 'Make it unique with custom text on the harness.',
    fontAriaLabel: 'Select harness text font',
    inputPlaceholder: 'Type your harness text here',
  },
};

const textSizes: Array<{ label: string; value: TextSize }> = [
  { label: 'Small', value: 'SMALL' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Large', value: 'LARGE' },
];

const textColors = ['#2d9ce6', '#374b67', '#4dc4b4', '#dfb029', '#44ddd7'];

type WebbingTextTabProps = {
  target: WebbingTextTarget;
};

export const WebbingTextTab = observer(({ target }: WebbingTextTabProps) => {
  const { designManager } = useMainContext();
  const webbingTextManager = designManager.productManager.webbingText;
  const fonts = Array.from(webbingTextManager.availableFonts.values());
  const copy = copyByTarget[target];

  return (
    <div className="space-y-5 p-4 text-gray-700">
      <section className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-900">{copy.title}</h3>
        <p className="text-sm text-gray-500">{copy.description}</p>
      </section>

      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-400">Custom Text</h4>
        <div className="flex justify-between gap-2 p-2">
          <TextIcon className="mt-2 h-5 w-5 shrink-0 text-primary/70" />
          <div className="w-full flex-col space-y-3">
            <TextInputWithCounter
              value={webbingTextManager.value}
              maxLength={MAX_TEXT_LENGTH}
              placeholder={copy.inputPlaceholder}
              onChange={(value) => webbingTextManager.setText(value)}
            />

            <FontSelectField
              ariaLabel={copy.fontAriaLabel}
              selectedFont={webbingTextManager.selectedFont}
              fonts={fonts}
              onSelectFont={(fontId) => webbingTextManager.setFont(fontId)}
              containerClassName="bg-[#f8f8f8]"
            />
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
                }`}
              >
                {size.label}
                {isSelected ? (
                  <SelectedItemIcon className="absolute right-1.5 top-1.5 h-3.5 w-3.5" />
                ) : null}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
});

