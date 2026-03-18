export const NavigationRoutes = {
  Default: '/',
  Product: '/:productSlug',
  ProductPattern: '/:productSlug/pattern/:patternID',
  Developer: '/developer',
  NotFound: '*',
  User: '/user',
} as const;
