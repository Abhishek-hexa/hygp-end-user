import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { ChevronDownIcon, TextIcon, AIcon } from '../../icons/Icons';

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
  const fontNameById = new Map(fonts.map((font) => [font.id, font.name]));

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
                <div className="flex items-center rounded-lg border border-primary/65 px-3 py-2">
                  <input
                    type="text"
                    value={line.text}
                    maxLength={20}
                    placeholder={linePlaceholders[index] ?? `Line ${index + 1}`}
                    onFocus={() => engravingManager.setActiveLine(index)}
                    onChange={(event) =>
                      engravingManager.setLineText(index, event.target.value)
                    }
                    className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:uppercase placeholder:text-gray-400"
                  />
                  <span className="ml-3 text-sm text-gray-500">
                    {line.text.length}/{20}
                  </span>
                </div>

                <div className="relative flex items-center rounded-lg border border-primary/65 px-3 py-2">
                  {line.font !== null ? (
                    <span className="truncate pr-2 text-sm text-primary/80">
                      {fontNameById.get(line.font) ?? 'Select font'}
                    </span>
                  ) : (
                    <AIcon className="h-5 w-5 text-primary/80" />
                  )}
                  <ChevronDownIcon className="ml-auto h-4 w-4 text-primary/70" />
                  <select
                    aria-label={`Select font for line ${index + 1}`}
                    value={line.font ?? ''}
                    onChange={(event) =>
                      engravingManager.setLineFont(
                        index,
                        Number(event.target.value),
                      )
                    }
                    className="absolute inset-0 cursor-pointer opacity-0">
                    {fonts.map((font) => (
                      <option key={font.id} value={font.id}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
