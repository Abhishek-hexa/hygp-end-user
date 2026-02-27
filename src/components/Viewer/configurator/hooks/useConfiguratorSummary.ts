import { useConfiguratorQueries } from './useConfiguratorQueries';

export const useConfiguratorSummary = (
  queries: ReturnType<typeof useConfiguratorQueries>,
) => {
  const { buckleOptionsQuery, collectionsQuery, fontsQuery, patternsQuery, variantsQuery } =
    queries;
  const hasAnyError =
    variantsQuery.error ||
    buckleOptionsQuery.error ||
    fontsQuery.error ||
    collectionsQuery.error ||
    patternsQuery.error;

  const loading =
    variantsQuery.isLoading ||
    buckleOptionsQuery.isLoading ||
    fontsQuery.isLoading ||
    collectionsQuery.isLoading;

  return { hasAnyError, loading };
};
