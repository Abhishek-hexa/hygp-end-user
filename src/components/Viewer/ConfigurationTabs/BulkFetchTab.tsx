import { FetchMeowTab } from './FetchMeowTab';

type BulkFetchTabProps = {
  feature: 'FETCH' | 'MEOW';
};

export const BulkFetchTab = ({ feature }: BulkFetchTabProps) => {
  return <FetchMeowTab feature={feature} />;
};
