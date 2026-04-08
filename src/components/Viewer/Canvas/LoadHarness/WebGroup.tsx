import { observer } from 'mobx-react-lite'
import WebTextured from '../EffectObj/WebTextured'
import Belt from './Belt'
import Bottom from './Bottom'
import Base from './Base'

const WebGroup = observer(() => {
  return (
    <>
      <WebTextured
        texturedName={'base1'}
        side={true}
        normalMapPath={'/assets/texture/texture/base1Normal.webp'}
        normalRepeat={[1, 1]}
        useLegacyHarnessTransform={true}
      />
      <WebTextured
        texturedName={'base1Part'}
        side={true}
        normalMapPath={'/assets/texture/texture/base2Normal.webp'}
        normalRepeat={[1, 1]}
        useLegacyHarnessTransform={true}
      />
      <Belt />
      <Bottom />
      <Base />
    </>
  );
});

export default WebGroup;
