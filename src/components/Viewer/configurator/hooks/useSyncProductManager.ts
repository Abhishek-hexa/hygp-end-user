import { useEffect } from 'react';

import { ProductManager } from '../../../../state/product/ProductManager';
import { useConfiguratorQueries } from './useConfiguratorQueries';

type Params = {
  productManager: ProductManager;
  queries: ReturnType<typeof useConfiguratorQueries>;
};

export const useSyncProductManager = ({
  productManager,
  queries,
}: Params) => {
  const {
    buckleOptionsQuery,
    collectionsQuery,
    fontsQuery,
    patternsQuery,
    variantsQuery,
  } = queries;

  useEffect(() => {
    if (productManager.productId !== 'dogCollar') {
      productManager.setProduct('dogCollar');
      productManager.setActiveTab('size');
      productManager.setSelectedCollectionId('');
    }
  }, [productManager]);

  useEffect(() => {
    const variants = variantsQuery.data?.variants ?? [];
    productManager.setBackendVariants(variants);
    if (!productManager.size.selectedSize && variants.length > 0) {
      productManager.size.setSize(variants[0].size);
    }
  }, [productManager, variantsQuery.data]);

  useEffect(() => {
    const options = buckleOptionsQuery.data ?? [];
    productManager.buckle.setOptions(options);
  }, [buckleOptionsQuery.data, productManager]);

  useEffect(() => {
    const fonts = fontsQuery.data ?? [];
    productManager.engraving.setAvailableFonts(fonts);
    productManager.text.setAvailableFonts(fonts);
  }, [fontsQuery.data, productManager]);

  useEffect(() => {
    const collections = collectionsQuery.data ?? [];
    productManager.setBackendCollections(collections);
    if (!productManager.selectedCollectionId && collections.length > 0) {
      productManager.setSelectedCollectionId(collections[0].id);
    }
  }, [collectionsQuery.data, productManager]);

  useEffect(() => {
    productManager.setBackendPatterns(patternsQuery.data ?? []);
  }, [patternsQuery.data, productManager]);
};
