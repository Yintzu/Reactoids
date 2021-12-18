import React, { useEffect } from 'react'
import Particles from 'react-tsparticles'
import { options } from '../utilities/particleOptions.js'

const ParticleEmitter = ({ data, setParticleObjects }) => {

  console.log(`data from particle emitter`, data)

  const width = 100
  const height = 100

  const style = {
    position: 'absolute',
    left: `${data.x - width / 2}px`,
    top: `${data.y - height / 2}px`,
    width: `${width}px`,
    height: `${height}px`
  }

  const canvasStyle = {

  }

  useEffect(() => {
    setTimeout(() => {
      setParticleObjects(prev => prev.filter(item => item.id !== data.id))
    }, 800)
  }, [])

  return (
    <div className='particleEmitter' style={style}>
      <Particles options={options} width={100} height={100} className='particleCanvasWrapper' />
    </div>
  )
}

export default ParticleEmitter
