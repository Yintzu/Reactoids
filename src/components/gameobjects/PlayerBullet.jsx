import React, { useEffect } from 'react'

const PlayerBullet = ({ data, setPlayerBullets }) => {
  const isLaser = data.type === 'laser'

  const lifetime = isLaser ? 2000 : 1000

  useEffect(() => {
    setTimeout(() => {
      setPlayerBullets(prev => {
        return prev.filter(item => item.id !== data.id)
      })
    }, lifetime)
  }, []) //eslint-disable-line

  const bulletStyle = {
    left: `${data.x}px`,
    top: `${data.y}px`,
    transform: `rotate(${data.angle}deg)`,
    transformOrigin: isLaser ? '50% 10% 0' : 'initial',
    animation: isLaser ? 'laserGrow 0.1s forwards' : 'none'
  }

  return (
    <img src={data.path} style={bulletStyle} alt="A player bullet" />
  )
}

export default PlayerBullet
