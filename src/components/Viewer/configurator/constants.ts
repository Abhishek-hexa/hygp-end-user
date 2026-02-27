import { ProductManager } from '../../../state/product/ProductManager';
import { Features } from '../../../state/product/types';
import { TabId, TabOption } from './types';

const tabMeta: Record<TabId, TabOption> = {
  buckle: { id: 'buckle', label: 'Buckle' },
  'collar-text': { id: 'collar-text', label: 'Collar Text' },
  engraving: { id: 'engraving', label: 'Engraving' },
  fetch: { id: 'fetch', label: 'Fetch' },
  hardware: { id: 'hardware', label: 'Hardware' },
  'select-design': { id: 'select-design', label: 'Select Design' },
  size: { id: 'size', label: 'Size' },
};

const featureToTabMap: Partial<Record<Features, TabId>> = {
  buckle: 'buckle',
  'collar text': 'collar-text',
  design: 'select-design',
  engraving: 'engraving',
  hardware: 'hardware',
  'harness text': 'collar-text',
  size: 'size',
};

const orderedTabs: TabId[] = [
  'size',
  'select-design',
  'buckle',
  'hardware',
  'engraving',
  'collar-text',
  'fetch',
];

export const resolveTabsForProduct = (
  productManager: ProductManager,
): TabOption[] => {
  if (productManager.config.tabs.length > 0) {
    return productManager.config.tabs.map((tabId) => tabMeta[tabId]);
  }

  const featureTabs = new Set<TabId>();

  for (const feature of productManager.getAllFeatures()) {
    const tabId = featureToTabMap[feature];
    if (tabId) {
      featureTabs.add(tabId);
    }
  }

  if (productManager.hasMatchingLeash()) {
    featureTabs.add('fetch');
  }

  if (!featureTabs.size) {
    featureTabs.add('size');
    featureTabs.add('select-design');
  }

  return orderedTabs.filter((tabId) => featureTabs.has(tabId)).map((tabId) => tabMeta[tabId]);
};

export const textColorOptions = [
  '#2D9CDB',
  '#2F3F57',
  '#4BC0B2',
  '#E2B72F',
  '#35D0D2',
  '#EA6B6B',
];
