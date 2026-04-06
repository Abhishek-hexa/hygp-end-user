import BuckleGroup from './BuckleGroup';
import { observer } from 'mobx-react-lite';
import WebGroup from './WebGroup';
import { useModel } from '../../../../hooks/useModel';

interface LoadHarnessProps {
  url: string;
}

const LoadHarness = observer(({ url }: LoadHarnessProps) => {
  useModel(url);

  return (
    <>
      <BuckleGroup />
      <WebGroup />
    </>
  );
});

export default LoadHarness;
