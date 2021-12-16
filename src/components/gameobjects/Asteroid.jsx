import React from 'react'

const Asteroid = ({ data }) => {

  const asteroidStyle = {
    left: `${data.x}px`,
    top: `${data.y}px`,
    transform: `rotate(${data.angle}deg)`,
    filter: `brightness(${data.hitFlash ? 2 : 1})`
  }

  return (
    <img src={data.path} style={asteroidStyle} alt="An asteroid"/>
  )
}

export default Asteroid