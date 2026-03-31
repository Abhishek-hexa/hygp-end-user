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
    description: 'Make it unique with custom text on the collar.',
    fontAriaLabel: 'Select collar text font',
    inputPlaceholder: 'Type your collar text here',
    title: 'Collar Custom Text',
  },
  harness: {
    description: 'Make it unique with custom text on the harness.',
    fontAriaLabel: 'Select harness text font',
    inputPlaceholder: 'Type your harness text here',
    title: 'Harness Custom Text',
  },
  leash: {
    description: 'Make it unique with custom text on the leash.',
    fontAriaLabel: 'Select leash text font',
    inputPlaceholder: 'Type your leash text here',
    title: 'Leash Custom Text',
  },
};


export const textSizes: Array<{ label: string; value: TextSize }> = [
  { label: 'Small', value: 'SMALL' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Large', value: 'LARGE' },
];
