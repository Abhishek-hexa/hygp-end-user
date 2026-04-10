import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { Feature } from '../../../state/product/types';
import { TextIcon } from '../../icons/Icons';
import SectionHeader from '../Global/SectionHeader';
import { EngravingPlasticNotice } from './EngravingTab/EngravingPlasticNotice';
import { FontSelectField } from './shared/FontSelectField';
import { TextInputWithCounter } from './shared/TextInputWithCounter';

const linePlaceholders = [
  'PET NAME',
  'Phone Number 1',
  'Phone Number 2',
  'Type Text 4 Here',
];

type EngravingTabProps = {
  onNavigateToFeature?: (feature: Feature) => void;
  nextFeatureAfterEngraving?: Feature | null;
};

export const EngravingTab = observer(
  ({ onNavigateToFeature, nextFeatureAfterEngraving }: EngravingTabProps) => {
    const { designManager } = useMainContext();
    const engravingManager = designManager.productManager.engravingManager;
    const buckleManager = designManager.productManager.buckleManager;
    const fonts = Array.from(engravingManager.availableFonts.values());
    const activeLineIndex = engravingManager.activeLineIndex;
    const activeLine = engravingManager.lines[activeLineIndex];

    const isPlastic = buckleManager.material === 'PLASTIC';

    const handleChangeToMetal = () => {
      buckleManager.setMaterial('METAL');
      onNavigateToFeature?.(Feature.BUCKLE);
    };

    const handleKeepAsPlastic = () => {
      if (nextFeatureAfterEngraving != null) {
        onNavigateToFeature?.(nextFeatureAfterEngraving);
      }
    };

    if (isPlastic) {
      return (
        <div className="">
          <EngravingPlasticNotice
            onChangeToMetal={handleChangeToMetal}
            onKeepAsPlastic={handleKeepAsPlastic}
          />
        </div>
      );
    }

    return (
      <div className="">
        <section className="p-4 lg:p-6">
          <SectionHeader title="Buckle Engraving" />
        </section>

        {/* Mobile: stepper */}
        <div className="flex items-center gap-2 mb-4 px-4 lg:hidden">
          {engravingManager.lines.map((_, index) => {
            const isActive = activeLineIndex === index;
            const isCompleted =
              engravingManager.lines[index].text.trim().length > 0;
            return (
              <div
                key={`step-${index}`}
                className="flex min-w-0 flex-1 items-center">
                <button
                  type="button"
                  onClick={() => engravingManager.setActiveLine(index)}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center border-2 rounded-full text-2xl font-semibold ${
                    isActive
                      ? 'border-primary-dark bg-primary/10 text-primary'
                      : isCompleted
                        ? 'border-primary/60 bg-white text-primary/80'
                        : 'border-gray-300 bg-gray-100 text-gray-400'
                  }`}>
                  {index + 1}
                </button>
                {index < engravingManager.lines.length - 1 && (
                  <div className="mx-2 h-px flex-1 bg-primary/40" />
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border mx-4 mb-4 bg-gray-custom-light border-border p-3 lg:hidden">
          <div className="space-y-3">
            <TextInputWithCounter
              value={activeLine?.text ?? ''}
              maxLength={20}
              placeholder={
                linePlaceholders[activeLineIndex] ??
                `Line ${activeLineIndex + 1}`
              }
              onFocus={() => engravingManager.setActiveLine(activeLineIndex)}
              onChange={(value) =>
                engravingManager.setLineText(activeLineIndex, value)
              }
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

        {/* Desktop: all lines */}
        <div className="hidden space-y-4 lg:block lg:px-6 lg:pb-6">
          {engravingManager.lines.map((line, index) => (
            <div
              key={index}
              className="rounded-xl border bg-gray-custom-light p-4 border-border">
              <div className="flex items-start gap-3">
                <div className="pt-3 text-primary">
                  <TextIcon className="h-6 w-6 text-green" />
                </div>
                <div className="flex-1 space-y-3">
                  <TextInputWithCounter
                    value={line.text}
                    maxLength={20}
                    placeholder={linePlaceholders[index] ?? `Line ${index + 1}`}
                    onFocus={() => engravingManager.setActiveLine(index)}
                    onChange={(value) =>
                      engravingManager.setLineText(index, value)
                    }
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
  },
);
