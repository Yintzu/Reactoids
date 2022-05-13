import React, { useEffect } from 'react'
import Particles from 'react-tsparticles'
import PowerupSpriteSpread from '../../assets/PowerupSpread.png'
import PowerupSprite1k from '../../assets/Powerup1k.png'
import PowerupSpriteMG from '../../assets/PowerupMG.png'
import PowerupSpriteLaser from '../../assets/PowerupLaser.png'
import { powerupOptions } from '../../utilities/particleOptions'

const Powerup = ({ data, powerupObjects }) => {

  const lifetime = 10000

  const spriteCheck = () => {
    if (data.type === 'spread') return PowerupSpriteSpread
    if (data.type === '1k') return PowerupSprite1k
    if (data.type === 'mg') return PowerupSpriteMG
    if (data.type === 'laser') return PowerupSpriteLaser
  }

  useEffect(() => {
    setTimeout(() => {
      powerupObjects.current = powerupObjects.current.filter(item => item.id !== data.id)
    }, lifetime)
  }, []) //eslint-disable-line

  const powerupStyle = {
    left: `${data.x}px`,
    top: `${data.y}px`,
  }

  return (
    <div className='powerupWrapper' style={{ position: 'absolute', ...powerupStyle, animation: 'var(--FADE_OUT)', animationDelay: '7s' }}>
      <img src={spriteCheck()} className='floatUpAndDown' alt="A powerup!" />
      <Particles id={data.id} width={50} height={50} options={powerupOptions} style={{ position: 'absolute', top: '-10px', left: '-10px' }} />
    </div>
  )
}

export default Powerup
