import {
  useBuckleOptionsQuery,
  useCollectionsQuery,
  useEngravingFontsQuery,
  usePatternsQuery,
  useProductVariantsQuery,
} from '../../../../api';
import { ProductManager } from '../../../../state/product/ProductManager';

export const useConfiguratorQueries = (productManager: ProductManager) => {
  const productId = productManager.productId;
  const variantsQuery = useProductVariantsQuery(productId);
  const buckleOptionsQuery = useBuckleOptionsQuery(productId, {
    enabled: productManager.hasBuckle() || productManager.hasHardware(),
  });
  const fontsQuery = useEngravingFontsQuery(false);
  const collectionsQuery = useCollectionsQuery();
  const patternsQuery = usePatternsQuery(
    productManager.material.selectedCollectionId,
    {
      enabled: !!productManager.material.selectedCollectionId,
    },
  );

  return {
    buckleOptionsQuery,
    collectionsQuery,
    fontsQuery,
    patternsQuery,
    variantsQuery,
  };
};
