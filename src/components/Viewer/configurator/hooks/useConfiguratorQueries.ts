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
  const buckleOptionsQuery = useBuckleOptionsQuery(
    productId,
    productManager.hasBuckle() || productManager.hasHardware(),
  );
  const fontsQuery = useEngravingFontsQuery(false);
  const collectionsQuery = useCollectionsQuery();
  const patternsQuery = usePatternsQuery(
    productManager.texture.selectedCollectionId,
  );

  return {
    buckleOptionsQuery,
    collectionsQuery,
    fontsQuery,
    patternsQuery,
    variantsQuery,
  };
};
