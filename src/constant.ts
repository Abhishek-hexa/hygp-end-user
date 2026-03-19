export const NavigationRoutes = {
  Default: '/',
  Product: '/:productSlug',
  ProductPattern: '/:productSlug/pattern/:patternID',
  ProductBulk: '/:productSlug/bulk',
  ProductBulkPattern: '/:productSlug/bulk/patterns/:patternID',
  Developer: '/developer',
  NotFound: '*',
  User: '/user',
} as const;
