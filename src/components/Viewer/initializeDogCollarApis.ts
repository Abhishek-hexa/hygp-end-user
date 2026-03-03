import axios from 'axios';

import { ProductManager } from '../../state/product/ProductManager';

const fetchJson = async <T>(
  baseUrl: string,
  path: string,
  label: string,
): Promise<T> => {
  const { data } = await axios.get<T>(`${baseUrl}${path}`);
  // eslint-disable-next-line no-console
  console.log(`[dog-collar-init] ${label}`, data);
  return data;
};

export const initializeDogCollarApis = async (
  productManager: ProductManager,
) => {
  productManager.setProduct('DOG_COLLAR');

  const baseUrl = String(import.meta.env.VITE_API_BASE_URL ?? '').replace(
    /\/$/,
    '',
  );

  try {
    const [variants, buckles, engravingFonts, collections] = await Promise.all([
      fetchJson<unknown>(
        baseUrl,
        '/product/variants/8969048817879',
        'product variants',
      ),
      fetchJson<unknown>(baseUrl, '/buckle', 'buckles'),
      fetchJson<unknown>(baseUrl, '/engraving-fonts', 'engraving fonts'),
      fetchJson<{ collections?: Array<{ id?: number | string }> }>(
        baseUrl,
        '/shopify-collection/',
        'collections',
      ),
    ]);

    const firstCollectionId = collections?.collections?.[0]?.id;

    if (firstCollectionId !== undefined && firstCollectionId !== null) {
      await fetchJson(
        baseUrl,
        `/shopify-collection/products/${String(firstCollectionId)}`,
        'collection products',
      );
    }

    // TODO: Map `variants`, `buckles`, `engravingFonts`, and collections/products
    // into product managers once API shape finalization is done.
    void variants;
    void buckles;
    void engravingFonts;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[dog-collar-init] API initialization failed', error);
  }
};
