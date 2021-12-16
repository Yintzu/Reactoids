import React, { useEffect } from 'react'

const PlayerBullet = ({ data, setPlayerBullets }) => {

  const lifetime = 1000

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
  }

  return (
    <img src={data.path} style={bulletStyle} alt="A player bullet"/>
  )
}

export default PlayerBullet
