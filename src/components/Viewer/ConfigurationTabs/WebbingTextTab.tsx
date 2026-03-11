import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { TextIcon } from '../../icons/Icons';
import { ColorSwatches } from './WebbingTextTab/ColorSwatches';
import { CustomColorPicker } from './WebbingTextTab/CustomColorPicker';
import { TextSizeSelector } from './WebbingTextTab/TextSizeSelector';
import { copyByTarget, textColors, textSizes, WebbingTextTarget } from './WebbingTextTab/webbingTextConfig';
import { FontSelectField } from './shared/FontSelectField';
import { TextInputWithCounter } from './shared/TextInputWithCounter';

const MAX_TEXT_LENGTH = 20;

type WebbingTextTabProps = { target: WebbingTextTarget };

export const WebbingTextTab = observer(({ target }: WebbingTextTabProps) => {
  const { designManager } = useMainContext();
  const webbingText = designManager.productManager.webbingText;
  const fonts = Array.from(webbingText.availableFonts.values());
  const copy = copyByTarget[target];

  return (
    <div className="space-y-4 p-3 text-gray-700 lg:space-y-5 lg:p-4">
      <section className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900 lg:text-xl">{copy.title}</h3>
        <p className="text-sm text-gray-500">{copy.description}</p>
      </section>

      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-400">Custom Text</h4>
        <div className="rounded-xl border border-gray-200 bg-gray-100/40 p-3 lg:border-0 lg:bg-transparent lg:p-2">
          <div className="flex justify-between gap-2">
            <TextIcon className="mt-2 hidden h-5 w-5 shrink-0 text-primary/70 lg:block" />
            <div className="w-full flex-col space-y-2.5 lg:space-y-3">
              <TextInputWithCounter
                value={webbingText.value}
                maxLength={MAX_TEXT_LENGTH}
                placeholder={copy.inputPlaceholder}
                onChange={(value) => webbingText.setText(value)}
              />
              <FontSelectField
                ariaLabel={copy.fontAriaLabel}
                selectedFont={webbingText.selectedFont}
                fonts={fonts}
                onSelectFont={(fontId) => webbingText.setFont(fontId)}
                containerClassName="bg-[#f8f8f8]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-200" />

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-400">Color of text</h4>
        {target === 'collar' ? (
          <CustomColorPicker selectedColor={webbingText.selectedColor} onChange={webbingText.setColor.bind(webbingText)} />
        ) : (
          <ColorSwatches colors={textColors} selectedColor={webbingText.selectedColor} onSelectColor={webbingText.setColor.bind(webbingText)} />
        )}
      </section>

      <div className="border-t border-gray-200" />

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-400">Size of text</h4>
        <TextSizeSelector selectedSize={webbingText.size} sizes={textSizes} onSelectSize={webbingText.setSize.bind(webbingText)} />
      </section>
    </div>
  );
});

