import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { TextIcon } from '../../icons/Icons';
import { FontSelectField } from './shared/FontSelectField';
import { TextInputWithCounter } from './shared/TextInputWithCounter';

const linePlaceholders = [
  'Pet Name',
  'Phone Number 1',
  'Phone Number 2',
  'Type Text 4 Here',
];

export const EngravingTab = observer(() => {
  const { designManager } = useMainContext();
  const engravingManager = designManager.productManager.engravingManager;
  const fonts = Array.from(engravingManager.availableFonts.values());
  const activeLineIndex = engravingManager.activeLineIndex;
  const activeLine = engravingManager.lines[activeLineIndex];

  return (
    <div className="space-y-4 p-3 text-gray-700 lg:space-y-5 lg:p-4">
      <section className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900 lg:text-xl">Buckle Engraving</h3>
        <p className="text-sm text-gray-500 lg:text-sm">Add your pet's details for safety.</p>
      </section>

      <div className="flex items-center gap-2 lg:hidden">
        {engravingManager.lines.map((_, index) => {
          const isActive = activeLineIndex === index;
          const isCompleted = engravingManager.lines[index].text.trim().length > 0;

          return (
            <div key={`step-${index}`} className="flex min-w-0 flex-1 items-center">
              <button
                type="button"
                onClick={() => engravingManager.setActiveLine(index)}
                className={`flex h-10 w-10 shrink-0 items-center justify-center border-2 rounded-full text-2xl font-semibold ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : isCompleted
                      ? 'border-primary/60 bg-white text-primary/80'
                      : 'border-gray-300 bg-gray-100 text-gray-400'
                }`}
              >
                {index + 1}
              </button>
              {index < engravingManager.lines.length - 1 ? (
                <div className="mx-2 h-px flex-1 bg-primary/40" />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border bg-gray-100/50 p-3 lg:hidden">
        <div className="space-y-2">
          <TextInputWithCounter
            value={activeLine?.text ?? ''}
            maxLength={20}
            placeholder={linePlaceholders[activeLineIndex] ?? `Line ${activeLineIndex + 1}`}
            onFocus={() => engravingManager.setActiveLine(activeLineIndex)}
            onChange={(value) => engravingManager.setLineText(activeLineIndex, value)}
            inputClassName="placeholder"
          />

          <FontSelectField
            ariaLabel={`Select font for line ${activeLineIndex + 1}`}
            selectedFont={activeLine?.font ?? null}
            fonts={fonts}
            onSelectFont={(fontId) =>
              engravingManager.setLineFont(activeLineIndex, fontId)
            }
          />
        </div>
      </div>

      <div className="hidden space-y-3 lg:block">
        {engravingManager.lines.map((line, index) => (
          <div
            key={index}
            className="rounded-xl border bg-gray-custom-light p-3 border-gray-200"
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
                  inputClassName="placeholder"
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
