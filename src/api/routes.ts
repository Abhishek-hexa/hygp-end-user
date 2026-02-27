import { ProductId } from '../state/product/types';

export const apiRoutes = {
  backgroundByType: (imageType: string) =>
    `/background-image/default?productType=${encodeURIComponent(imageType)}`,
  buckle: '/buckle',
  catBuckle: '/cat-buckle',
  collectionProducts: (webbingId: string) =>
    `/shopify-collection/products/${encodeURIComponent(webbingId)}`,
  collections: '/shopify-collection/',
  createOrder: '/orders/order-create',
  defaultFontData: '/default-font-data',
  designerUpload: '/designer/upload',
  engravingFonts: (isAdmin = false) =>
    isAdmin ? '/engraving-fonts?isAdmin=true' : '/engraving-fonts',
  harnessBuckle: '/harness-buckle',
} as const;

const productVariantsRouteByProductId: Record<ProductId, string> = {
  bandana: '/product/dog-bandanas/9022848696535',
  catCollar: '/product/cat-collar/454325797079',
  dogCollar: '/product/variants/8969048817879',
  harness: '/product/collar/9116181463255',
  leash: '/product/dog-leases/8870433947863',
  martingale: '/product/martingale/8975172141271',
};

export const resolveProductVariantsRoute = (productId: ProductId): string =>
  productVariantsRouteByProductId[productId];
