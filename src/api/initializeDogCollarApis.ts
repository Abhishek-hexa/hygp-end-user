import { ProductManager } from '../state/product/ProductManager';
import { initializeProductApis } from './initializeProductApis';

export const initializeDogCollarApis = async (
  productManager: ProductManager,
) => initializeProductApis(productManager, 'DOG_COLLAR');
