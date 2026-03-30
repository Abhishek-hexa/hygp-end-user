import { observer } from 'mobx-react-lite'
import WebTextured from '../EffectObj/WebTextured'
import Belt from './Belt'
import Bottom from './Bottom'
import Base from './Base'

const WebGroup = observer(() => {
  return (
    <>
    <WebTextured texturedName={'base1'} normalMapPath={'/assets/texture/texture/base1Normal.webp'} />
    <WebTextured texturedName={'base1Part'} normalMapPath={'/assets/texture/texture/base2Normal.webp'} />
    <Belt />
    <Bottom />
    <Base />
    </>
  )
})

export default WebGroup