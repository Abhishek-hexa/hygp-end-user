export const NavigationRoutes = {
  Default: '/',
  Developer: '/developer',
  NotFound: '*',
  Product: '/:productSlug',
  ProductBulk: '/:productSlug/bulk',
  ProductBulkPattern: '/:productSlug/bulk/patterns/:patternID',
  ProductPattern: '/:productSlug/pattern/:patternID',
  User: '/user',
} as const;
