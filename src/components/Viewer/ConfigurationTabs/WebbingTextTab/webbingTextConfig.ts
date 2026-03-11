import { TextSize } from '../../../../state/product/types';

export type WebbingTextTarget = 'collar' | 'leash' | 'harness';

type WebbingTextCopy = {
  title: string;
  description: string;
  fontAriaLabel: string;
  inputPlaceholder: string;
};

export const copyByTarget: Record<WebbingTextTarget, WebbingTextCopy> = {
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

export const textColors = ['#2d9ce6', '#374b67', '#4dc4b4', '#dfb029', '#44ddd7'];

export const textSizes: Array<{ label: string; value: TextSize }> = [
  { label: 'Small', value: 'SMALL' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Large', value: 'LARGE' },
];
