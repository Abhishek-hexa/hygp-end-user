import { observer } from 'mobx-react-lite'
import WebTextured from '../EffectObj/WebTextured'
import Belt from './Belt'
import Bottom from './Bottom'
import Base from './Base'

const WebGroup = observer(() => {
  return (
    <>
    <WebTextured texturedName={'base1'} />
    <WebTextured texturedName={'base1Part'} />
    <Belt />
    <Bottom />
    <Base />
    </>
  )
})

export default WebGroup