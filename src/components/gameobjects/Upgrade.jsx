import React, { useEffect } from 'react'
import SprayUpgradeSprite from '../../assets/PowerupSpread.png'

const Upgrade = ({ data, upgradeObjects }) => {

  const lifetime = 1000

  // useEffect(() => {
  //   setTimeout(() => {
  //     upgradeObjects.current = upgradeObjects.current.filter(item => item.id !== data.id)
  //   }, lifetime)
  // }, []) //eslint-disable-line

  const upgradeStyle = {
    left: `${data.x}px`,
    top: `${data.y}px`,
  }

  return (
    <img src={SprayUpgradeSprite} style={upgradeStyle} alt="A powerup!"/>
  )
}

export default Upgrade
