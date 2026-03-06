import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';

const linePlaceholders = [
  'Type Your text here',
  'Phone Number 1',
  'Phone Number 2',
  'Type Text 4 Here',
];

const FontIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 text-primary/80"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    aria-hidden="true">
    <path d="M5 20L12 4l7 16" />
    <path d="M8 14h8" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4 text-primary/70"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const EngravingTab = observer(() => {
  const { designManager } = useMainContext();
  const engravingManager = designManager.productManager.engravingManager;
  const fonts = Array.from(engravingManager.availableFonts.values());

  return (
    <div className="space-y-5 text-gray-700">
      <h3 className="text-xl font-semibold">Buckle Engraving</h3>

      <div className="space-y-4">
        {engravingManager.lines.map((line, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex flex-1 items-center rounded-xl border border-primary/45 bg-gray-100 px-4 py-3">
              <input
                type="text"
                value={line.text}
                maxLength={20}
                placeholder={linePlaceholders[index] ?? `Line ${index + 1}`}
                onChange={(event) =>
                  engravingManager.setLineText(index, event.target.value)
                }
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
              <span className="ml-3 text-sm text-gray-500">
                {line.text.length}/{20}
              </span>
            </div>

            <div className="relative flex h-12 w-24 shrink-0 items-center justify-between rounded-xl border border-primary/45 bg-gray-100 px-3">
              <FontIcon />
              <ChevronDownIcon />
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
        ))}
      </div>
    </div>
  );
});
