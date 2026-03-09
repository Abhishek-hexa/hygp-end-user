import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { TextIcon } from '../../icons/Icons';
import { FontSelectField } from './shared/FontSelectField';
import { TextInputWithCounter } from './shared/TextInputWithCounter';

const linePlaceholders = [
  'PET NAME',
  'Phone Number 1',
  'Phone Number 2',
  'Type Text 4 Here',
];

export const EngravingTab = observer(() => {
  const { designManager } = useMainContext();
  const engravingManager = designManager.productManager.engravingManager;
  const fonts = Array.from(engravingManager.availableFonts.values());

  return (
    <div className="space-y-5 text-gray-700 p-4">
      <section className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-900">Buckle Engraving</h3>
        <p className="text-sm text-gray-500">Add your pet's details for safety.</p>
      </section>

      <div className="space-y-3">
        {engravingManager.lines.map((line, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-gray-100 p-3"
          >
            <div className="flex items-start gap-3">
              <div className="pt-3 text-primary">
                <TextIcon className="h-5 w-5 text-primary/80" />
              </div>

              <div className="flex-1 space-y-2">
                <TextInputWithCounter
                  value={line.text}
                  maxLength={20}
                  placeholder={linePlaceholders[index] ?? `Line ${index + 1}`}
                  onFocus={() => engravingManager.setActiveLine(index)}
                  onChange={(value) => engravingManager.setLineText(index, value)}
                  inputClassName="placeholder:uppercase"
                />

                <FontSelectField
                  ariaLabel={`Select font for line ${index + 1}`}
                  selectedFont={line.font}
                  fonts={fonts}
                  onSelectFont={(fontId) =>
                    engravingManager.setLineFont(index, fontId)
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
