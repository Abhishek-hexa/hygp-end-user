import { useEffect, useRef } from 'react';

import { ProductManager } from '../../../../state/product/ProductManager';
import { resolveTabsForProduct } from '../constants';
import { useConfiguratorQueries } from './useConfiguratorQueries';

type Params = {
  productManager: ProductManager;
  queries: ReturnType<typeof useConfiguratorQueries>;
};

export const useSyncProductManager = ({ productManager, queries }: Params) => {
  const {
    buckleOptionsQuery,
    collectionsQuery,
    fontsQuery,
    patternsQuery,
    variantsQuery,
  } = queries;
  const previousProductIdRef = useRef(productManager.productId);
  const productId = productManager.productId;

  useEffect(() => {
    if (previousProductIdRef.current === productId) {
      return;
    }

    previousProductIdRef.current = productId;

    void variantsQuery.refetch();
    void buckleOptionsQuery.refetch();
    void fontsQuery.refetch();
    void collectionsQuery.refetch();
  }, [
    buckleOptionsQuery,
    collectionsQuery,
    fontsQuery,
    productId,
    variantsQuery,
  ]);

  useEffect(() => {
    const tabs = resolveTabsForProduct(productManager);
    const activeTabExists = tabs.some(
      (tab) => tab.id === productManager.activeTab,
    );

    if (!activeTabExists && tabs.length > 0) {
      productManager.setActiveTab(tabs[0].id);
    }
  }, [productId, productManager]);

  useEffect(() => {
    const variants = variantsQuery.data?.variants ?? [];
    productManager.size.setBackendVariants(variants);
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
    productManager.texture.setBackendCollections(collections);

    const hasSelectedCollection = collections.some(
      (collection) =>
        collection.id === productManager.texture.selectedCollectionId,
    );

    if (
      (!productManager.texture.selectedCollectionId ||
        !hasSelectedCollection) &&
      collections.length > 0
    ) {
      productManager.texture.setSelectedCollectionId(collections[0].id);
    }
  }, [collectionsQuery.data, productId, productManager]);

  useEffect(() => {
    productManager.texture.setBackendPatterns(patternsQuery.data ?? []);
  }, [patternsQuery.data, productManager]);
};
