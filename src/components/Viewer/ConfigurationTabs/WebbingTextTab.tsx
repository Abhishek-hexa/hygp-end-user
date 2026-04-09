import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { TextIcon } from '../../icons/Icons';
import { FontSelectField } from './shared/FontSelectField';
import { TextInputWithCounter } from './shared/TextInputWithCounter';
import { CustomColorPicker } from './WebbingTextTab/CustomColorPicker';
import { TextSizeSelector } from './WebbingTextTab/TextSizeSelector';
import {
  copyByTarget,
  textSizes,
  WebbingTextTarget,
} from './WebbingTextTab/webbingTextConfig';
import SectionHeader from '../Global/SectionHeader';

const MAX_TEXT_LENGTH = 20;

type WebbingTextTabProps = { target: WebbingTextTarget };

export const WebbingTextTab = observer(({ target }: WebbingTextTabProps) => {
  const { designManager } = useMainContext();
  const webbingText = designManager.productManager.webbingText;
  const fonts = Array.from(webbingText.availableFonts.values());
  const copy = copyByTarget[target];

  return (
    <div className="p-4 lg:p-6">
      <SectionHeader title={copy.title} />

      <section className=" border-b-divider py-4 lg:pb-6 lg:pt-0">
        <h4 className="text-base mb-3 h-5 font-semibold text-gray-400  flex gap-1 items-center">
          <TextIcon className="h-5 w-5 shrink-0 text-primary/70 lg:hidden" />
          Custom Text
        </h4>
        <div className="rounded-xl lg:border-0 lg:bg-transparent">
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

      <section className="py-4 space-y-3">
        <h4 className="text-base font-semibold text-gray-400">Color of text</h4>
          <CustomColorPicker
            selectedColor={webbingText.selectedColor}
            onChange={webbingText.setColor.bind(webbingText)}
          />
      </section>

      <div className="border-t border-gray-200" />

      <section className="space-y-3 py-4">
        <h4 className="text-base font-semibold text-gray-400">Size of text</h4>
        <TextSizeSelector
          selectedSize={webbingText.size}
          sizes={textSizes}
          onSelectSize={webbingText.setSize.bind(webbingText)}
        />
      </section>
    </div>
  );
});
