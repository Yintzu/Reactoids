import React, { useEffect } from 'react'
import Particles from 'react-tsparticles'
import { options, optionsPlayer } from '../utilities/particleOptions.js'

const ParticleEmitter = ({ data, setParticleObjects }) => {

  const canvasWidth = data.id === 'player' ? 200 : 100
  const canvasHeight = data.id === 'player' ? 200 : 100

  const style = {
    position: 'absolute',
    left: `${data.x - canvasWidth / 2 + data.width / 2}px`,
    top: `${data.y - canvasHeight / 2 + data.height / 2}px`,
    width: `${canvasWidth}px`,
    height: `${canvasHeight}px`,
    // transform: `rotate(${data.angle}deg)`,
  }

  useEffect(() => {
    setTimeout(() => {
      setParticleObjects(prev => prev.filter(item => item.id !== data.id))
    }, 800)
  }, []) //eslint-disable-line

  return (
    <div className='particleEmitter' style={style}>
      <Particles id={data.id} options={data.id === 'player' ? optionsPlayer : options} width={canvasWidth} height={canvasHeight} className='particleCanvasWrapper' />
    </div>
  )
}

export default ParticleEmitter
