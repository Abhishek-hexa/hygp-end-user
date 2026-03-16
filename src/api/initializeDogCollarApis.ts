import { ProductManager } from '../state/product/ProductManager';
import { UiManager } from '../state/ui/UiManager';
import { initializeProductApis } from './initializeProductApis';

export const initializeDogCollarApis = async (
  productManager: ProductManager,
  uiManager: UiManager,
) => initializeProductApis(productManager, uiManager, 'DOG_COLLAR');
