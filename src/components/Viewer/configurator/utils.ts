import { ApiBuckleOption, ApiPattern } from '../../../api';

export const resolvePatternPreview = (pattern: ApiPattern) =>
  pattern.image || pattern.textureUrl || '';

export const resolveBuckleFinishColor = (
  option: ApiBuckleOption,
  buckleType: ApiBuckleOption['type'] | null,
) => {
  if (buckleType === 'METAL') {
    return option.metalColor ?? option.previewColor ?? option.colors[0] ?? '#cccccc';
  }

  if (buckleType === 'PLASTIC' || buckleType === 'BREAKAWAY') {
    return option.plasticColor ?? option.previewColor ?? option.colors[0] ?? '#cccccc';
  }

  return option.previewColor ?? option.colors[0] ?? '#cccccc';
};

export const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
