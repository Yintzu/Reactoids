import React, { useEffect } from 'react'
import Particles from 'react-tsparticles'
import SprayUpgradeSprite from '../../assets/PowerupSpread.png'
import { powerupOptions } from '../../utilities/particleOptions'

const Upgrade = ({ data, upgradeObjects }) => {

  const lifetime = 10000

  useEffect(() => {
    setTimeout(() => {
      upgradeObjects.current = upgradeObjects.current.filter(item => item.id !== data.id)
    }, lifetime)


  }, []) //eslint-disable-line

  const powerupStyle = {
    left: `${data.x}px`,
    top: `${data.y}px`,
  }

  return (
    <div className='powerupWrapper' style={{ position: 'absolute', ...powerupStyle, animation: 'var(--FADE_OUT)', animationDelay: '7s' }}>
      <img src={SprayUpgradeSprite} className='floatUpAndDown' alt="A powerup!" />
      <Particles id={data.id} width={50} height={50} options={powerupOptions} style={{ position: 'absolute', top: '-10px', left: '-10px' }} />
    </div>
  )
}

export default Upgrade
